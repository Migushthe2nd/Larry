/*
    Here are a few different personalities that can be picked from using the 'personality' command:
    'cheap' is the default
 */
const PERSONALITIES = [
    // Really follows the conversation and gets confused by random questions, logical answers, can be explicit, less repetitive.
    // Can understand complex wordings.
    {
        name: "human",
        prompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
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
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
        preset: {
            engine: "davinci",
            temperature: 0.8,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 0.6,
            presencePenalty: 0.3,
        },
    },
    // Does not really follow a conversation. Very good at performing tasks.
    {
        name: "obedient",
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
        preset: {
            engine: "davinci-instruct-beta",
            temperature: 0.3,
            maxTokens: 80,
            topP: 1.0,
            frequencyPenalty: 0.3,
            presencePenalty: 0.2,
        },
    },
    // Does not really follow a conversation. Very good at performing tasks.
    {
        name: "terminal",
        startPrompt: "The following is terminal input and output\n\n$ ls\nout: GHunt  apps  file  smart-url-fuzzer\n$ which nano\nout: /usr/bin/nano",
        stop: ["\n"],
        newInput: (input) => "\n$ " + input.replace(/\n/gm, " ") + "\n",
        cleanOutput(output) {
            // if the server generates a $ sign, remove it
            return output.replace(/\n?\$$/gm, "");
        },
        preset: {
            engine: "davinci",
            temperature: 0.3,
            maxTokens: 60,
            topP: 1.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
        },
    },
    // Uses the Curie engine. Costs less.
    {
        name: "cheap",
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
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

module.exports.NAME_LIST = PERSONALITIES.map(p => p.name).join(", ");
module.exports.get = (name) => PERSONALITIES.find((p) => p.name === name);