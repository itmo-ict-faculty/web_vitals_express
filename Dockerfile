FROM node:16-alpine
RUN mkdir -p ~/frontend

WORKDIR frontend

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000

ENTRYPOINT ["node", "node.js"]