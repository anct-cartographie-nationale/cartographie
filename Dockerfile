FROM node:20-alpine

WORKDIR /app

COPY .next/standalone ./

EXPOSE 3000

CMD ["node", "server.js"]
