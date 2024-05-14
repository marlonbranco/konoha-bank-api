FROM node:lts-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npx prisma generate

RUN npx prisma migrate dev --name init

CMD [ "npm", "start" ]