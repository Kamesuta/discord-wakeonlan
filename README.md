# Discord Wake-on-LAN Bot

Discordボットを使用してPCをWake-on-LANで起動するツールです。

## 機能

- DiscordチャンネルにPC起動パネルを投稿
- ボタンをクリックするだけでPCを起動
- 複数PC対応（環境変数で設定可能）
- シンプルで使いやすいUI

## プロジェクト構造

```
discord-wakeonlan/
├── src/                    # ソースコード
│   ├── main.js            # Discordボット本体
│   └── panel.js           # パネル投稿スクリプト
├── service/               # サービス関連ファイル
│   ├── discord-wakeonlan.service
│   ├── install-service.sh
│   └── uninstall-service.sh
├── package.json           # パッケージ設定
├── package-lock.json
├── README.md
└── LICENSE
```

## 必要な環境

- Node.js (v16以上推奨)
- Discord Bot Token
- Wake-on-LAN対応のPC
- PCのMACアドレス

### Node.js のインストール（Debian/Ubuntu 推奨）

`nvm` でユーザーインストールした Node.js は `sudo` や `systemd` 実行時に見つからないことがあります。本プロジェクトをサービスとして運用する場合は、NodeSource の公式リポジトリからシステムにインストールする方法を推奨します。

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# 動作確認（バージョンとパスを確認）
node -v
which node
```

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

# ボタンID（複数PC時の衝突回避に使用）
WAKE_BUTTON_ID=wake-example
SLEEP_BUTTON_ID=sleep-example

# スリープ実行のための SSH 設定（SLEEP_CMD を使う場合）
# 次のいずれかを設定: SSH_PASS または SSH_KEY_PATH
SSH_HOST=
SSH_USER=
SSH_PASS=
SSH_KEY_PATH=
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

### systemd サービスとして実行（推奨 / root 管理）

本番環境では、`systemd` のシステムサービスとして実行することを推奨します。これにより、OS 起動時の自動開始、エラー時の自動再起動、ジャーナルへのログ集約が可能です。

#### サービスのインストール

```bash
sudo bash service/install-service.sh
```

このスクリプトは以下を行います：
- 必要ファイルの確認（`src/main.js` と `.env`）
- `NODE_PATH` と `WorkingDirectory` を埋めたユニットファイルを `/etc/systemd/system/discord-wakeonlan.service` へ配置
- `systemctl daemon-reload` と `enable discord-wakeonlan`

#### サービスの管理

```bash
# サービス開始/停止/再起動/状態
sudo systemctl start discord-wakeonlan
sudo systemctl stop discord-wakeonlan
sudo systemctl restart discord-wakeonlan
sudo systemctl status discord-wakeonlan

# 自動起動の有効/無効
sudo systemctl enable discord-wakeonlan
sudo systemctl disable discord-wakeonlan
```

#### ログの確認（journalctl）

```bash
# 追従表示
sudo journalctl -u discord-wakeonlan -f

# 直近 200 行
sudo journalctl -u discord-wakeonlan -n 200

# 指定期間など（例: 今日）
sudo journalctl -u discord-wakeonlan --since today
```

#### サービスのアンインストール

```bash
sudo bash service/uninstall-service.sh
```

このスクリプトは以下の処理を自動実行します：
- サービスの停止と無効化
- サービスファイルの削除

注意: プロジェクトディレクトリは手動で削除してください

## 複数PC対応

複数のPCを管理したい場合は、異なる`.env`ファイルを作成してください：

### PC1用の設定例
```env
PC_NAME=Office-PC
WAKE_BUTTON_ID=wake-office
SLEEP_BUTTON_ID=sleep-office
MAC_ADDRESS=XX:XX:XX:XX:XX:XX
```

### PC2用の設定例
```env
PC_NAME=Gaming-PC
WAKE_BUTTON_ID=wake-gaming
SLEEP_BUTTON_ID=sleep-gaming
MAC_ADDRESS=YY:YY:YY:YY:YY:YY
```

各PC用に異なるボタンIDを設定することで、複数のPC起動パネルを同じチャンネルに配置できます。

## Wake-on-LANの設定

PC側でWake-on-LANを有効にする必要があります：

https://zenn.dev/kamesuta/scraps/42c8dc5f1c5df1
