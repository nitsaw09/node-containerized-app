FROM node:13-alpine AS base

WORKDIR /var/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]