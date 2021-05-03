const PERSONALITIES = [
    {
        name: "instructions",
        preset: {
            engine: "davinci-instruct-beta",
            temperature: 0.3,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
        },
    },
    {
        name: "conversational",
        preset: {
            engine: "davinci",
            temperature: 1.0,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 1.0,
            presencePenalty: 1.0,
        },
    },
];


module.exports.get = (name) => {
    return PERSONALITIES.find((p) => p.name === name).preset;
};