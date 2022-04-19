#Primera Etapa
FROM node:12-alpine as build-step

RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

#Segunda Etapa
FROM nginx:1.17.1-alpine
COPY --from=build-step /app/dist/envia-web /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
