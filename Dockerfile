FROM node:12.13.1-alpine3.9

WORKDIR /lib

COPY package*.json ./
RUN npm install

COPY packages/claims/package.json ./packages/claims/
COPY packages/did/package.json ./packages/did/
COPY packages/did-document/package.json ./packages/did-document/
COPY packages/did-registry/package.json ./packages/did-registry/
COPY packages/jwt/package.json ./packages/jwt/
COPY packages/keys/package.json ./packages/keys/
COPY packages/resolver/package.json ./packages/resolver/
RUN cd packages && ../node_modules/.bin/npm-recursive-install; exit 0

COPY . .

RUN ./node_modules/.bin/lerna bootstrap

# To be used to run locally:
# RUN npm run lint && npm run build && npm run test