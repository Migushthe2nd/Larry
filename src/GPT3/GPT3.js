const OpenAI = require("openai-api");
const storage = require("../util/storage");
const Personality = require("./Personalities");
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const DEFAULT_PROMPT = "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend: Not really.";

class GTP3 {

    /**
     * Generate a new response for a conversation
     */
    generateResponse(newInput, guildId) {
        return new Promise(async (resolve) => {
            if (newInput.length > 300) {
                resolve("Sorry, I'm not going to reed a message that long");
            } else {
                let prompt = storage.getPrompt(guildId);
                if (!prompt) prompt = DEFAULT_PROMPT;
                prompt += "\nYou: " + newInput.replace(/\n/gm, " ") + "\nFriend:";
                prompt = this.reducePromptSize(prompt);

                try {
                    console.log("Sending prompt:", prompt);
                    const response = await openai.complete({
                        ...Personality.get(storage.getPersonalityKey(guildId)),
                        stop: ["You:", "Friend:", "He:", "Me:"],
                        prompt,
                    });

                    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text.trim().length > 0) {
                        console.log("Response received:", response.data.choices[0]);
                        prompt += response.data.choices[0].text;
                        const text = response.data.choices[0].text.trim();
                        if (text.indexOf(":") < 25) {
                            resolve(text.replace(/^(?!https?)^(?!\s+).*?:/, ""));
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
                } finally {
                    storage.putPrompt(guildId, prompt);
                }
            }
        });
    }

    /**
     * Keep the last 20 lines of the message. Else it will use too many tokens.
     */
    reducePromptSize(prompt) {
        const lines = prompt.split("\n").filter((l) => l.length > 0 && l !== "\n");
        return lines.slice(-10).join("\n");
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