const openai = require("./openaiConfig")


    const description = async() => {
        const response = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: "write a story about chickens."
            }
        ],
        model: "gpt-3.5-turbo",
    })
    console.log('Response:')
    console.log(response)
}

description();