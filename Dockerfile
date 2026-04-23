FROM node:22-alpine

RUN apk add --no-cache \
    nginx nginx-mod-http-geoip2 nginx-mod-http-lua nginx-mod-devel-kit lua-resty-http lua-resty-string lua5.1-cjson \
    bash gettext && \
    mkdir -p /var/cache/nginx /var/log/nginx /etc/systemd/system

# CrowdSec : install agent + bouncer + bootstrap + cleanup en un seul layer
ARG CROWDSEC_VERSION=1.6.8
ARG BOUNCER_VERSION=1.1.1
RUN wget -qO /tmp/crowdsec.tgz \
      "https://github.com/crowdsecurity/crowdsec/releases/download/v${CROWDSEC_VERSION}/crowdsec-release.tgz" && \
    tar xzf /tmp/crowdsec.tgz -C /tmp && \
    cd /tmp/crowdsec-v${CROWDSEC_VERSION} && \
    bash ./wizard.sh --bininstall && \
    wget -qO /tmp/bouncer.tgz \
      "https://github.com/crowdsecurity/cs-openresty-bouncer/releases/download/v${BOUNCER_VERSION}/crowdsec-openresty-bouncer.tgz" && \
    tar xzf /tmp/bouncer.tgz -C /tmp && \
    mkdir -p /usr/lib/nginx/lualib/plugins/crowdsec /var/lib/crowdsec/lua/templates /etc/crowdsec/bouncers && \
    cp /tmp/crowdsec-openresty-bouncer-v*/lua/lib/crowdsec.lua /usr/lib/nginx/lualib/ && \
    cp /tmp/crowdsec-openresty-bouncer-v*/lua/lib/plugins/crowdsec/*.lua /usr/lib/nginx/lualib/plugins/crowdsec/ && \
    cp /tmp/crowdsec-openresty-bouncer-v*/templates/*.html /var/lib/crowdsec/lua/templates/ && \
    cscli machines add -a --force 2>/dev/null && \
    cscli hub update && \
    cscli collections install crowdsecurity/nginx --force && \
    cscli collections install crowdsecurity/http-cve --force && \
    BOUNCER_KEY=$(cscli bouncers add nginx-bouncer -o raw) && \
    printf 'ENABLED=true\nAPI_URL=http://127.0.0.1:8080\nAPI_KEY=%s\nMODE=stream\nUPDATE_FREQUENCY=10\nCACHE_EXPIRATION=1\nBOUNCING_ON_TYPE=all\nFALLBACK_REMEDIATION=ban\nREQUEST_TIMEOUT=3000\nBAN_TEMPLATE_PATH=/var/lib/crowdsec/lua/templates/ban.html\nSSL_VERIFY=false\n' "$BOUNCER_KEY" > /etc/crowdsec/bouncers/crowdsec-openresty-bouncer.conf && \
    sed -i '/online_client/,/credentials_path/d' /etc/crowdsec/config.yaml && \
    rm -rf /tmp/crowdsec* /tmp/bouncer* /usr/local/lib/crowdsec/plugins /usr/local/include /usr/local/bin/cscli && \
    apk del --no-cache bash gettext

COPY infrastructure/nginx/entrypoint.sh /app/entrypoint.sh
COPY infrastructure/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infrastructure/nginx/403.html /usr/share/nginx/html/403.html
COPY infrastructure/nginx/acquis.yaml /etc/crowdsec/acquis.yaml

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
