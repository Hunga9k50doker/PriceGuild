# build stage
FROM node:alpine as build-stage
WORKDIR /home/src/app
COPY . .
RUN npm install
RUN npm run build:dev
# RUN npm run build:staging
# RUN npm run build:production

# production stage
FROM nginx:alpine as production-stage
WORKDIR /usr/share/nginx/html
COPY --from=build-stage /home/src/app/build /usr/share/nginx/html
COPY config/nginx-server.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]