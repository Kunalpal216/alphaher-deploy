FROM node:18-alpine
WORKDIR  /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

ENV NEXT_PUBLIC_API_BASE_PATH=https://alphaherd.azurewebsites.net

COPY . ./

CMD ["npx","prisma","db","push",";","npm","run","dev"]