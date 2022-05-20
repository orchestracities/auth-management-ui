const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const { configureKeycloak } = require("./lib/common");
require("dotenv").config({ path: "../.env" });
const Keycloak = require('keycloak-connect')
const { KeycloakContext, KeycloakTypeDefs, KeycloakSchemaDirectives } = require('keycloak-connect-graphql')

const app = express();

const graphqlPath = "/graphql";


const { get, update, add, deleteTenant } = require("./mongo/tenantsQueries");
const { getUserPref, updateUserPref } = require("./mongo/usrSettings");

const typeDefs = gql`
  type TenantConfiguration {
    name: String!
    icon: String!
    primaryColor: String!
    secondaryColor: String!
  }
  type UserPreferencies {
    usrName: String!
    language: String!
  }
  type Query {
    listTenants(tenantNames: [String]!): [TenantConfiguration] 
    getUserPreferences(usrName: String!): [UserPreferencies] 
  }
  type Mutation {
    modifyUserPreferences(
      usrName: String!
      language: String!
    ): [UserPreferencies]
    publishTenants(
      name: String!
      icon: String!
      primaryColor: String!
      secondaryColor: String!
    ): [TenantConfiguration]
    removeTenants(tenantNames: [String]!): Boolean!
    modifyTenants(
      name: String!
      icon: String!
      primaryColor: String!
      secondaryColor: String!
    ): [TenantConfiguration]
  }
`;

const resolvers = {
  Query: {
    listTenants: async (obj, args, context, info) => {
      console.log(context);
      return await get(args.tenantNames);
    },
    getUserPreferences: async (obj, args, context, info) => {
      return await getUserPref(args.usrName);
    },
  },
  Mutation: {
    modifyUserPreferences: async (object, args, context, info) => {
      return await [updateUserPref(args)];
    },
    publishTenants: async (object, args, context, info) => {
      return await [add(args)];
    },
    modifyTenants: async (object, args, context, info) => {
      return await [update(args)];
    },
    removeTenants: async (object, args, context, info) => {
      return await deleteTenant(args);
    },
  },
};

const keycloak = new Keycloak({
  "realm": "master",
  "auth-server-url": "http://localhost:8080/auth",
  "ssl-required": "none",
  "resource": "keycloak-connect-graphql-public",
  "public-client": true,
  "use-resource-role-mappings": true,
  "confidential-port": 0
})

app.use(graphqlPath, keycloak.middleware())
const server = new ApolloServer({
  typeDefs: [KeycloakTypeDefs, typeDefs], // 1. Add the Keycloak Type Defs
  schemaDirectives: KeycloakSchemaDirectives, // 2. Add the KeycloakSchemaDirectives
  resolvers,
  context: ({ req }) => {
    return {
      kauth: new KeycloakContext({ req }, keycloak) // 3. add the KeycloakContext to `kauth`
    }
  }
})

server.applyMiddleware({ app });

const port = 4000;

app.listen({ port }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
);
