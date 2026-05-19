# PHP base
FROM php:8.2-fpm

# System packages + libaio symlink (ARM64: libaio1t64 creates libaio.so.1t64, bukan libaio.so.1)
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
    && rm -rf /var/lib/apt/lists/* \
    && find /usr/lib -name "libaio.so.1t64*" -exec sh -c 'ln -sf "$1" "$(dirname $1)/libaio.so.1"' _ {} \;

# Download Oracle Instant Client Basic Lite + SDK (ARM64, public CDN Oracle)
# Basic Lite: runtime libs mandiri (tidak butuh ORACLE_HOME)
# SDK: header files untuk compile oci8
RUN curl -L -o /tmp/ic-basic.zip \
    "https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-basiclite-linux.arm64-23.8.0.25.04.zip" \
    && curl -L -o /tmp/ic-sdk.zip \
    "https://download.oracle.com/otn_software/linux/instantclient/2380000/instantclient-sdk-linux.arm64-23.8.0.25.04.zip" \
    && mkdir -p /usr/lib/oracle/sdk/include \
    && unzip -q /tmp/ic-basic.zip -d /tmp/ic && mv /tmp/ic/instantclient_23_8/* /usr/lib/oracle/ \
    && unzip -q /tmp/ic-sdk.zip -d /tmp/ic-sdk && find /tmp/ic-sdk -name "*.h" -exec cp {} /usr/lib/oracle/sdk/include/ \; \
    && rm -rf /tmp/ic-basic.zip /tmp/ic-sdk.zip /tmp/ic /tmp/ic-sdk

# Register Oracle libs
RUN echo "/usr/lib/oracle" > /etc/ld.so.conf.d/oracle.conf && ldconfig

# Install oci8 PHP extension via PECL
RUN echo "instantclient,/usr/lib/oracle" | pecl install oci8 \
    && docker-php-ext-enable oci8

# Install other PHP extensions
RUN docker-php-ext-install pdo mbstring xml zip bcmath pcntl

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --no-interaction --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
