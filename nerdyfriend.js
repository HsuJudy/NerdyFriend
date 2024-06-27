require("dotenv").config()
const {ask} = require('./ai')
const {Client, GatewayIntentBits} = require('discord.js')
const client  = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] })

    client.on('messageCreate', async message => {

    try {
        if (message.author.bot) return
        const response = await ask(message.content)
        console.log(message.content)
        message.reply(response)
    }
    catch (error) {
        console.error(error)
    }
})

client.login(process.env.DISCORD_TOKEN_AI)
console.log('Bot2 is running')