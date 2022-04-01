# auth management ui

## How to setup Docker

To start the docker compose and populate keycloack use the script:

```
start.sh
```
The default user/password inside keycloack is admin/admin

## How to setup the Webapp

### The Webapp

To setup the webapp first of all let's create a .env file inside the main folder, the file should contain the string:

```
REACT_APP_ANUBIS_API_URL=http://localhost:8085/
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

To setup the connection between keycloack and graphql open a new window and move to the keycloak-connect-graphql folder

```
cd keycloak-connect-graphql
```

Then let's start the package required with

```
npm install
```

To run a simple example use:

```
node examples/advancedAuth.js
```
