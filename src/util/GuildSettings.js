const GPT2 = require("../GPT2/GPT2");
const GPT3 = require("../GPT3/GPT3");

class GuildSettings {
    gpt = new GPT3();

    // setPersonality(personality) {
    //     if (this.gpt instanceof GPT3) {
    //         this.gpt.personality = personality;
    //     }
    // };

    switchGPTType() {
        if (this.gpt instanceof GPT2) {
            this.gpt = new GPT3();
        } else if (this.gpt instanceof GPT3) {
            this.gpt = new GPT2();
        }
    }
}

module.exports = GuildSettings;