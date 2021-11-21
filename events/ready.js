require('dotenv').config();

const https = require('https')

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Logged in as ${client.user.tag}`);
	}
};
