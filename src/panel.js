// panel.js
// 指定チャンネルに「PC起動パネル」を投稿するスクリプト。
// npm run panel で実行してください。

require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

// 必要な環境変数を読み込む
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PC_NAME = process.env.PC_NAME || 'PC';
const WAKE_ID = process.env.WAKE_BUTTON_ID || 'wake';
const SLEEP_ID = process.env.SLEEP_BUTTON_ID || 'sleep';

// 必須チェック（最小限）
if (!TOKEN || !CHANNEL_ID) {
  console.error('❌ .env に DISCORD_TOKEN と CHANNEL_ID を設定してください');
  process.exit(1);
}

// Discordクライアント作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  try {
    // チャンネルを取得
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.error('❌ CHANNEL_ID がテキストチャンネルではありません');
      process.exit(1);
    }

    // ボタン行を作る（左: 起動、右: スリープ）
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(WAKE_ID).setLabel('PCを起動する').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(SLEEP_ID).setLabel('PCをスリープする').setStyle(ButtonStyle.Danger)
    );

    // メッセージ送信（簡潔な説明付き）
    const content = `💻 **${PC_NAME} 起動パネル**`;
    await channel.send({ content, components: [row] });

    console.log('✅ パネルを投稿しました');
  } catch (e) {
    console.error('❌ パネル投稿に失敗しました:', e);
  } finally {
    // 投稿後は終了（panel 用スクリプトは終了して良い）
    setTimeout(() => client.destroy(), 1000);
  }
});

client.login(TOKEN);
