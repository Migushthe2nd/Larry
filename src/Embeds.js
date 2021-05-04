const Discord = require("discord.js");

module.exports.status = (guildSettings) => {
    const embed = new Discord.MessageEmbed()
        .setColor("#FFA500")
        .setTitle("Status")
        .addField("Using:", `${guildSettings.gpt.constructor.name}`, true);

    if (guildSettings.gpt.personality) {
        embed.addField("Personality:", `${guildSettings.gpt.personality}`, true);
    }

    return embed;
};

module.exports.gptSwitched = (guildSettings) => {
    return new Discord.MessageEmbed()
        .setColor("#FFA500")
        .addField("Now Using:", `${guildSettings.gpt.constructor.name}`, true);
};

module.exports.personalitySwitch = (guildSettings) => {
    return new Discord.MessageEmbed()
        .setColor("#FFA500")
        .addField("New Personality:", `${guildSettings.gpt.personality}`, true);
};

module.exports.help = () => {
    return new Discord.MessageEmbed()
        .setColor("#FFA500")
        .setTitle("Command Help")
        .addField("`larry help`", "Shows this menu", false)
        .addField("`larry status`", "Shows the current configuration", false)
        .addField("`larry reset`", "Resets the conversation", false)
        .addField("`larry switch` (default: GPT3)", "Switches between GTP2 and GPT3. Current conversation will be reset.", false)
        .addField("`larry personality <cheap/random/obedient/human>` (default: human)", "Switches the GPT3 personality. Resets on every GPT switch.", false);
};