// Create a discord bot using openai api that gives you advice based on the books it has read
// require is a built in node js function to include modules
// .config() is a function that loads environment variables from a .env file into process.env
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

// const {Configuration, OpenAi} = require('openai');
// const configuration = new Configuration({
//     organization: process.env.OPENAI_ORG,
//     apiKey : process.env.OPENAI_API_KEY,
// })

// const openai = new OpenAi(configuration);

// check for when a message is created
client.on('messageCreate', async message => {
        try{
            if(message.author.bot) return
            console.log(message.content)
            message.reply(`You said ${message.content}`)
        }
         catch (error) {
            console.error(error)
        }
    }
)

client.login(process.env.DISCORD_TOKEN)
console.log('Bot is running')