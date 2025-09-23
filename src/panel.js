// panel.js
// 指定チャンネルに「PC起動パネル」を投稿するスクリプト。
// npm run panel で実行してください。

require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PC_NAME = process.env.PC_NAME;
const BUTTON_ID = process.env.BUTTON_ID;

if (!TOKEN || !CHANNEL_ID || !PC_NAME || !BUTTON_ID) {
  console.error('❌ .env に DISCORD_TOKEN, CHANNEL_ID, PC_NAME, BUTTON_ID を設定してください');
  process.exit(1);
}

// Discordクライアント作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error('❌ CHANNEL_ID がテキストチャンネルではありません');
      process.exit(1);
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(BUTTON_ID)
        .setLabel('PCを起動する')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ content: `💻 **${PC_NAME}起動パネル**`, components: [row] });
    console.log('✅ パネルを投稿しました');
  } catch (e) {
    console.error('❌ パネル投稿に失敗しました:', e);
  } finally {
    setTimeout(() => client.destroy(), 1000);
  }
});

client.login(TOKEN);