// Require the necessary discord.js classes
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs')
require('dotenv').config();

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.slashCommands = new Collection();
client.commands = new Collection();

const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const slashCommandsFolders = fs.readdirSync('./slashCommands');
const commandsFolders = fs.readdirSync('./commands');

(async () => {
	for (file of functions) {
		require(`./functions/${file}`)(client);
	}

	// Login to Discord with your client's token
	await client.login(process.env.CLIENTLOGIN)
	 .catch(e => {console.error(e);})

	client.handleEvents(eventFiles, "./events");
	client.handleSlashCommands(slashCommandsFolders, "./slashCommands");
	client.handleCommands(commandsFolders, "./commands");
})();
