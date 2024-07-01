// Create a discord bot that reads pdfs and loads them into pinecone

require('dotenv').config()
const {queryBooks} = require('./rag')

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const {Client, GatewayIntentBits} = require('discord.js')
const {createWriteStream} =require('node:fs') ;
const  {pipeline} = require('node:stream') ;
const util = require('util');// Client is a class that represents a bot
const streamPipeline = util.promisify(pipeline);
const { loadBook } = require('./process_books.js')
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

// Function to create a directory if it doesn't exist
async function ensureDirectoryExists(directoryPath) {
    const mkdir = util.promisify(fs.mkdir);
    try {
        await mkdir(directoryPath, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}



// Your existing code with directory creation integrated
async function downloadFile(attachment) {
    const url = attachment.url;
    const parsedUrl = new URL(url); // Parse the URL
    const sanitizedFileName = path.basename(parsedUrl.pathname); // Extract base name without query params

    console.log(sanitizedFileName, 'sanitizedFileName');

    const downloadsPath = path.join(__dirname, 'downloads');
    await ensureDirectoryExists(downloadsPath); // Ensure the downloads directory exists

    const newPath = path.join(downloadsPath, sanitizedFileName);
    console.log(newPath, 'path');

    const response = await fetch(url);
    if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);

    await streamPipeline(response.body, fs.createWriteStream(newPath));
}

client.on('messageCreate', async message => {
        try{
            if(message.author.bot) return
            // get all the url of attachments from the message
            // if user uploaded a pdf, download it
            for (const attachment of message.attachments.values()) {
                console.log(`URL: ${attachment.url} recieved from ${message.author.username}`)
                await message.reply(`Fetching ${attachment.url}`)
                
                // 1. download the file
                await downloadFile(attachment);
                // 1.9 check if pinecone embeddings don't already exist
                await loadBook(attachment.name)
                await message.reply(`Stored into database ${attachment.name}`)
            }
            // if user sent a message, query the database
            const response = await queryBooks(message.content)
            console.log("judy says", message.content)
            console.log(response)
            message.reply(response)

        }
         catch (error) {
            console.error(error)
        }
    }
)

client.login(process.env.DISCORD_TOKEN_PINECONE)
console.log('Bot is running')