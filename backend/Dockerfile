FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libaio1t64 \
    unzip git curl zip wget \
    libzip-dev libxml2-dev libpng-dev libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# install-php-extensions (otomatis handle Oracle Instant Client + oci8)
ADD https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

RUN chmod +x /usr/local/bin/install-php-extensions \
    && install-php-extensions oci8

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