FROM node:14-alpine AS base

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY . ./

CMD ["npm", "start"]