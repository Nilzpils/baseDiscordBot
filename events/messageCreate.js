module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    // prefix command handling
    if (message.content.charAt(0) === process.env.PREFIX) {
      const command = await client.commands.get(message.content.split(" ")[0].substring(1))
      if (command === undefined) return message.reply('This command does not exist.');
      let args = "";
      if (message.content.indexOf(' ') >= 0) args = message.content.substr(message.content.indexOf(' ')+1)
      try {
        await command.execute(client, message, args)
      } catch (e) {
        console.error(e);
        return message.reply('There was an error while executing this command!');
      }
    };

    // message handling
  },
}
