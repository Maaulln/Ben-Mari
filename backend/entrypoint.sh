#!/bin/bash
set -e

echo "=== Klinik BenMari Backend ==="

# Pastikan direktori storage Laravel ada dan writable
mkdir -p storage/framework/views storage/framework/cache storage/framework/sessions storage/logs storage/app/public
chmod -R 775 storage bootstrap/cache

# Retry migrate — Oracle mungkin perlu beberapa detik walau health check sudah OK
echo "[migrate] Menjalankan migrations..."
MAX_TRIES=15
COUNT=0
until php artisan migrate --force 2>&1; do
    COUNT=$((COUNT + 1))
    if [ "$COUNT" -ge "$MAX_TRIES" ]; then
        echo "[migrate] ERROR: Gagal setelah $MAX_TRIES percobaan. Periksa koneksi Oracle."
        exit 1
    fi
    echo "[migrate] Percobaan $COUNT/$MAX_TRIES gagal, coba lagi dalam 10 detik..."
    sleep 10
done

# Seed hanya saat pertama kali (abaikan error jika data sudah ada)
echo "[seed] Mengisi data awal..."
php artisan db:seed --force 2>&1 || echo "[seed] Data sudah ada, seed dilewati."

echo "[server] Menjalankan server di :8000..."
exec php artisan serve --host=0.0.0.0 --port=8000
