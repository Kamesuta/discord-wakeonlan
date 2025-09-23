# Discord Wake-on-LAN Bot

Discordボットを使用してPCをWake-on-LANで起動するツールです。

## 機能

- DiscordチャンネルにPC起動パネルを投稿
- ボタンをクリックするだけでPCを起動
- 複数PC対応（環境変数で設定可能）
- シンプルで使いやすいUI

## 必要な環境

- Node.js (v16以上推奨)
- Discord Bot Token
- Wake-on-LAN対応のPC
- PCのMACアドレス

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/kamesuta/discord-wakeonlan.git
cd discord-wakeonlan
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`ファイルをコピーして`.env`ファイルを作成し、実際の値を設定してください：

```bash
cp .env.example .env
```

`.env`ファイルの各設定項目：

```env
# Discord Bot Token
DISCORD_TOKEN=your_discord_bot_token_here

# Discord チャンネルID（パネルを投稿するチャンネル）
CHANNEL_ID=your_channel_id_here

# 起動対象PCのMACアドレス
MAC_ADDRESS=XX:XX:XX:XX:XX:XX

# PC名（パネルに表示される名前）
PC_NAME=Example-PC

# ボタンID（他のPCパネルと区別するためのID）
# 複数PCを使用する場合は、それぞれ異なるIDを設定してください
BUTTON_ID=wake-example
```

### 4. Discord Botの作成

1. [Discord Developer Portal](https://discord.com/developers/applications)にアクセス
2. 新しいアプリケーションを作成
3. Botセクションでボットを作成
4. Bot Tokenをコピーして`.env`ファイルに設定
5. 必要な権限を設定：
   - `Send Messages`
   - `Use Slash Commands`
   - `Read Message History`

### 5. ボットをサーバーに招待

1. OAuth2 > URL Generatorで招待URLを生成
2. `bot`と`Send Messages`権限を選択
3. 生成されたURLでボットをサーバーに招待

## 使用方法

### パネルの投稿

```bash
npm run panel
```

このコマンドを実行すると、指定したチャンネルにPC起動パネルが投稿されます。

### ボットの起動

```bash
npm run start
```

このコマンドでボットを起動し、ボタンクリック時の処理を開始します。

## 複数PC対応

複数のPCを管理したい場合は、異なる`.env`ファイルを作成してください：

### PC1用の設定例
```env
PC_NAME=Office-PC
BUTTON_ID=wake-office
MAC_ADDRESS=XX:XX:XX:XX:XX:XX
```

### PC2用の設定例
```env
PC_NAME=Gaming-PC
BUTTON_ID=wake-gaming
MAC_ADDRESS=YY:YY:YY:YY:YY:YY
```

各PC用に異なるボタンIDを設定することで、複数のPC起動パネルを同じチャンネルに配置できます。

## Wake-on-LANの設定

PC側でWake-on-LANを有効にする必要があります：

https://zenn.dev/kamesuta/scraps/42c8dc5f1c5df1
