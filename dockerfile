FROM node:16-alpine AS build
LABEL version="0.1"
LABEL description="Management UI for Anubis: https://anubis-pep.readthedocs.io/en/latest/."
LABEL maintainer = ["valerio.cantore@martel-innovate.com"]
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

FROM nginx:1.23-alpine as release
RUN apk add --update nodejs npm

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf    
COPY --from=build /app/node_modules/cra-envs/package.json ./cra-envs-package.json
RUN npm i -g cra-envs@`node -e 'console.log(require("./cra-envs-package.json")["version"])'`
WORKDIR /usr/share/nginx
COPY --from=build /app/build ./html
COPY --from=build /app/package.json .
COPY --from=build /app/public/index.html ./public/
ENTRYPOINT sh -c "npx embed-environnement-variables && nginx -g 'daemon off;'"
