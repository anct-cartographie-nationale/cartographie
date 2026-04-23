#!/bin/sh

node server.js &
NODE_PID=$!

nginx -g 'daemon off;' &
NGINX_PID=$!

crowdsec -c /etc/crowdsec/config.yaml &
CROWDSEC_PID=$!

stop() {
    nginx -s quit
    kill "$CROWDSEC_PID" "$NODE_PID" 2>/dev/null
    wait "$CROWDSEC_PID" "$NODE_PID" 2>/dev/null
    exit 0
}

trap stop TERM INT

wait $NGINX_PID
