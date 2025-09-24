// main.js
// Discordボット本体。ボタン押下時の処理を担当する。
// npm run start で起動してください。

require('dotenv').config();
const { Client, GatewayIntentBits, Events, MessageFlags } = require('discord.js');
const wol = require('wol');
const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

// 環境変数読み込み
const TOKEN = process.env.DISCORD_TOKEN;
const MAC = process.env.MAC_ADDRESS;
const WAKE_ID = process.env.WAKE_BUTTON_ID || 'wake';
const SLEEP_ID = process.env.SLEEP_BUTTON_ID || 'sleep';

const SSH_HOST = process.env.SSH_HOST;
const SSH_USER = process.env.SSH_USER;
const SSH_PASS = process.env.SSH_PASS;
const SSH_KEY_PATH = process.env.SSH_KEY_PATH;
const SLEEP_CMD = process.env.SLEEP_CMD;

// 必須チェック（最低限）
if (!TOKEN || !MAC || !SLEEP_CMD) {
  console.error('❌ .env に DISCORD_TOKEN と MAC_ADDRESS を設定してください');
  process.exit(1);
}

// Discordクライアント作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
  console.log(`✅ ログイン成功: ${client.user.tag}`);
  console.log(`▶ wake id: ${WAKE_ID}  sleep id: ${SLEEP_ID}`);
  console.log(`▶ mac: ${MAC}`);
  console.log(`▶ ssh host: ${SSH_HOST ? SSH_HOST : '[未設定]'}`);
});

// ボタン押下処理（wake / sleep 共通）
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) return;

  // --- Wake (WOL) ---
  if (interaction.customId === WAKE_ID) {
    try {
      await wol.wake(MAC);
      await interaction.reply({ content: '🔔 Wake-on-LANパケットを送信しました！', flags: MessageFlags.Ephemeral });
    } catch (err) {
      console.error('❌ PC起動に失敗しました:', err);
    }
    return;
  }

  // --- Sleep (SSH -> Windows コマンド実行) ---
  if (interaction.customId === SLEEP_ID) {
    try {
      // SSH 情報がない場合は不可
      if (!SSH_HOST || !SSH_USER || (!SSH_PASS && !SSH_KEY_PATH)) {
        await interaction.reply({ content: '⚠️ サーバ側の SSH 設定が不十分です', flags: MessageFlags.Ephemeral });
        return;
      }

      await interaction.reply({ content: '⏳ スリープコマンドを送信しています...', flags: MessageFlags.Ephemeral });

      try {
        // 接続設定を組み立て
        const connOpts = { host: SSH_HOST, username: SSH_USER };
        if (SSH_PASS) connOpts.password = SSH_PASS;
        if (SSH_KEY_PATH) connOpts.privateKey = SSH_KEY_PATH;

        await ssh.connect(connOpts);

        // コマンド実行
        const res = await ssh.execCommand(SLEEP_CMD, { cwd: '/' });
        // 切断
        ssh.dispose();

        if (res.stderr) {
          console.error('SSH stderr:', res.stderr);
          await interaction.followUp({ content: `⚠️ スリープ実行でエラーが発生しました: ${res.stderr}`, flags: MessageFlags.Ephemeral });
        } else {
          await interaction.followUp({ content: '💤 Windows にスリープコマンドを送信しました。', flags: MessageFlags.Ephemeral });
        }
      } catch (err) {
        console.error('SSH error:', err);
        await interaction.followUp({ content: '⚠️ SSH 実行中にエラーが発生しました', flags: MessageFlags.Ephemeral });
      }
      return;
    } catch (err) {
      console.error('❌: スリープ実行に失敗しました:', err);
    }
  }
});

// ログイン
client.login(TOKEN);
