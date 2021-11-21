const {SlashCommandBuilder} = require('@discordjs/builders');

module.exports = {
  userPermissions:  ["Second in Command", "First in command"],
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Deletes messages a specified ammount of messages.')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('The amount of messages which should be deleted.')
        .setRequired(true)
    ),

  async execute(interaction) {

    let amount = interaction.options.getNumber('amount');

    if (amount < 1) return interaction.reply({content: 'You have to delete at least 1 message.', ephemeral: true});
    if (amount > 100) return interaction.reply({content: "You can't delete more than 100 messages at once.", ephemeral: true});

    await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			return interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
		});

		return interaction.reply({ content: `Successfully purged messages.`, ephemeral: true });
  }
}
