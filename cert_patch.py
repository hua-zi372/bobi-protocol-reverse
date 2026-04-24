#!/usr/bin/env python3
"""
cert_patch.py - SSL证书处理工具

用于将代理工具的CA证书安装到Android系统证书目录
支持: Android 7.0+ 的用户证书 → 系统证书转换

注意: 需要Root权限
"""

import subprocess
import hashlib
import sys
import os


def get_cert_hash(cert_path):
    """计算证书的subject_hash_old"""
    result = subprocess.run(
        ["openssl", "x509", "-inform", "PEM", "-subject_hash_old", "-in", cert_path, "-noout"],
        capture_output=True, text=True
    )
    return result.stdout.strip()


def convert_to_system_cert(cert_path, output_dir="./output"):
    """将PEM证书转换为Android系统证书格式"""
    if not os.path.exists(cert_path):
        print(f"[ERROR] Certificate not found: {cert_path}")
        sys.exit(1)
    
    os.makedirs(output_dir, exist_ok=True)
    
    # 获取hash
    cert_hash = get_cert_hash(cert_path)
    output_name = f"{cert_hash}.0"
    output_path = os.path.join(output_dir, output_name)
    
    print(f"[INFO] Cert hash: {cert_hash}")
    print(f"[INFO] Output: {output_path}")
    
    # 转换格式
    subprocess.run([
        "openssl", "x509",
        "-inform", "PEM",
        "-outform", "DER",
        "-in", cert_path,
        "-out", output_path
    ], check=True)
    
    print(f"[OK] Certificate converted: {output_name}")
    return output_path


def install_to_device(cert_path):
    """推送证书到Android设备（需Root）"""
    cert_name = os.path.basename(cert_path)
    target = f"/system/etc/security/cacerts/{cert_name}"
    
    print(f"[INFO] Installing to device: {target}")
    
    commands = [
        "adb root",
        "adb remount",
        f"adb push {cert_path} {target}",
        f"adb shell chmod 644 {target}",
        "adb shell reboot"
    ]
    
    for cmd in commands:
        print(f"  > {cmd}")
        # subprocess.run(cmd.split(), check=True)  # 取消注释以实际执行
    
    print("[INFO] Commands generated (dry run mode)")
    print("[INFO] Remove comments in code to execute")


def main():
    if len(sys.argv) < 2:
        print("Usage: python cert_patch.py <cert.pem> [--install]")
        print("")
        print("Examples:")
        print("  python cert_patch.py charles-ssl.pem")
        print("  python cert_patch.py mitmproxy-ca.pem --install")
        sys.exit(1)
    
    cert_path = sys.argv[1]
    output = convert_to_system_cert(cert_path)
    
    if "--install" in sys.argv:
        install_to_device(output)


if __name__ == "__main__":
    main()
