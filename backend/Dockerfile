# Stage 1: Ambil Oracle runtime libraries dari oracle-free (sudah ada di Docker cache)
FROM gvenzl/oracle-free:slim AS oracle-runtime

# Stage 2: PHP app
FROM php:8.2-fpm

# System packages
RUN apt-get update && apt-get install -y \
    libaio1t64 \
    unzip \
    git \
    curl \
    zip \
    libzip-dev \
    libxml2-dev \
    libpng-dev \
    libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# Salin Oracle client libraries dari stage 1
RUN mkdir -p /usr/lib/oracle
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libclntsh.so         /usr/lib/oracle/
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libclntsh.so.23.1    /usr/lib/oracle/
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libclntshcore.so     /usr/lib/oracle/
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libclntshcore.so.23.1 /usr/lib/oracle/
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libnnz.so            /usr/lib/oracle/
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libocci.so           /usr/lib/oracle/
COPY --from=oracle-runtime /opt/oracle/product/26ai/dbhomeFree/lib/libocci.so.23.1      /usr/lib/oracle/

# Daftarkan Oracle libs ke ldconfig
RUN echo "/usr/lib/oracle" > /etc/ld.so.conf.d/oracle.conf && ldconfig

# Install PHP oci8 via PECL (ODPI-C bundled — tidak butuh Oracle SDK headers)
RUN echo "instantclient,/usr/lib/oracle" | pecl install oci8 \
    && docker-php-ext-enable oci8

# Install PHP extensions lain yang dibutuhkan Laravel
RUN docker-php-ext-install pdo mbstring xml zip bcmath pcntl

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Salin kode aplikasi
COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader

# Set permissions untuk storage Laravel
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
