const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  description: "Shuffles the queue",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["shuff"],
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
        "❌ | **Ge moe in een channel zitte!**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ":x: | **Ge moe in dezelfde channel zitte als mij!**"
      );
    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime(
        message.channel,
        "❌ | **Niet genoeg liedje om te shuffelen!**"
      );
    player.queue.shuffle();
    await client.sendTime(message.channel, "✅ | Shuffled the queue!");
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
          "❌ | **Ge moe in een channel zitte!**"
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
          interaction.channel,
          "❌ | **Der is niks aant spelen...**"
        );
      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime(
          interaction,
          "❌ | **Niet genoeg liedje om te shuffelen!**"
        );
      player.queue.shuffle();
      client.sendTime(interaction, "✅ | Shuffled the queue!");
    },
  },
};
