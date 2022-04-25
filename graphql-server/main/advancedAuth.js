const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { configureKeycloak } = require('./lib/common')
require('dotenv').config({ path: '../.env' })
const { KeycloakContext, KeycloakTypeDefs, KeycloakSchemaDirectives } = require('keycloak-connect-graphql')

const app = express()

const graphqlPath = '/graphql'

const { keycloak } = configureKeycloak(app, graphqlPath)

const {get,update,add,deleteTenant} = require('./mongo/tenantsQueries')



const typeDefs = gql`
  type TenantConfiguration {
    name: String!
    icon: String!
    primaryColor: String!
    secondaryColor: String!
  }
  type Query {
    listTenants(tenantNames:[String]!): [TenantConfiguration]  @auth
  }
  type Mutation {
    publishTenants(name: String!, icon: String!,primaryColor: String!,secondaryColor: String!): [TenantConfiguration]
    removeTenants(tenantNames:[String]!): Boolean!
    modifyTenants(name: String!, icon: String!,primaryColor: String!,secondaryColor: String!): [TenantConfiguration] 
  }
`

const resolvers = {
  Query: {
    listTenants: async (obj, args, context, info) => {
      return await get(args.tenantNames);
    }
  },
  Mutation: {
    publishTenants: async (object, args, context, info) => {
      return await [add(args)];
    },
    modifyTenants: async (object, args, context, info) => {
      return await [update(args)];
    },
    removeTenants: async (object, args, context, info) => {
      return await deleteTenant(args);
    },
  }
}

const server = new ApolloServer({
  typeDefs: [KeycloakTypeDefs, typeDefs],
  schemaDirectives: KeycloakSchemaDirectives,
  resolvers,
  context: ({ req }) => {
    return {
      kauth: new KeycloakContext({ req }, keycloak, { resource_server_id: process.env.GRAPHQL_RESOURCE_SERVER_NAME })
    }
  }
})
server.applyMiddleware({ app })

const port = 4000

app.listen({ port }, () =>console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
