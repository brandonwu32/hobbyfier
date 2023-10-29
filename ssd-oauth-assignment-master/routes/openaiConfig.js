const { OpenAI, OpenAIApi } = require('openai');
require('dotenv').config()

const configuration = new OpenAI({
    apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAI(configuration)

module.exports = openai