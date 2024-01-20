FROM node:16-alpine
RUN mkdir -p ~/backend

WORKDIR backend

COPY . .
RUN rm -rf ./node_modules

RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "./build/index.js"]