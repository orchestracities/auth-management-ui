# auth management ui

This Webapp is to provide an intuitive UI for [Anubis policy-api](https://github.com/orchestracities/anubis) using the language of [Material for you](https://m3.material.io/) (or Material v3) and the help of [MUI](https://mui.com/) in order to have an intuitive and a familiar look and feel for the end user.

![Interface](https://user-images.githubusercontent.com/34061179/161280350-a7a9fa46-9176-447c-b031-050f9e17f6a7.png)

## How to setup Docker

To start the docker compose and populate keycloack use the script:

```
start.sh
```
The default user/password inside keycloack is admin/admin

## How to setup the Webapp

### The Webapp

To setup the webapp first of all let's create a .env file inside the main folder, the file should contain the strings:

```
REACT_APP_ANUBIS_API_URL=http://localhost:8085/
REACT_APP_MONGO_DB=mongodb://localhost:27017/test
```

Then let's start the package required with

```
npm install
```

after that we can start our application with

```
npm start
```

###  Keycloack and graphql

To setup the connection between keycloack and graphql open a new window and move to the graphqlConfig folder

```
cd graphqlConfig
```

Then let's start the package required with

```
npm install
```

To run a simple example use:

```
node examples/advancedAuth.js
```
