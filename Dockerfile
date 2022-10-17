FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm install -g pm2
EXPOSE 3000

CMD [ "npm", "run", "production" ]
