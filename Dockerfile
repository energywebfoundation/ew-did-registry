FROM node:12.13.1-alpine3.9

WORKDIR /lib

COPY package*.json ./
COPY packages/claims/package.json ./packages/claims/
COPY packages/did/package.json ./packages/did/
COPY packages/did-document/package.json ./packages/did-document/
COPY packages/did-registry/package.json ./packages/did-registry/
COPY packages/jwt/package.json ./packages/jwt/
COPY packages/keys/package.json ./pagit ckages/keys/
COPY packages/resolver/package.json ./packages/resolver/

RUN npm install && npm run installPackageDependencies

COPY . .

RUN ./node_modules/.bin/lerna bootstrap

# To be used to run locally:
# RUN npm run lint && npm run build && npm run test