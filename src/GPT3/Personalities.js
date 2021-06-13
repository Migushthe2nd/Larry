/*
    Here are a few different personalities that can be picked from using the 'personality' command:
    'cheap' is the default
 */
const PERSONALITIES = [
    // Really follows the conversation and gets confused by random questions, logical answers, can be explicit, less repetitive.
    // Can understand complex wordings.
    {
        name: "human",
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        maxPromptLines: 8,
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "davinci",
            temperature: 1.0,
            maxTokens: 60,
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
        maxPromptLines: 8,
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "davinci",
            temperature: 0.8,
            maxTokens: 60,
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
        maxPromptLines: 8,
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "davinci-instruct-beta",
            temperature: 0.3,
            maxTokens: 60,
            topP: 1.0,
            frequencyPenalty: 0.3,
            presencePenalty: 0.2,
        },
    },
    // Does not really follow a conversation. Very good at performing tasks.
    {
        name: "terminal",
        startPrompt: "The following is terminal input and output\n\n$ ls /etc\n> /etc/hosts  /etc/hostname  /etc/passwd  /etc/resolv.conf  /etc/shadow  /etc/sudoers\n$ which nano\n> /usr/bin/nano\n$ git add --all\n> Added new file.",
        stop: ["\n$"],
        maxPromptLines: 4,
        newInput: (input) => "\n$ " + input.replace(/\n/gm, " ") + "\n>",
        cleanOutput(output) {
            // also start the first line with a >
            const newLines = [];
            output.trim().split("\n").forEach((line) => {
                const newLine = line
                    .replace(/^([>#])\s?/i, "") // existing > or #
                    .replace(/^\s/g, "⠀") // leading space is empty braille
                    .replace(/.+?@.+:.+\$/i, "") // user path etc (user@computer:~/directory$)
                    .replace(/\\/g, "\\\\")
                    .replace(/:/g, "\\:")
                    .trim();
                if (newLine.length > 0) newLines.push("> " + newLine);
            });

            return newLines.join("\n");
        },
        noResponse: "_no output_",
        preset: {
            engine: "davinci-instruct-beta",
            temperature: 0.3,
            maxTokens: 120,
            topP: 1.0,
            frequencyPenalty: 1,
            presencePenalty: 0.1,
        },
    },
    // Uses the Curie engine. Costs less.
    {
        name: "cheap",
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        maxPromptLines: 8,
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output) {
            // if starts with :, and not discord emoji
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                return output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                return output;
            }
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "curie",
            temperature: 1.0,
            maxTokens: 60,
            topP: 1.0,
            frequencyPenalty: 1.0,
            presencePenalty: 1.0,
        },
    },
];

module.exports.NAME_LIST = PERSONALITIES.map(p => p.name).join(", ");
module.exports.get = (name) => PERSONALITIES.find((p) => p.name === name);