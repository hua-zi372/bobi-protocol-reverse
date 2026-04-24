#!/bin/bash
# proxy_setup.sh - 抓包代理快速配置脚本
# 支持: Charles / mitmproxy / Burp Suite

echo "==============================="
echo "  Bobi Protocol Analysis"
echo "  Proxy Setup Tool"
echo "==============================="

# 检查ADB
if ! command -v adb &> /dev/null; then
    echo "[ERROR] ADB not found. Please install Android SDK."
    exit 1
fi

# 检查设备
DEVICE_COUNT=$(adb devices | grep -c "device$")
if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "[ERROR] No Android device connected."
    exit 1
fi
echo "[OK] Found $DEVICE_COUNT device(s)"

# 获取本机IP
LOCAL_IP=$(hostname -I | awk '{print $1}')
echo "[INFO] Local IP: $LOCAL_IP"

# 选择代理工具
echo ""
echo "Select proxy tool:"
echo "  1. Charles (port 8888)"
echo "  2. mitmproxy (port 8080)"
echo "  3. Burp Suite (port 8082)"
echo "  4. Custom"
read -p "Choice [1-4]: " CHOICE

case $CHOICE in
    1) PROXY_PORT=8888 ;;
    2) PROXY_PORT=8080 ;;
    3) PROXY_PORT=8082 ;;
    4) read -p "Enter port: " PROXY_PORT ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo ""
echo "[INFO] Setting proxy: $LOCAL_IP:$PROXY_PORT"

# 设置Android全局代理
adb shell settings put global http_proxy "$LOCAL_IP:$PROXY_PORT"
echo "[OK] Proxy configured on device"

# 安装CA证书提示
echo ""
echo "==============================="
echo "  Next Steps:"
echo "  1. Install CA cert on device"
echo "  2. Open target APP"
echo "  3. Start capturing traffic"
echo "==============================="

echo ""
echo "To remove proxy later, run:"
echo "  adb shell settings put global http_proxy :0"
