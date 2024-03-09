require("dotenv").config();
const Discord = require("discord.js");
const {
    joinVoiceChannel,
    getVoiceConnection,
    demuxProbe,
    createAudioResource,
    createAudioPlayer,
} = require("@discordjs/voice");
const {addSpeechEvent} = require("discord-speech-recognition");
const Queue = require("queue-promise");
const Embeds = require("./Embeds");
const GPT3 = require("./GPT3/GPT3");
const Personalities = require("./GPT3/Personalities");
const GuildSettings = require("./util/GuildSettings");
const vader = require("vader-sentiment");
const {MsEdgeTTS, OUTPUT_FORMAT} = require("msedge-tts");
const xmlescape = require("xml-escape");
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
    retryLimit: 10,
}); // Initiates the client
addSpeechEvent(client, {lang: "nl-NL"});

const botAdminIds = ["123859829453357056"];

client.on("ready", () => {
    console.log("Bot Started!");
});

const queue = new Queue({
    concurrent: 1,
    interval: 2000,
});

const PREFIX = "larry";

client.on("message", async (message) => {
    const text = message.content;
    const textLower = message.content.toLowerCase();
    const guild = message.guild;

    if (message.author.bot) {
        return;
    } else if (!guild) {
        await message.reply("I only work in guilds.");
    } else {
        // Generate initial settings
        setInitialSettings(guild);

        // Handle message
        if (textLower.startsWith(PREFIX)) {
            // Command
            const commandArgs = message.content.slice(PREFIX.length).trim().split(" ");
            const command = commandArgs.shift();

            if (command === "status") {
                await message.channel.send({embeds: [Embeds.status(guild.larry)]});
                return;
            } else if (command === "personality") {
                if (!(guild.larry.gpt instanceof GPT3)) {
                    await message.channel.send("Only GPT3 supports personality switching");
                } else if (commandArgs.length === 0) {
                    await message.channel.send({embeds: [Embeds.invalidPersonality()]});
                } else {
                    const newPersonality = commandArgs[0];
                    if (!Personalities.get(newPersonality)) {
                        await message.channel.send({embeds: [Embeds.invalidPersonality()]});
                    } else {
                        guild.larry.gpt.setPersonality(newPersonality);
                        await message.channel.send({embeds: [Embeds.personalitySwitch(guild.larry)]});
                    }
                }
                return;
            } else if (command === "reset") {
                guild.larry.gpt.reset();
                await message.channel.send({embeds: [Embeds.reset()]});
                return;
            } else if (command === "help") {
                await message.channel.send({embeds: [Embeds.help()]});
                return;
            } else if (command === "leave") {
                const voiceChannel = await guild.me.voice && guild.me.voice.channel;
                if (voiceChannel) {
                    getVoiceConnection(voiceChannel.guild.id).destroy();
                    clearLeaveTimer(guild);
                } else {
                    await message.channel.send({embeds: [Embeds.notInVcYet()]});
                }
                return;
            } else if (command === "join") {
                const voice = message.member.voice.channel;
                if (voice) {
                    guild.larry.gpt.setPersonality("mens");
                    guild.voiceConnetion = await joinVoiceChannel({
                        channelId: voice.id,
                        guildId: voice.guild.id,
                        adapterCreator: voice.guild.voiceAdapterCreator,
                        selfDeaf: false,
                    });
                    setLeaveTimer(guild);
                } else {
                    await message.channel.send({embeds: [Embeds.joinVcFirst()]});
                }
                return;
            }
        }

        if (message.mentions.has(client.user) && !textLower.startsWith("?quote")) {
            // Generate response
            queue.enqueue(async () => {
                await message.channel.sendTyping();
                const resp = await guild.larry.gpt.generateResponse(text.replace(/<@.*?>\s?/gm, ""), false, botAdminIds.includes(message.author.id));
                await message.reply({content: resp.replace(/\.$/, ""), allowedMentions: {repliedUser: false}});
            });
        }
    }
});

client.on("speech", async (message) => {
    console.log("Speech detected ---------------------------------------------------");
    const text = message.content;
    const guild = message.guild;

    // Generate initial settings
    setInitialSettings(guild);

    if (text && text.trim().length > 0 && !guild.larry.speechBusy) {
        guild.larry.speechBusy = true;
        try {
            const resp = (await guild.larry.gpt.generateResponse(text, true, botAdminIds.includes(message.author.id)))
                .replace(/[(<](.*?)[)>]/gm, ""); // replace anything between brackets

            const tts = new MsEdgeTTS();
            await tts.setMetadata("nl-NL-MaartenNeural", OUTPUT_FORMAT.WEBM_24KHZ_16BIT_MONO_OPUS);

            const style = inferVoiceStyle(text);
            const readable = await tts.toStream(`
                <prosody pitch="${style.pitch}" rate="${style.rate}" volume="${style.volume}">
                    <mstts:express-as style="${style.style}" styledegree="${style.degree}">
                        ${xmlescape(resp)}
                    </mstts:express-as>
                </prosody> 
            `);

            setLeaveTimer(guild);
            const audioPlayer = {
                musicStream: createAudioPlayer(),
                connection: null,
                connectionId: null,
            };
            getVoiceConnection(guild.id).subscribe(audioPlayer.musicStream);

            async function probeAndCreateResource(readableStream) {
                const {stream, type} = await demuxProbe(readableStream);
                return createAudioResource(stream, {inputType: type});
            }

            audioPlayer.musicStream.play(await probeAndCreateResource(readable));
        } catch (e) {
            console.error(e);
        } finally {
            guild.larry.speechBusy = false;
        }
    }
});

const setInitialSettings = (guild) => {
    if (!guild.larry) guild.larry = new GuildSettings();
};

const clearLeaveTimer = (guild) => {
    if (guild.larry.leaveTimer) clearTimeout(guild.larry.leaveTimer);
};

const setLeaveTimer = (guild) => {
    clearLeaveTimer(guild);
    guild.larry.leaveTimer = setTimeout(async () => {
        if (guild.me.voice && guild.me.voice.channel) {
            const voiceChannel = await guild.me.voice.channel;
            getVoiceConnection(voiceChannel.guild.id).destroy();
        }
    }, 10 * 60 * 1000);
};

const inferVoiceStyle = (text) => {
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    delete intensity.compound;
    const highestKey = Object.entries(intensity).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    switch (highestKey) {
        case "neg":
            return {style: "", degree: 1, pitch: "-5Hz", rate: "0%", volume: "+10%"};
        case "neu":
            return {style: "newscast", degree: 0.25, pitch: "+0Hz", rate: "+5%", volume: "-5%"};
        case "pos":
            return {style: "newscast", degree: 2, pitch: "+4Hz", rate: "+8%", volume: "+0%"};
    }
};

client.login(process.env.BOT_TOKEN);


