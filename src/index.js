require("dotenv").config();
const Discord = require("discord.js");
const Queue = require("queue-promise");
const Embeds = require("./Embeds");
const GPT3 = require("./GPT3/GPT3");
const Personalities = require("./GPT3/Personalities");
const GuildSettings = require("./util/GuildSettings");
const {typingAndResolve} = require("./util/Typing");

const client = new Discord.Client(); // Initiates the client

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
                    await message.channel.send("Invalid personality. Available options: cheap, random, obedient, human");
                } else {
                    guild.larry.gpt.personality = newPersonality;
                    await message.channel.send(Embeds.personalitySwitch(guild.larry));
                }
            }
        } else if (textLower === "larry reset") {
            guild.gpt.reset();
            await message.channel.send("Aight, I'm ready for something new");
        } else if (textLower === "larry help") {
            await message.channel.send(Embeds.help());
        } else if (message.mentions.has(client.user) && !textLower.startsWith("?")) {
            queue.enqueue(async () => {
                const resp = await typingAndResolve(message.channel, guild.larry.gpt.generateResponse(text.replace(/<@.*?>\s?/gm, "") + "\n"));
                await message.channel.send(resp.replace(/\.$/, ""));
            });
        }
    }
});

client.login(process.env.BOT_TOKEN);


