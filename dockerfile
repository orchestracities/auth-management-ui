FROM node:14-alpine AS builder
LABEL version="0.1"
LABEL description="Management UI for Anubis: https://anubis-pep.readthedocs.io/en/latest/."
LABEL maintainer = ["valerio.cantore@martel-innovate.com"]
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force
COPY . ./
RUN npm run build
FROM node:14-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
