#!/bin/sh

node server.js &
NODE_PID=$!

stop() {
    nginx -s quit
    kill "$NODE_PID"
    wait "$NODE_PID"
    exit 0
}

trap stop TERM INT

nginx -g 'daemon off;' &
wait $!
