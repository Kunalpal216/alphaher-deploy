FROM node:18-alpine
WORKDIR  /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . ./

CMD ["npx","prisma","db","push",";","npm","run","dev"]