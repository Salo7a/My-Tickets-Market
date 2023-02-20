FROM node:19-alpine

RUN apk update && apk add dumb-init

ENV NODE_ENV production

WORKDIR /usr/app

COPY --chown=node:node package.json .

COPY package.json ./

RUN npm i --omit=dev

COPY ./ ./

#USER node

CMD ["dumb-init", "npm", "start"]