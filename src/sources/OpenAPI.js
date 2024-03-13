const {BAD_WORD_BIASES} = require("../GPT3/BadWordsBiases")
const OpenAI = require("openai-api")

const openai = new OpenAI(process.env.OPENAI_API_KEY)

const completeOpenAPI = async (prompt, personality) => {
    const response = await openai.complete({
        ...(personality.preset),
        stop: personality.stop,
        prompt: prompt,
        logitBias: {...BAD_WORD_BIASES, ...personality.logitBias},
    })

    if (response.data && response.data.choices && response.data.choices.length > 0 && response.data.choices[0].text.trim().length > 0) {
        console.log("Response received:", response.data.choices[0])
        return response.data.choices[0].text
    }
}

module.exports = {
    completeOpenAPI,
}