require("dotenv").config();
const Discord = require("discord.js");
const {DiscordSR} = require("discord-speech-recognition");
const Queue = require("queue-promise");
const Embeds = require("./Embeds");
const GPT3 = require("./GPT3/GPT3");
const Personalities = require("./GPT3/Personalities");
const GuildSettings = require("./util/GuildSettings");
const vader = require("vader-sentiment");
const {typingAndResolve} = require("./util/Typing");
const {MsEdgeTTS} = require("msedge-tts");
const xmlescape = require("xml-escape");
const client = new Discord.Client({retryLimit: 10}); // Initiates the client
new DiscordSR(client);
require("./util/ExtendedMessage");

client.on("ready", () => {
    console.log("Bot Started!");
});

const queue = new Queue({
    concurrent: 1,
    interval: 2000,
});

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
        if (!guild.larry) guild.larry = new GuildSettings();

        // Handle message
        if (textLower === "larry status") {
            await message.channel.send(Embeds.status(guild.larry));
        } else if (textLower === "larry switch") {
            guild.larry.switchGPTType();
            await message.channel.send(Embeds.gptSwitched(guild.larry));
        } else if (textLower.startsWith("larry personality")) {
            const args = textLower.split(" ");
            if (!(guild.larry.gpt instanceof GPT3)) {
                await message.channel.send("Only GPT3 supports personality switching");
            } else if (args.length < 3) {
                await message.channel.send("No personality supplied");
            } else {
                const newPersonality = args[2];
                if (!Personalities.get(newPersonality)) {
                    await message.channel.send(`Invalid personality. Available options: ${Personalities.NAME_LIST}`);
                } else {
                    guild.larry.gpt.setPersonality(newPersonality);
                    await message.channel.send(Embeds.personalitySwitch(guild.larry));
                }
            }
        } else if (textLower === "larry reset") {
            guild.larry.gpt.reset();
            await message.channel.send("Aight, I'm ready for something new");
        } else if (textLower === "larry help") {
            await message.channel.send(Embeds.help());
        } else if (textLower === "larry leave") {
            const voiceChannel = await guild.me.voice && guild.me.voice.channel;
            if (voiceChannel) {
                await voiceChannel.leave();
                clearLeaveTimer(guild);
            } else {
                await message.channel.send("I'm not in a voice channel yet");
            }
        } else if (textLower === "larry join") {
            if (message.member.voice.channel) {
                guild.voiceConnetion = await message.member.voice.channel.join();
                setLeaveTimer(guild);
            } else {
                await message.channel.send("You need to join a voice channel first!");
            }
        } else if (message.mentions.has(client.user) && !textLower.startsWith("?")) {
            queue.enqueue(async () => {
                const resp = await typingAndResolve(message.channel, guild.larry.gpt.generateResponse(text.replace(/<@.*?>\s?/gm, "")));
                await message.inlineReply(resp.replace(/\.$/, ""), {allowedMentions: {repliedUser: false}});
            });
        }
    }
});

client.on("speech", async (message) => {
    const text = message.content;
    const guild = message.guild;

    if (text && text.trim().length > 0) {
        try {
            const resp = (await guild.larry.gpt.generateResponse(text))
                .replace(/[(<](.*?)[)>]/gm, ""); // replace anything between brackets

            const tts = new MsEdgeTTS();
            await tts.setMetadata("en-GB-RyanNeural", MsEdgeTTS.OUTPUT_FORMATS.WEBM_24KHZ_16BIT_MONO_OPUS);

            const style = inferVoiceStyle(text);
            const readable = tts.toStream(`
                <prosody pitch="${style.pitch}" rate="${style.rate}" volume="${style.volume}">
                    <mstts:express-as style="${style.style}" styledegree="${style.degree}">
                        ${xmlescape(resp)}
                    </mstts:express-as>
                </prosody> 
            `);

            setLeaveTimer(guild);
            guild.voiceConnetion.play(readable);
        } catch (e) {
            console.error(e);
        }
    }
});

const clearLeaveTimer = (guild) => {
    if (guild.leaveTimer) clearTimeout(guild.leaveTimer);
};

const setLeaveTimer = (guild) => {
    clearLeaveTimer(guild);
    guild.leaveTimer = setTimeout(async () => {
        if (guild.me.voice && guild.me.voice.channel) {
            const voiceChannel = await guild.me.voice.channel;
            voiceChannel.leave();
        }
    }, 10 * 60 * 1000);
};

const inferVoiceStyle = (text) => {
    const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);
    delete intensity.compound;
    const highestKey = Object.entries(intensity).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    switch (highestKey) {
        case "neg":
            return {style: "", degree: 1, pitch: "-5Hz", rate: "-5%", volume: "+10%"};
        case "neu":
            return {style: "newscast", degree: 0.25, pitch: "+0Hz", rate: "-5%", volume: "-5%"};
        case "pos":
            return {style: "newscast", degree: 2, pitch: "+4Hz", rate: "+2%", volume: "+0%"};
    }
};

client.login(process.env.BOT_TOKEN);


