require('dotenv').config()
const {Client, Intents} = require('discord.js')
const DB                = require('./DB')

// Create a new client instance
const client = new Client({
    intents : [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
    ],
    partials: ['GUILD_MESSAGES', 'MESSAGE', 'CHANNEL'],
})

client.on('messageCreate', async message => {
    if (!message.author.bot && message.content.split(' ').length >= 3) {
        const count = await DB.messageCount.findAll({
            where: {
                user : message.author.id,
                guild: message.guildId,
            },
            limit: 1,
        })

        if (count.length === 0) {
            await DB.messageCount.create({
                user : message.author.id,
                guild: message.guildId,
                count: 1
            })
        } else {
            await DB.messageCount.update({
                count: count[0].count + 1
            }, {
                where: {
                    user : message.author.id,
                    guild: message.guildId,
                }
            })
        }
    }
})

client.login(process.env.DISCORD_TOKEN).then(async () => {
    console.log('Connected as:')
    console.log(`${client.user.username} #${client.user.discriminator}`)
    console.log('Connected to:')
    client.guilds.cache.forEach(guild => {
        console.log(`${guild.name} | ${guild.id}`)
    })
})