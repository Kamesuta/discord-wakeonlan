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
git clone https://github.com/kamesuta/discord-wakeonlan.git ~/discord-wakeonlan
cd ~/discord-wakeonlan
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

### 手動実行

#### パネルの投稿

```bash
npm run panel
```

このコマンドを実行すると、指定したチャンネルにPC起動パネルが投稿されます。

#### ボットの起動

```bash
npm run start
```

このコマンドでボットを起動し、ボタンクリック時の処理を開始します。

### systemdサービスとして実行（推奨）

本番環境では、systemdサービスとして実行することを推奨します。これにより、システム起動時の自動開始、エラー時の自動再起動、ログ管理などが可能になります。

#### 事前準備

まず、プロジェクトファイルを`$HOME/discord-wakeonlan`に配置してください：

```bash
mkdir -p $HOME/discord-wakeonlan
cp -r . $HOME/discord-wakeonlan/
```

#### サービスのインストール

```bash
./install-service.sh
```

このスクリプトは以下の処理を自動実行します：
- `$HOME/discord-wakeonlan`の存在確認
- systemdユーザーサービスの登録と有効化

#### サービスの管理

```bash
# サービス開始
systemctl --user start discord-wakeonlan

# サービス停止
systemctl --user stop discord-wakeonlan

# サービス再起動
systemctl --user restart discord-wakeonlan

# サービス状態確認
systemctl --user status discord-wakeonlan

# 自動起動の有効/無効
systemctl --user enable discord-wakeonlan
systemctl --user disable discord-wakeonlan
```

#### ログの確認

```bash
# リアルタイムログ表示
journalctl --user -u discord-wakeonlan -f

# 過去のログ表示
journalctl --user -u discord-wakeonlan

# 今日のログ表示
journalctl --user -u discord-wakeonlan --since today
```

#### サービスのアンインストール

```bash
./uninstall-service.sh
```

このスクリプトは以下の処理を自動実行します：
- サービスの停止と無効化
- サービスファイルの削除

注意: `$HOME/discord-wakeonlan`ディレクトリは手動で削除してください

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
