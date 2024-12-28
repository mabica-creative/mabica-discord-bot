import type { CommandKit } from "commandkit";
import { Client, ChannelType } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
} from "@discordjs/voice";

const STREAM_URL =
  "https://playerservices.streamtheworld.com/api/livestream-redirect/PRAMBORS_FM_SC.mp3";
const VOICE_CHANNEL_ID = "1321782037027356725"; // Ganti dengan ID voice channel Anda

export default async function (
  c: Client<true>,
  client: Client<true>,
  handler: CommandKit, // Ganti dengan tipe spesifik jika Anda menggunakan CommandKit
): Promise<void> {
  try {
    console.log(`Bot berhasil join radio sebagai ${c.user.tag}!`);

    // Fetch channel
    const channel = await c.channels.fetch(VOICE_CHANNEL_ID);
    if (!channel || channel.type !== ChannelType.GuildVoice) {
      console.error(
        "Voice channel tidak ditemukan atau bukan tipe voice channel.",
      );
      return;
    }

    // Join voice channel
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    // Create and configure audio player
    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    // Create audio resource and play
    const resource = createAudioResource(STREAM_URL);
    player.play(resource);
    connection.subscribe(player);

    console.log(
      "Bot telah bergabung ke voice channel dan sedang memutar radio!",
    );
  } catch (error) {
    console.error("Gagal bergabung ke voice channel:", error);
  }
}
