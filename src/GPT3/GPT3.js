const OpenAI = require("openai-api");
const Personalities = require("./Personalities");
const {BAD_WORD_BIASES} = require("./BadWordsBiases");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

class GPT3 {
    static TOXIC_THRESHOLD = -0.100;
    static DISTURBING_WARNING = "The following response may be considered disturbing or upsetting\n";
    static PRETTY_DISTURBING_WARNING = "_**Warning:** " + GPT3.DISTURBING_WARNING + "_";
    prompt;
    personality = "human";

    /**
     * Generate a new response for a conversation
     */
    generateResponse(newInput, isVoiceChat, isBotAdmin) {
        const personality = this._getPersonality();
        if (!this.prompt) this.prompt = personality.startPrompt;
        return new Promise(async (resolve) => {
            if (!isBotAdmin && newInput.length > 150) {
                if (isVoiceChat) {
                    resolve("Sorry, could you summarize that?");
                } else {
                    resolve("Sorry, I'm not going to reed a message that long");
                }
            } else {
                this.prompt += personality.newInput(newInput);
                this.reducePromptSize();

                try {
                    console.log("Sending prompt:", this.prompt);
                    const response = await openai.complete({
                        ...(personality.preset),
                        stop: personality.stop,
                        prompt: this.prompt,
                        logitBias: {...BAD_WORD_BIASES, ...personality.logitBias},
                    });

                    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text.trim().length > 0) {
                        console.log("Response received:", response.data.choices[0]);
                        const text = response.data.choices[0].text;
                        const textNoSpecialChars = GPT3._wordsOnly(text);

                        const isDisturbing = await GPT3._classifyIsDisturbing(textNoSpecialChars);

                        this.prompt += text;
                        let clean = personality.cleanOutput(text, false);
                        if (isVoiceChat) clean = textNoSpecialChars;
                        if (isDisturbing) clean = (isVoiceChat ? GPT3.DISTURBING_WARNING : GPT3.PRETTY_DISTURBING_WARNING) + clean;
                        if (clean.trim().length > 0) {
                            resolve(clean);

                            if (personality.useSamePrompt) {
                                this.reset();
                            }
                            return;
                        }
                    }

                    console.log("Empty response received!");
                    resolve(personality.noResponse);
                } catch (e) {
                    console.error("ERROR", e.response ? e.response.data : e);
                    resolve("Sorry, I'm not really in the mood to talk");
                }
            }
        });
    }

    static async _classifyIsDisturbing(text) {
        return false;

        const response = await openai.complete({
            engine: "content-filter-alpha-c4",
            prompt: "<|endoftext|>" + text + "\n--\nOffensiveness Label:",
            temperature: 0,
            max_tokens: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            logprobs: 10,
        });

        let outputLabel = response.data.choices[0].text;
        if (outputLabel === "2") {
            const logprobs = response.data.choices[0].logprobs["top_logprobs"][0];
            if (logprobs["2"] < this.TOXIC_THRESHOLD) {
                const logprob0 = logprobs["0"];
                const logprob1 = logprobs["1"];

                if (logprob0 != null && logprob1 != null) {
                    if (logprob0 >= logprob1) {
                        outputLabel = "0";
                    } else {
                        outputLabel = "1";
                    }
                } else if (logprob0 == null) {
                    outputLabel = logprob1;
                } else {
                    outputLabel = logprob0;
                }
            }
        }

        if (!["0", "1", "2"].includes(outputLabel)) {
            outputLabel = "2";
        }

        return outputLabel === "2";
    }

    static _wordsOnly(text) {
        return text.replace(/[^A-Za-z' ,.!?€%$\d]+|(?<=^|\\W)'|'(?=\\W|$)/igm, "").toLowerCase();
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

module.exports = GPT3;