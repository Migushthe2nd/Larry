const axios = require('axios')

const axiosInstance = axios.create({
    baseURL: process.env.OLLAMA_BASE_URL,
    headers: {}
})

const completeOllama = async (prompt, personality) => {
    console.log("Sending request to Ollama API")
    const response = await axiosInstance.post("/api/generate",{
        model: process.env.OLLAMA_MODEL,
        prompt: prompt,
        options: {
            temperature: personality.preset.temperature,
            num_ctx: 8192,
            // repeat_penalty: personality.preset.presencePenalty,
            stop: personality.stop,
            top_p: personality.preset.topP,
        },
        stream: false,
    })
    if (response.data) {
        console.log("Response received:", response.data)
        return response.data.response
    }
}

module.exports = {
    completeOllama
}