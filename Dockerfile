FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV production
ENV SERVICE Template

RUN npm install npm@latest -g
RUN apk add dumb-init

COPY --chown=node:node package.json package-lock.json ./
RUN npm install --no-optional && npm cache clean --force
COPY --chown=node:node plugins ./plugins
COPY --chown=node:node routes ./routes
COPY --chown=node:node app.js app.js

USER node

CMD ["dumb-init", "npm", "start"]