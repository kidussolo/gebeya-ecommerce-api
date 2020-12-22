FROM node:13.10.1-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
EXPOSE 5000

CMD ["node", "app.js"]