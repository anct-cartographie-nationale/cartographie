FROM node:20-alpine

WORKDIR /app

COPY .next/standalone ./
COPY public ./public

EXPOSE 3000

CMD ["node", "server.js"]
