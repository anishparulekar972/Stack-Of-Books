# syntax=docker/dockerfile:1
FROM node:20.17-alpine3.19
WORKDIR /code
RUN npm install redis
EXPOSE 5000
COPY . .
CMD ["node", "server.js"]