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

const tokenizeToBiases = (obj, fullSequences) => {
    const tokenized = {};
    Object.keys(obj).forEach((word) => {
        // This would ban ALL tokens
        // encode(word).forEach((token) => {
        //     tokenized[token] = obj[word];
        // });
        const variants = [word];
        variants.push(word.toUpperCase()); // all caps
        variants.push(word.charAt(0).toUpperCase() + word.slice(1)); // first letter caps

        // This will only affect the first token
        variants.forEach((variant) => {
            const encodedTokens = encode(variant);
            if (encodedTokens.length > 0) {
                const firstToken = encodedTokens[0];
                const oldWeight = tokenized[firstToken];
                const newWeight = obj[word];
                if (!oldWeight || (oldWeight > 0 && newWeight > oldWeight) || (oldWeight < 0 && newWeight < oldWeight)) {
                    tokenized[firstToken] = obj[word];
                }
            }
        });
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
        useSamePrompt: false,
        stop: ["You:", "Friend:", "He:", "\n"],
        maxPromptLines: 16,
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
            engine: "text-davinci-003",
            temperature: 0.9,
            maxTokens: 50,
            topP: 1.0,
            frequencyPenalty: 0.9,
            presencePenalty: 0.9,
        },
    },
    // Works with random questions, is a bit random and repetitive.
    {
        name: "qna",
        startPrompt: "Q: What's the capitol of France?\nA: Paris is the capitol of France.\nQ: What's 50+9?\nA: 50+9 is 59.",
        useSamePrompt: true,
        stop: ["Q:", "A:", "\n"],
        maxPromptLines: 10,
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
            engine: "text-davinci-003",
            temperature: 0.8,
            maxTokens: 50,
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
        useSamePrompt: true,
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
        }, true),
        preset: {
            engine: "text-davinci-003",
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
        useSamePrompt: true,
        stop: ["Person:", "AI:", "\n"],
        maxPromptLines: 10,
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
            engine: "davinci-instruct-beta-v3",
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
        useSamePrompt: false,
        stop: ["\n$"],
        maxPromptLines: 10,
        newInput: (input) => "\n$ " + input.replace(/\n/gm, " ") + "\n>",
        cleanOutput(output, _isDisturbing) {
            const newLines = [];
            output.trim().split("\n").forEach((line) => {
                let newLine = line
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
            engine: "code-davinci-002",
            temperature: 0.0,
            maxTokens: 100,
            topP: 1.0,
            frequencyPenalty: 0.8,
            presencePenalty: 0.2,
        },
    },
];

module.exports.NAME_LIST = PERSONALITIES.map(p => p.name).join(", ");
module.exports.get = (name) => PERSONALITIES.find((p) => p.name === name);
