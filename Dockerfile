FROM node:22-alpine

RUN apk add --no-cache nginx nginx-mod-http-geoip2 && \
    mkdir -p /var/cache/nginx

COPY entrypoint.sh /app/entrypoint.sh
COPY nginx.conf /etc/nginx/nginx.conf

ARG DBIP_DATE
RUN wget -O /tmp/dbip-country-lite.mmdb.gz "https://download.db-ip.com/free/dbip-country-lite-${DBIP_DATE}.mmdb.gz" && \
    gunzip /tmp/dbip-country-lite.mmdb.gz && \
    mkdir -p /usr/share/GeoIP && \
    mv /tmp/dbip-country-lite.mmdb /usr/share/GeoIP/dbip-country-lite.mmdb

WORKDIR /app

COPY public ./public
COPY .next/standalone ./

EXPOSE 80

CMD ["./entrypoint.sh"]
