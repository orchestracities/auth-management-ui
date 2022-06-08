const express = require('express')
const cors = require('cors')
const passport = require('passport')
const { ApolloServer, gql } = require('apollo-server-express')
require('dotenv').config({ path: '../.env' })
const {  buildContext } = require("graphql-passport");
const app = express()
const { get, update, add, deleteTenant } = require('./mongo/tenantsQueries')
const { getUserPref, updateUserPref } = require('./mongo/usrSettings')

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
`

const resolvers = {
  Query: {
    listTenants: async (obj, args, context, info) => {
      return await get(args.tenantNames)
    },
    getUserPreferences: async (obj, args, context, info) => {
      return await getUserPref(args.usrName)
    }
  },
  Mutation: {
    modifyUserPreferences: async (object, args, context, info) => {
      return await [updateUserPref(args)]
    },
    publishTenants: async (object, args, context, info) => {
      return await [add(args)]
    },
    modifyTenants: async (object, args, context, info) => {
      return await [update(args)]
    },
    removeTenants: async (object, args, context, info) => {
      return await deleteTenant(args)
    }
  }
}


app.use(cors())

app.get('/auth/keycloak',
  passport.authenticate('keycloak', { scope: ['profile'] }));

app.get('/auth/keycloak/callback', 
  passport.authenticate('keycloak', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs: [typeDefs],
    resolvers,
    context: ({ req }) => {
      return {
        kauth: buildContext({ req })
      }
    }
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
  app.listen({ port }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
    )
  )
}
startServer()

const port = 4000
