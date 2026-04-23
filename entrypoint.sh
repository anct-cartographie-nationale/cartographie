#!/bin/sh

node server.js &

exec nginx -g 'daemon off;'
