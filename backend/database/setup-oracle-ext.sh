#!/bin/bash
# Setup Oracle Instant Client + ext-oci8 untuk macOS ARM64
# Jalankan setelah download Oracle Instant Client dari Oracle

set -e

INSTANT_CLIENT_DIR="/opt/oracle"
PHP_INI="/opt/homebrew/etc/php/8.5/php.ini"

echo "=== Setup Oracle Instant Client + PHP oci8 ==="
echo ""

# Cek apakah zip instant client ada di direktori ini atau ~/Downloads
ZIP_FILE=$(find . ~/Downloads -maxdepth 1 -name "instantclient-basic*macos*arm64*.zip" 2>/dev/null | head -1)

if [ -z "$ZIP_FILE" ]; then
  echo "ERROR: File Oracle Instant Client tidak ditemukan."
  echo ""
  echo "Silakan download dari:"
  echo "  https://www.oracle.com/database/technologies/instant-client/macos-arm64-downloads.html"
  echo ""
  echo "Pilih: 'Basic' atau 'Basic Light' package -> .zip"
  echo "Simpan di direktori ini atau ~/Downloads, lalu jalankan script ini lagi."
  exit 1
fi

echo "[1/4] Mengekstrak $ZIP_FILE..."
sudo mkdir -p "$INSTANT_CLIENT_DIR"
sudo unzip -oq "$ZIP_FILE" -d "$INSTANT_CLIENT_DIR"

IC_PATH=$(find "$INSTANT_CLIENT_DIR" -maxdepth 1 -name "instantclient_*" -type d | head -1)
echo "      Instant Client path: $IC_PATH"

echo "[2/4] Membuat symlinks yang dibutuhkan..."
cd "$IC_PATH"
[ ! -f libclntsh.dylib ] && sudo ln -sf libclntsh.dylib.* libclntsh.dylib 2>/dev/null || true
[ ! -f libocci.dylib ] && sudo ln -sf libocci.dylib.* libocci.dylib 2>/dev/null || true

echo "[3/4] Menginstall oci8 via PECL (PHP 8.5)..."
echo "instantclient,$IC_PATH" | sudo pecl install oci8

echo "[4/4] Menambahkan extension=oci8 ke php.ini..."
if ! grep -q "^extension=oci8" "$PHP_INI"; then
  echo "extension=oci8" | sudo tee -a "$PHP_INI"
fi

echo ""
echo "Verifikasi:"
php -m | grep -i oci8 && echo "✓ oci8 AKTIF" || echo "✗ oci8 belum aktif, restart PHP-FPM jika perlu"
echo ""
echo "=== Selesai! Jalankan: cd backend && composer install ==="
