FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN npm install npm@latest -g
RUN apk add dumb-init

COPY --chown=node:node package.json package-lock.json ./
RUN npm install --no-optional && npm cache clean --force
COPY --chown=node:node src ./src

USER node

HEALTHCHECK --interval=60s --timeout=10s --start-period=5s \
    CMD node ./src/scripts/healthcheck.js

CMD ["dumb-init", "npm", "start"]