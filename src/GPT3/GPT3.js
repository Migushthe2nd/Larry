const OpenAI = require("openai-api");
const Personalities = require("./Personalities");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

class GTP3 {
    MAX_PROMPT_LINES = 10;
    DEFAULT_PROMPT = "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.";
    prompt = this.DEFAULT_PROMPT;
    personality = "human";

    /**
     * Generate a new response for a conversation
     */
    generateResponse(newInput) {
        return new Promise(async (resolve) => {
            if (newInput.length > 400) {
                resolve("Sorry, I'm not going to reed a message that long");
            } else {
                this.prompt += "\nYou: " + newInput.replace(/\n/gm, " ") + "\nFriend:";
                this.reducePromptSize();

                try {
                    console.log("Sending prompt:", this.prompt);
                    const response = await openai.complete({
                        ...Personalities.get(this.personality),
                        stop: ["You:", "Friend:", "He:", "\n"],
                        prompt: this.prompt,
                    });

                    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text.trim().length > 0) {
                        console.log("Response received:", response.data.choices[0]);
                        const text = response.data.choices[0].text;
                        this.prompt += text;
                        if (text.indexOf(":") < 25) {
                            resolve(text.replace(/.*?(?<!\s)(?<!https)(?<!http):/, ""));
                        } else {
                            resolve(text);
                        }
                    } else {
                        console.log("Empty response received!");
                        resolve("Sorry, I don't have an answer to that");
                    }
                } catch (e) {
                    console.error(e.response.data);
                    resolve("Sorry, I'm not really in the mood to talk");
                }
            }
        });
    }

    /**
     * Keep the last MAX_PROMPT_LINES lines of the message. Else it will use too many tokens.
     */
    reducePromptSize() {
        const lines = this.prompt.split("\n").filter((l) => l.length > 0 && l !== "\n");
        this.prompt = lines.slice(-this.MAX_PROMPT_LINES).join("\n");
    }

    /**
     * Reset the conversation for a specific guild
     */
    reset() {
        this.prompt = this.DEFAULT_PROMPT;
    }

}

module.exports = GTP3;