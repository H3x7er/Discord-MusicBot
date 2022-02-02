const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "skip",
  description: "Skip the current song",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["s", "next"],
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
    player.stop();
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

      const skipTo = interaction.data.options
        ? interaction.data.options[0].value
        : null;

      let player = await client.Manager.get(interaction.guild_id);

      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **Der is niks aant spelen...**"
        );
      console.log(interaction.data);
      if (
        skipTo !== null &&
        (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
      )
        return client.sendTime(interaction, "❌ | **Invalid number to skip!**");
      player.stop(skipTo);
      client.sendTime(interaction, "**Skipped!**");
    },
  },
};
