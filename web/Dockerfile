FROM node:16-alpine
RUN mkdir -p ~/frontend

WORKDIR frontend

COPY . .
COPY ./public ./build

RUN npm install

EXPOSE 3002

ENTRYPOINT ["npm", "run", "start"]