# auth-management-ui

#How to setup

to start the docker compose use the file:

start.sh

open a new window and move to the keycloak-connect-graphql folder

cd keycloak-connect-graphql

and then

npm install

to populate keycloack run:

npm run examples:seed

after that is going to create some permissions like dev, user and admin
The Keycloak console is accessible at localhost:8080 and the admin login is admin/admin. You can make any configuration changes you wish 

to run a simple example use:

node examples/basic.js

Now you should see the GraphQL Playground.

NOTE: The login page is shown because the Keycloak middleware is enforcing authentication use the user developer with the same value as password.

to use the playground you should create a valid token, use the command:

 node scripts/getToken.js developer developer # username password

and paste the result inside the bottom part og the playground.

then you will be able to use the playground.

for texample try to use:

query {
  hello
}


