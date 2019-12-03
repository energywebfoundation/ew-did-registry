FROM node:12.13.1-alpine3.9

WORKDIR /lib

COPY package*.json ./

RUN npm install

COPY . .

RUN ./node_modules/.bin/lerna bootstrap

RUN npm run lint && npm run build && npm run test