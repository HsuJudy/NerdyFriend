const {OpenAI, Configuration} = require("openai");
require("dotenv").config()

const openai = new OpenAI({
    api_Key: process.env.OPENAI_API_KEY
});

async function ask(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." },
            {"role": "user", "content": prompt},

        ],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
    return completion.choices[0].message;
}
console.log(ask("what are the top 100 performing stocks today?"))
module.exports = {ask}