#!/bin/bash

# Discord Wake-on-LAN Bot サービスアンインストールスクリプト
# ./uninstall-service.sh で実行してください

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

print_info "Discord Wake-on-LAN Bot サービスをアンインストールします..."

# 1. サービスの停止と無効化
print_info "サービスを停止中..."
if systemctl --user is-active --quiet "$SERVICE_NAME"; then
    systemctl --user stop "$SERVICE_NAME"
    print_success "サービスを停止しました"
else
    print_info "サービスは既に停止しています"
fi

if systemctl --user is-enabled --quiet "$SERVICE_NAME"; then
    systemctl --user disable "$SERVICE_NAME"
    print_success "サービスを無効化しました"
else
    print_info "サービスは既に無効化されています"
fi

# 2. サービスファイルの削除
print_info "サービスファイルを削除中..."
if [ -f "$HOME/.config/systemd/user/$SERVICE_NAME.service" ]; then
    rm "$HOME/.config/systemd/user/$SERVICE_NAME.service"
    print_success "サービスファイルを削除しました"
else
    print_info "サービスファイルは既に削除されています"
fi

# 3. systemdのリロード
print_info "systemdをリロード中..."
systemctl --user daemon-reload
print_success "systemdをリロードしました"

print_success "アンインストールが完了しました！"
print_info "注意: $HOME/discord-wakeonlan ディレクトリは手動で削除してください"