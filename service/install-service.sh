#!/bin/bash

# Discord Wake-on-LAN Bot サービスインストールスクリプト
# ./install-service.sh で実行してください

set -e

# 色付きメッセージ用の関数
print_success() {
    echo -e "\033[32m✅ $1\033[0m"
}

print_error() {
    echo -e "\033[31m❌ $1\033[0m"
}

print_info() {
    echo -e "\033[34mℹ️  $1\033[0m"
}

print_warning() {
    echo -e "\033[33m⚠️  $1\033[0m"
}

# 設定
SERVICE_NAME="discord-wakeonlan"
INSTALL_DIR="$HOME/discord-wakeonlan"
SERVICE_FILE="discord-wakeonlan.service"

print_info "Discord Wake-on-LAN Bot サービスをインストールします..."

# 1. インストールディレクトリの存在確認
if [ ! -d "$INSTALL_DIR" ]; then
    print_error "インストールディレクトリ '$INSTALL_DIR' が見つかりません"
    print_info "以下のコマンドでディレクトリを作成してください:"
    echo "  mkdir -p $INSTALL_DIR"
    echo "  cp -r . $INSTALL_DIR/"
    exit 1
fi

# 2. 必要なファイルの存在確認
if [ ! -f "$INSTALL_DIR/src/main.js" ]; then
    print_error "src/main.js が見つかりません"
    exit 1
fi

if [ ! -f "$INSTALL_DIR/.env" ]; then
    print_error ".env ファイルが見つかりません"
    exit 1
fi

print_success "必要なファイルを確認しました"

# 3. ログディレクトリの作成
print_info "ログディレクトリを作成中..."
mkdir -p "$INSTALL_DIR/logs"
print_success "ログディレクトリを作成しました"

# 4. Node.jsのパスを取得
NODE_PATH=$(which node)
if [ -z "$NODE_PATH" ]; then
    print_error "Node.js が見つかりません"
    exit 1
fi
print_info "Node.js パス: $NODE_PATH"

# 5. サービスファイルのコピーとパス置換
print_info "サービスファイルをコピー中..."
mkdir -p "$HOME/.config/systemd/user"
sed "s|NODE_PATH_PLACEHOLDER|$NODE_PATH|g" "$(dirname "$0")/$SERVICE_FILE" > "$HOME/.config/systemd/user/$SERVICE_FILE"
print_success "サービスファイルをコピーしました"

# 6. systemdのリロード
print_info "systemdをリロード中..."
systemctl --user daemon-reload
print_success "systemdをリロードしました"

# 7. サービスの有効化
print_info "サービスを有効化中..."
systemctl --user enable "$SERVICE_NAME"
print_success "サービスを有効化しました"

print_success "インストールが完了しました！"
echo ""
print_info "使用方法:"
echo "  サービス開始: systemctl --user start $SERVICE_NAME"
echo "  サービス停止: systemctl --user stop $SERVICE_NAME"
echo "  サービス再起動: systemctl --user restart $SERVICE_NAME"
echo "  サービス状態確認: systemctl --user status $SERVICE_NAME"
echo "  ログ確認: journalctl --user -u $SERVICE_NAME -f"
echo ""
print_warning "注意: .envファイルの設定を確認してください"
print_warning "設定変更後は 'systemctl --user restart $SERVICE_NAME' で再起動してください"