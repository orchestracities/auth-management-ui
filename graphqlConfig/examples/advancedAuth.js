const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const { configureKeycloak } = require('./lib/common')
const mongoose = require("mongoose");

const {
  KeycloakContext,
  KeycloakTypeDefs,
  KeycloakSchemaDirectives,
  hasPermission
} = require('..')
require('dotenv').config({ path: '../.env' })

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.REACT_APP_MONGO_DB);
}

const usrPreference = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
});

const Preferences = mongoose.model('UsrPreferences', usrPreference);

const app = express()

const graphqlPath = '/graphql'

const { keycloak } = configureKeycloak(app, graphqlPath)



async function get(data) {
  const thisUser = await Preferences.find({ name: { $in: data } })

  return await thisUser;
}


async function update(data) {
  const filter = { name: data.name };
  const update = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor
  };

  let thisTenant = await Preferences.findOneAndUpdate(filter, update);
  return await thisTenant;
}


async function add(data) {
  const arrayOfData = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor
  };

  let thisTenant = await arrayOfData.save(function (err) {
  if (err) return handleError(err);
  // that's it!
});
  return await thisTenant;
}

async function deleteTenant(data) {
  const thisUser = await Preferences.find({ name: { $in: data } })

  for (let e of thisUser) {
    let deletedOwner = await Preferences.findByIdAndRemove(e._id);

  }
  return await ( typeof deletedOwner === 'object')?true:false;
}



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
      kauth: new KeycloakContext({ req }, keycloak, { resource_server_id: 'keycloak-connect-graphql-resource-server' })
    }
  }
})
server.applyMiddleware({ app })

const port = 4000

app.listen({ port }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)