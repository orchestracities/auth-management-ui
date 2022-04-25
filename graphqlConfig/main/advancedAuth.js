const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { configureKeycloak } = require('./lib/common')

const {
  KeycloakContext,
  KeycloakTypeDefs,
  KeycloakSchemaDirectives,
  hasPermission
} = require('../dist')

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
      kauth: new KeycloakContext({ req }, keycloak, { resource_server_id: 'graphql-config-server' })
    }
  }
})
server.applyMiddleware({ app })

const port = 4000

app.listen({ port }, () =>console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));