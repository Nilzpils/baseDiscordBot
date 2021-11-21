module.exports = {
  name: "test",

  async execute(client, message, args) {
    if (!args) return message.reply("This command requires an argument");
    if (isNaN(args)) return message.reply("This command requires a number");
    return message.channel.send(`${args} is a beautifull number`);
  }
}
