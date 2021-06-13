const OpenAI = require("openai-api");
const Personalities = require("./Personalities");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

class GTP3 {
    MAX_PROMPT_LINES = 10;
    prompt;
    personality = "human";

    /**
     * Generate a new response for a conversation
     */
    generateResponse(newInput) {
        const personality = this._getPersonality();
        if (!this.prompt) this.prompt = personality.startPrompt;
        return new Promise(async (resolve) => {
            if (newInput.length > 300) {
                resolve("Sorry, I'm not going to reed a message that long");
            } else {
                this.prompt += personality.newInput(newInput);
                this.reducePromptSize();

                try {
                    console.log("Sending prompt:", this.prompt);
                    const response = await openai.complete({
                        ...(personality.preset),
                        stop: personality.stop,
                        prompt: this.prompt,
                    });

                    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text.trim().length > 0) {
                        console.log("Response received:", response.data.choices[0]);
                        const text = response.data.choices[0].text;
                        this.prompt += text;
                        resolve(personality.cleanOutput(text));
                    } else {
                        console.log("Empty response received!");
                        resolve(personality.noResponse);
                    }
                } catch (e) {
                    console.error(e.response.data);
                    resolve("Sorry, I'm not really in the mood to talk");
                }
            }
        });
    }

    /**
     * Get the whole personality object.
     * @private
     */
    _getPersonality() {
        return Personalities.get(this.personality);
    }

    /**
     * Keep the last MAX_PROMPT_LINES lines of the message. Else it will use too many tokens.
     */
    reducePromptSize() {
        let appendEnter = this.prompt.endsWith("\n");
        const lines = this.prompt.split("\n").filter((l) => l.length > 0 && l !== "\n");
        this.prompt = lines.slice(-this._getPersonality().maxPromptLines).join("\n") + (appendEnter ? "\n" : "");
    }

    /**
     * Reset the conversation for a specific guild
     */
    reset() {
        this.prompt = this._getPersonality().startPrompt;
    }

    /**
     * Set the personality of the GPT3 system. Also resets the history
     *
     * @param personality string with the new personality name from Personalities.js
     */
    setPersonality(personality) {
        this.personality = personality;
        this.reset();
    }

}

module.exports = GTP3;