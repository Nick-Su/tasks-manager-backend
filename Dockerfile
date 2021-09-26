 # pull official base image
FROM node:latest
ENV NODE_ENV production

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app

EXPOSE 5000

CMD npm start
