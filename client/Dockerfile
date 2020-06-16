FROM node:10

WORKDIR ./
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm","run","serve"]
