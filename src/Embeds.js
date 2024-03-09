const Discord = require("discord.js");
const {NAME_LIST} = require("./GPT3/Personalities");

module.exports.status = (guildSettings) => {
    const embed = new Discord.MessageEmbed()
        .setColor("#17d711")
        .setTitle("Status")
        .addField("Using:", `${guildSettings.gpt.constructor.name}`, true);

    if (guildSettings.gpt.personality) {
        embed.addField("Personality:", `${guildSettings.gpt.personality}`, true);
    }

    return embed;
};

module.exports.reset = () => {
    return new Discord.MessageEmbed()
        .setColor("#e50b0b")
        .setDescription("_Conversation reset_");
};

module.exports.invalidPersonality = () => {
    return new Discord.MessageEmbed()
        .setColor("#e50b0b")
        .setDescription("_Invalid Personality_")
        .addField("Example:", `\`larry personality <${NAME_LIST.replace(/,\s/g, "/")}>\``, true);
};

module.exports.joinVcFirst = () => {
    return new Discord.MessageEmbed()
        .setColor("#e50b0b")
        .setDescription("You need to join a voice channel first!");
};

module.exports.notInVcYet = () => {
    return new Discord.MessageEmbed()
        .setColor("#e50b0b")
        .setDescription("I'm not in a voice channel yet")
        .addField("Run `join` first:", `\`larry join\``, true);
};

module.exports.gptSwitched = (guildSettings) => {
    return new Discord.MessageEmbed()
        .setColor("#00d7ec")
        .setDescription("_Conversation reset_")
        .addField("Now Using:", `${guildSettings.gpt.constructor.name}`, true);
};

module.exports.personalitySwitch = (guildSettings) => {
    return new Discord.MessageEmbed()
        .setColor("#00d7ec")
        .setDescription("_Conversation reset_")
        .addField("New Personality:", `${guildSettings.gpt.personality}`, true);
};

module.exports.help = () => {
    return new Discord.MessageEmbed()
        .setColor("#00d7ec")
        .setTitle("Command Help")
        .addField("`larry help`", "Shows this menu", false)
        .addField("`larry status`", "Shows the current configuration", false)
        .addField("`larry reset`", "Resets the conversation", false)
        .addField("`larry join`", "Joins your current voice channel. Will use the same message history as the written messages.", false)
        .addField("`larry leave`", "Leaves the voice channel it is currently in.", false)
        .addField(`\`larry personality <${NAME_LIST.replace(/,\s/g, "/")}> (default: human)\``, "Switches the GPT3 personality. Current conversation will be reset.", false);
};