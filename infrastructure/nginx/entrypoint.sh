#!/bin/sh

node server.js &
NODE_PID=$!

crowdsec -c /etc/crowdsec/config.yaml &
CROWDSEC_PID=$!

# Attendre que le LAPI CrowdSec soit pret
for i in $(seq 1 30); do
    if wget -qO /dev/null http://127.0.0.1:8080/health 2>/dev/null; then
        echo "CrowdSec LAPI ready"
        break
    fi
    sleep 1
done

stop() {
    nginx -s quit
    kill "$CROWDSEC_PID" "$NODE_PID"
    wait "$CROWDSEC_PID" "$NODE_PID"
    exit 0
}

trap stop TERM INT

nginx -g 'daemon off;' &
wait $!
