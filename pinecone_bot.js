// Create a discord bot that reads pdfs and loads them into pinecone

require('dotenv').config()

const {Client, GatewayIntentBits} = require('discord.js')

// Client is a class that represents a bot
// GatewayIntentBits is an object that contains all the intents that the bot can use
// Guilds is a property of GatewayIntentBits that allows the bot to receive information about guilds
// Intents are actions that the bot should be aware of
const client = new Client({
    intents: [
        // servers
        GatewayIntentBits.Guilds,
        // messages
        GatewayIntentBits.MessageContent,
        //
        GatewayIntentBits.GuildMessages,
    ]
    }
)
client.on('messageCreate', async message => {
        try{
            if(message.author.bot) return
            // get all the url of attachments from the message
            for (const attachment of message.attachments.values()) {
                console.log(`URL: ${attachment.url} recieved from ${message.author.username}`)
                message.reply(`Fetching ${attachment.url}`)
            }
            url = message.attachments.first().url   
            if (url){
                console.log(`URL: ${url} recieved from ${message.author.username}`)
                message.reply(`Fetching ${url}`)
            } else {
                message.reply(`Please upload a file.`)
                console.log(message.attachments.content_type)
            }
            console.log(message.content)
        }
         catch (error) {
            console.error(error)
        }
    }
)

client.login(process.env.DISCORD_TOKEN_PINECONE)
console.log('Bot is running')