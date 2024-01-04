FROM node:16-alpine
RUN mkdir -p ~/frontend

WORKDIR frontend

RUN npm install
RUN npm run build

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "node.js"]