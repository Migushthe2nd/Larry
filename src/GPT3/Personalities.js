/*
    Here are a few different personalities that can be picked from using the 'personality' command:
    'human' is the default
 */
const {encode} = require("gpt-3-encoder");

const censorText = (text) => {
    return text.trim().split("\n").map((line) => "||" + line + "||").join("\n");
};

const P_LIGHT = 1;
const P_MEDIUM = 3;
const P_HEAVY = 5;

const tokenizeToBiases = (obj) => {
    const tokenized = {};
    Object.keys(obj).forEach((word) => {
        // This would ban ALL tokens
        // encode(word).forEach((token) => {
        //     tokenized[token] = obj[word];
        // });

        // This will only affect the first token
        const encoded = encode(word);
        if (encoded.length > 0) {
            tokenized[encode(word)[0]] = obj[word];
        }
    });
    console.log(tokenized);
    return tokenized;
};
module.exports.tokenizeToBiases = tokenizeToBiases;

const PERSONALITIES = [
    // Really follows the conversation and gets confused by random questions, logical answers, can be explicit, less repetitive.
    // Can understand complex wordings.
    {
        name: "human",
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        maxPromptLines: 6,
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output, isDisturbing) {
            let finalOutput;
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                finalOutput = output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                finalOutput = output;
            }

            return isDisturbing ? censorText(finalOutput) : finalOutput;
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "davinci",
            temperature: 0.9,
            maxTokens: 35,
            topP: 1.0,
            frequencyPenalty: 0.9,
            presencePenalty: 0.9,
        },
    },
    // Works with random questions, is a bit random and repetitive.
    {
        name: "random",
        startPrompt: "Q: What's the capitol of France?\nA: Paris is the capitol of France.\nQ: What's 50+9?\nA: 50+9 is 59.",
        stop: ["Q:", "A:", "\n"],
        maxPromptLines: 6,
        newInput: (input) => "\nQ: " + input.replace(/\n/gm, " ") + "\nA:",
        cleanOutput(output, isDisturbing) {
            let finalOutput;
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                finalOutput = output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                finalOutput = output;
            }

            return isDisturbing ? censorText(finalOutput) : finalOutput;
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "davinci",
            temperature: 0.8,
            maxTokens: 30,
            topP: 1.0,
            frequencyPenalty: 0.6,
            presencePenalty: 0.3,
        },
    },
    {
        name: "singer",
        startPrompt: "Person: Can you sing Bohemian Rhapsody?\n" +
            "Singer:\n" +
            "🎤 Is this the real life? \n" +
            "🎵 Is this just fantasy? \n" +
            "Caught in a landside, 🎵 \n" +
            "No escape from reality Open your eyes, \n" +
            "🎶 Look up to the skies and see 🎵\n" +
            "Person: Sing believer by imagine dragons\n" +
            "Singer:\n" +
            "🎤 First things first\n" +
            "I'ma say all the words inside my head\n" +
            "🎵 I'm fired up and tired of\n" +
            "The way that things have been\n" +
            "oh-ooh 🎶",
        stop: ["Person:", "Singer:"],
        maxPromptLines: 6,
        newInput: (input) => "\nPerson: " + input.replace(/\n/gm, " ") + "\nSinger:\n",
        cleanOutput(output, isDisturbing) {
            let finalOutput;
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                finalOutput = output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                finalOutput = output;
            }

            return isDisturbing ? censorText(finalOutput) : finalOutput;
        },
        noResponse: "Sorry, I don't have an answer to that",
        logitBias: tokenizeToBiases({
            "🎤": P_LIGHT,
            "🎵": P_LIGHT,
            "🎶": P_LIGHT,
        }),
        preset: {
            engine: "davinci",
            temperature: 0.7,
            maxTokens: 60,
            topP: 1.0,
            frequencyPenalty: 0,
            presencePenalty: 0.3,
        },
    },
    // Does not really follow a conversation. Very good at performing tasks.
    {
        name: "obedient",
        startPrompt: "Person: Give me the first 10 prime numbers?\nAI: 2, 3, 5, 7, 11, 13, 17, 19, 23, and 29.\nPerson: Write an introduction to a letter\nAI: Dear Dr. Smith, I hereby gladly accept your offer.",
        stop: ["Person:", "AI:", "\n"],
        maxPromptLines: 6,
        newInput: (input) => "\nPerson: " + input.replace(/\n/gm, " ") + "\nAI:",
        cleanOutput(output, isDisturbing) {
            let finalOutput;
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                finalOutput = output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                finalOutput = output;
            }

            return isDisturbing ? censorText(finalOutput) : finalOutput;
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "davinci-instruct-beta",
            temperature: 0.8,
            maxTokens: 50,
            topP: 1.0,
            frequencyPenalty: 0.7,
            presencePenalty: 0.7,
        },
    },
    // Does not really follow a conversation. Very good at performing tasks.
    {
        name: "terminal",
        startPrompt: "The following is terminal input and output\n\n$ ls /etc\n> /etc/hosts  /etc/hostname  /etc/passwd  /etc/resolv.conf  /etc/shadow  /etc/sudoers\n$ which nano\n> /usr/bin/nano\n$ git add --all\n> Added new file.",
        stop: ["\n$"],
        maxPromptLines: 4,
        newInput: (input) => "\n$ " + input.replace(/\n/gm, " ") + "\n>",
        cleanOutput(output, isDisturbing) {
            const newLines = [];
            output.trim().split("\n").forEach((line) => {
                let newLine = line
                    .replace(/^([>#])\s?/i, "") // existing > or #
                    .replace(/^\s/g, "⠀") // leading space is empty braille
                    .replace(/.+?@.+:.+\$/i, "") // user path etc (user@computer:~/directory$)
                    .replace(/\\/g, "\\\\")
                    .replace(/:/g, "\\:")
                    .trim();
                if (isDisturbing) newLine = censorText(newLine);

                if (newLine.length > 0) newLines.push("> " + newLine);
            });

            return newLines.join("\n");
        },
        noResponse: "_no output_",
        preset: {
            engine: "davinci-instruct-beta",
            temperature: 0.15,
            maxTokens: 100,
            topP: 1.0,
            frequencyPenalty: 0.8,
            presencePenalty: 0.1,
        },
    },
    // Uses the Curie engine. Costs less. Simpler responses.
    {
        name: "simple",
        startPrompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.",
        stop: ["You:", "Friend:", "He:", "\n"],
        maxPromptLines: 6,
        newInput: (input) => "\nYou: " + input.replace(/\n/gm, " ") + "\nFriend:",
        cleanOutput(output, isDisturbing) {
            // if starts with :, and not discord emoji
            let finalOutput;
            if (output.indexOf(":") < 15 && output.substring(0, output.indexOf(":")).endsWith("<")) {
                finalOutput = output.replace(/.*?(?<!\s)(?<!https)(?<!http):/, "");
            } else {
                finalOutput = output;
            }

            return isDisturbing ? censorText(finalOutput) : finalOutput;
        },
        noResponse: "Sorry, I don't have an answer to that",
        preset: {
            engine: "curie",
            temperature: 1.0,
            maxTokens: 30,
            topP: 1.0,
            frequencyPenalty: 1.0,
            presencePenalty: 1.0,
        },
    },
];

module.exports.NAME_LIST = PERSONALITIES.map(p => p.name).join(", ");
module.exports.get = (name) => PERSONALITIES.find((p) => p.name === name);