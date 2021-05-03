/*
    Here are a few different personalities that can be picked from using the 'personality' command:
    'cheap' is the default
 */
const PERSONALITIES = [
    // Really follows the conversation and gets confused by random questions, logical answers, can be explicit, less repetitive.
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
    // Works with random questions, is a bit random and repetitive.
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
    // Works does not really follow a conversation. Very good at performing tasks.
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
    // Uses the Curie engine. Costs less
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