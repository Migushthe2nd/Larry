const booste = require("booste");

class GTP2 {
    MAX_LENGTH = 15;
    MAX_PROMPT_LINES = 10;
    DEFAULT_PROMPT = "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.";
    prompt = this.DEFAULT_PROMPT;
    personality = null;

    /**
     * Generate a new response for a conversation
     */
    generateResponse(newInput) {
        return new Promise(async (resolve) => {
            if (newInput.length > 200) {
                resolve("Sorry, I'm not going to reed a message that long");
            } else {
                this.prompt += "\nYou: " + newInput.replace(/\n/gm, " ") + "\nFriend:";
                this.reducePromptSize();

                try {
                    console.log("Sending prompt:", this.prompt);
                    const outList = await booste.gpt2(process.env.BOOSTE_API_KEY, this.prompt, this.MAX_LENGTH);
                    const response = outList.join(" ").split("\n")[0];
                    this.prompt += response;

                    console.log("Response received:", response);
                    const textTrimmed = response;
                    if (textTrimmed.length > 0) {
                        if (textTrimmed.indexOf(":") < 25) {
                            resolve(textTrimmed.replace(/^(?!https?)^(?!\s+).*?:/, ""));
                        } else {
                            resolve(textTrimmed);
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
     * Keep the last 20 lines of the message. Else it will use too many tokens.
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

module.exports = GTP2;