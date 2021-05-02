const OpenAI = require("openai-api");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const DEFAULT_PROMPT = "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.";

class GTP3 {
    prompt = {};

    /**
     * Generate a new response for a conversation
     */
    generateResponse(newInput, guildId) {
        return new Promise(async (resolve) => {
            if (!this.prompt[guildId]) {
                this.prompt[guildId] = DEFAULT_PROMPT;
            }
            this.prompt[guildId] += "\nYou: " + newInput.replace(/\n/gm, " ") + "\nFriend:";

            this.keep20(guildId);

            try {
                console.log("Sending prompt:", this.prompt[guildId]);
                const response = await openai.complete({
                    engine: "davinci",
                    prompt: this.prompt[guildId],
                    temperature: 0.4,
                    maxTokens: 80,
                    topP: 1.0,
                    frequencyPenalty: 0.5,
                    presencePenalty: 0.0,
                    stop: ["\n", "You:"],
                });

                if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text.length > 0) {
                    console.log("Response received:", response.data.choices[0]);
                    this.prompt[guildId] += response.data.choices[0].text;
                    const text = response.data.choices[0].text;
                    if (text.indexOf(":") < 25) {
                        resolve(text.replace(/.*?:/, ""));
                    } else {
                        resolve(text);
                    }
                } else {
                    console.log("Empty response received!");
                    resolve("Sorry, I don't have an answer to that");
                }
            } catch (e) {
                console.error(e);
                resolve("Sorry, I'm not really in the mood to talk");
            }
        });
    }

    /**
     * Keep the last 20 lines of the message. Else it will use too many tokens.
     */
    keep20(guildId) {
        const lines = this.prompt[guildId].split("\n").filter((l) => l.length > 0 && l !== "\n");
        this.prompt[guildId] = lines.slice(-20).join("\n");
    }

    /**
     * Reset the conversation for a specific guild
     */
    reset(guildId) {
        this.prompt[guildId] = DEFAULT_PROMPT;
    }

}

const instance = new GTP3();

module.exports = instance;