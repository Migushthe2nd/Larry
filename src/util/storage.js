const prompt = {};
const personalities = {};

module.exports.putPersonalityKey = (guildId, personality) => {
    return personalities[guildId] = personality;
};

module.exports.getPersonalityKey = (guildId) => {
    return personalities[guildId];
};

module.exports.putPrompt = (guildId, prompt) => {
    prompt[guildId] = prompt;
};

module.exports.getPrompt = (guildId) => {
    return prompt[guildId];
};