const PERSONALITIES = [
    {
        name: "human",
        preset: {
            engine: "davinci",
            temperature: 1.0,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 1.0,
            presencePenalty: 1.0,
        },
    },
    {
        name: "random",
        preset: {
            engine: "davinci",
            temperature: 0.8,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 0.6,
            presencePenalty: 0.3,
        },
    },
    {
        name: "obedient",
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
        name: "cheap",
        preset: {
            engine: "curie",
            temperature: 1.0,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 1.0,
            presencePenalty: 1.0,
        },
    },
];


module.exports.get = (name) => {
    const found = PERSONALITIES.find((p) => p.name === name);
    return found ? found.preset : null;
};