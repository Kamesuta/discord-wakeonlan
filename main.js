// main.js
// Discordボット本体。ボタン押下時の処理を担当する。
// npm run start で起動してください。

require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const wol = require('wol');

// 環境変数から読み込み
const TOKEN = process.env.DISCORD_TOKEN;
const MAC = process.env.MAC_ADDRESS;
const BUTTON_ID = process.env.BUTTON_ID;

if (!TOKEN || !MAC || !BUTTON_ID) {
  console.error('❌ .env に DISCORD_TOKEN, MAC_ADDRESS, BUTTON_ID を設定してください');
  process.exit(1);
}

// Discordクライアント作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 起動時ログ
client.once(Events.ClientReady, () => {
  console.log(`✅ ログイン成功: ${client.user.tag}`);
});

// ボタン押下時の処理
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === BUTTON_ID) {
    try {
      await wol.wake(MAC); // WOLパケット送信
      await interaction.reply({ content: '🔔 Wake-on-LANパケットを送信しました！', ephemeral: true });
    } catch (err) {
      console.error('❌ Wake-on-LANパケット送信に失敗しました:', err);
    }
  }
});

// ボットにログイン
client.login(TOKEN);