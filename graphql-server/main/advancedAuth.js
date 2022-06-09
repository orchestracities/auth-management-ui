const express = require('express')
const cors = require('cors')
const passport = require('passport')
const { ApolloServer, gql } = require('apollo-server-express')
require('dotenv').config({ path: '../.env' })
const {  buildContext } = require("graphql-passport");
const app = express()
const { get, update, add, deleteTenant } = require('./mongo/tenantsQueries')
const { getUserPref, updateUserPref } = require('./mongo/usrSettings')
const { Issuer, Strategy } = require ('openid-client');
const expressSession = require ('express-session');

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

async function startServer() {
app.use(cors())

const thisIssuer = await Issuer.discover('http://localhost:8080/auth/realms/master')


const client = new thisIssuer.Client({
    client_id: 'master',
    redirect_uris: ['http://localhost:8080/auth/realms/master/protocol/openid-connect/auth?client_id=client1&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=2646d2b3-7215-45ec-9e0a-ebd09fd69998&response_mode=fragment&response_type=code&scope=openid&nonce=e46becd8-84eb-4af8-8852-f643df11b0ff'],
    post_logout_redirect_uris: ['http://localhost:3000'],
    response_types: ['code'],
  });
  var memoryStore = new expressSession.MemoryStore();
  app.use(
      expressSession({
        secret: 'another_long_secret',
      resave: false,
      saveUninitialized: true,
      store: memoryStore
      })
  );

  app.use(passport.initialize());
  app.use(passport.authenticate('session'));
  passport.use('oidc', new Strategy({client}, (tokenSet, userinfo, done)=>{
          return done(null, tokenSet.claims());
      })
  )
  
  passport.serializeUser(function(user, done) {
      done(null, user);
    });
  passport.deserializeUser(function(user, done) {
      done(null, user);
  });
  
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
