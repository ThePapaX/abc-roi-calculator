#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.


FROM node:lts-alpine as build
ARG REACT_APP_VERSION
WORKDIR /app
COPY src/client/AbcRoiCalculator.UI/ReactApp/ .
RUN npm install
RUN chmod +x node_modules/.bin/react-scripts
RUN npm run-script build

FROM nginx:alpine
COPY --from=build /app/build/ /usr/share/nginx/html
COPY src/client/AbcRoiCalculator.UI/nginx.conf /etc/nginx/
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
