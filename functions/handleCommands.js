require('dotenv').config();
const fs = require('fs');

module.exports = (client) => {
  client.handleCommands = (commandFolders, path) => {
    let commandsLoaded = false;
    for (folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
      for(file of commandFiles) {
        const fileName = file;
        const command = require(`.${path}/${folder}/${file}`);
        if (!command.hasOwnProperty('name') || command.name === "") throw console.error(`${fileName} - All commands require a name!`);
        if (client.commands.get(command.name)) throw console.error(`A command with the name: "${command.name}" alreay exists!`);
        client.commands.set(command.name, command);
        commandsLoaded = true;
      }
    }
    if (commandsLoaded) console.log(`Successfully loaded applications (${process.env.PREFIX}) commands.`);
  }
}
