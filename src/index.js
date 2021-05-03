require("dotenv").config();
const Discord = require("discord.js");
const Queue = require("queue-promise");
const GPT3 = require("./util/GPT3");
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

    if (textLower === "larry reset" && !!message.guild) {
        GPT3.reset(message.guild.id);
        await message.channel.send("Aight, I'm ready for something new");
    } else if (textLower === "larry help" && !!message.guild) {
        await message.channel.send("You can reset the conversation by typing `larry reset`");
    } else if (message.mentions.has(client.user) && !textLower.startsWith("?") && !!message.guild) {
        queue.enqueue(async () => {
            const resp = await typingAndResolve(message.channel, GPT3.generateResponse(text.replace(/<@.*?>\s?/gm, "") + "\n", message.guild.id));
            await message.channel.send(resp.replace(/\.$/, ""));
        });
    } else if (!message.guild) {
        await message.reply("I only work in guilds.");
    }
});

client.login(process.env.BOT_TOKEN);


