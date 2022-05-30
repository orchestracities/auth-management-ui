FROM node:latest
LABEL version="0.1"
LABEL description="Management UI for Anubis: https://anubis-pep.readthedocs.io/en/latest/."
LABEL maintainer = ["valerio.cantore@martel-innovate.com"]
COPY ["package.json", "package-lock.json", "./"]
RUN npm install --force
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
