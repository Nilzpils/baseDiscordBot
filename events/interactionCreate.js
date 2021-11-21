module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

  	const command = client.slashCommands.get(interaction.commandName);

  	if (!command) return;

  	try {
  		await command.execute(interaction, client);
  	} catch (e) {
  		console.error(e);
  		await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true
      });
  	}
  },
}
