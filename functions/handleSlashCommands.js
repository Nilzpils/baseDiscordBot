const fs = require('fs');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');

module.exports = (client) => {
  client.handleSlashCommands = async (commandFolders, path) => {
    client.commandArray = [];
    for (folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'))
      for (const file of commandFiles) {
        const command = require(`.${path}/${folder}/${file}`);

        if (command.hasOwnProperty('userPermissions')) {
          command.data.defaultPermission = false;
        }

        client.slashCommands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());
      }
    }

    const rest = new REST({
      version: '9'
    }).setToken(process.env.CLIENTLOGIN);

    (async () => {
        try {

          await rest.put(
            Routes.applicationGuildCommands(client.user.id, client.guilds.cache.first().id), {
              body: client.commandArray
            },
          );

          registerPerms()

          console.log("Successfully loaded applications (/) commands.");
        } catch (e) {
          console.log(e);
        }
    })();
  }

  async function registerPerms() {
    const guild = client.guilds.cache.first();
    await guild.commands.fetch().then(cmd => {

      const getRoles = (commandName) => {
        const command = client.slashCommands.find(
          (x) => x.data.name === commandName
        );

        if (!command || !command.hasOwnProperty('userPermissions')) return null;
        const permissions = command.userPermissions;

        if (!permissions) return null;
        return guild.roles.cache.filter(
          r => permissions.includes(r.name)
        );
      }

      const fullPermissions = cmd.reduce((accumulator, x) => {
        let roles = getRoles(x.name);
        if (!roles) return accumulator;

        const permissions = roles.reduce((a, v) => {
          return [
              ...a,
              {
                id: v.id,
                type: 'ROLE',
                permission: true,
              }
          ]
        }, []);

        return [
          ...accumulator,
          {
            id: x.id,
            permissions,
          }
        ];
      }, []);

      guild.commands.permissions.set({fullPermissions});
    })
  }

}
