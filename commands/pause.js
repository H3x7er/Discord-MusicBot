const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "pause",
  description: "Pauses the music",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **Der is niks aant spelen...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "❌ | **Ge moe in een channel zitten!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Ge moe in dezelfde channel zitte als mij!**"
      );
    if (player.paused)
      return client.sendTime(
        message.channel,
        "❌ | **Muziek staat al op pauze!**"
      );
    player.pause(true);
    let embed = new MessageEmbed()
      .setAuthor(`Paused!`, client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .setDescription(`Type \`${GuildDB.prefix}resume\` om verder te luisteren!`);
    await message.channel.send(embed);
    await message.react("✅");
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **Ge moe in een channel zitten.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          ":x: | **Ge moe in dezelfde channel zitte als mij!**"
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Der is niks aant spelen...**"
        );
      if (player.paused)
        return client.sendTime(interaction, "Muziek staat al op pauze!");
      player.pause(true);
      client.sendTime(interaction, "**⏸ Paused!**");
    },
  },
};
