const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { configureKeycloak } = require('./lib/common')

const {
  KeycloakContext,
  KeycloakTypeDefs,
  KeycloakSchemaDirectives,
  hasPermission
} = require('../')

const app = express()

const graphqlPath = '/graphql'

// perform the standard keycloak-connect middleware setup on our app
const { keycloak } = configureKeycloak(app, graphqlPath)


const typeDefs = gql`
  type Tenant {
    name: ID!
    icon: String!
    color: String!
  }
  type Query {
    listTenants: [Tenant]!  @auth
  }
  type Mutation {
    publishTenants(name: String!, icon: String!,color:String!): Tenant! 
    modifyTenants(name: String!, icon: String!,color:String!): Tenant! 
  }
`

let Tenants = [{ name: "Tenant1", icon: "test", color: "#9575cd"}, { name: "Tenant2", icon: "test", color:"#009688" }]
const resolvers = {
  Query: {
    listTenants: (obj, args, context, info) => {
      return Tenants;
    },
  },
  Mutation: {
    publishTenants: (object, args, context, info) => {
      const user = context.kauth.accessToken.content;
      Tenants.push({ name: args.name, icon: args.icon, color: args.color })
      return { name: args.name, icon: args.icon, color: args.color }
    },
    modifyTenants: (object, args, context, info) => {
     
      return "lol";
    }
  }
}

const server = new ApolloServer({
  typeDefs: [KeycloakTypeDefs, typeDefs],
  schemaDirectives: KeycloakSchemaDirectives,
  resolvers,
  context: ({ req }) => {
    return {
      kauth: new KeycloakContext({ req }, keycloak, { resource_server_id: 'keycloak-connect-graphql-resource-server' })
    }
  }
})

server.applyMiddleware({ app })

const port = 4000

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)