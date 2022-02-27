FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV production
ENV SERVICE Template

RUN npm install npm@latest -g
RUN apk add dumb-init

COPY --chown=node:node package.json package-lock.json healthcheck.js ./
RUN npm install --no-optional && npm cache clean --force
COPY --chown=node:node plugins ./plugins
COPY --chown=node:node routes ./routes
COPY --chown=node:node app.js app.js

USER node

HEALTHCHECK --interval=60s --timeout=10s --start-period=5s \
    CMD node ./healthcheck.js

CMD ["dumb-init", "npm", "start"]