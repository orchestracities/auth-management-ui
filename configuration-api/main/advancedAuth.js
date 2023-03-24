const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { expressMiddleware } = require('@apollo/server/express4');
const { gql } = require('graphql-tag');
const { GraphQLError } = require('graphql');
const app = express();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwksRsa = require('jwks-rsa');
const config = require('./config');
const logContext = { op: 'configuration-api.advancedAuth' };

config.loadConfig();

const { get, update, add, deleteTenant } = require('./mongo/tenantsQueries');
const { getUserPref, updateUserPref } = require('./mongo/userSettings');
const { getResource, deleteResource, newResource, updateResource } = require('./mongo/resourceTypes');
const typeDefs = gql`



  type TenantConfiguration {
    name: String!
    icon: String!
    primaryColor: String!
    secondaryColor: String!
    customImage: String
  }
  type UserPreferencies {
    userName: String!
    language: String!
    lastTenantSelected: String
    welcomeText:[MainMessage]
  }

  type ResourceType {
    ID: String!
    name: String!
    userID: String!
    tenantName: String!
    endpointUrl: String!
  }

  type resourcePagination {
    data: [ResourceType]
    count: Int!
  }

  input WelcomeText {
    language: String!
      text: String!
  }

  type MainMessage {
    language: String!
      text: String!
  }

  type Query {
    listTenants(tenantNames: [String]!): [TenantConfiguration]
    getUserPreferences(userName: String!): [UserPreferencies]
    getTenantResourceType(tenantName: String!, skip: Int!, limit: Int!): resourcePagination
  }
  type Mutation {
    newResourceType(name: String!, userID: String!, tenantName: String!, endpointUrl: String!): [ResourceType]
    deleteResourceType(name: [String]!, tenantName: String!): [ResourceType]
    updateThisResource(
      name: String!
      userID: String!
      tenantName: String!
      endpointUrl: String!
      id: String!
    ): [ResourceType]
    modifyUserPreferences(userName: String!, language: String!, lastTenantSelected: String, welcomeText:[WelcomeText]): [UserPreferencies]
    getTenantConfig(
      name: String!
      icon: String!
      primaryColor: String!
      secondaryColor: String!
      file: String
    ): [TenantConfiguration]
    removeTenantConfig(tenantName: String!): [TenantConfiguration]
    modifyTenantConfig(
      name: String!
      icon: String!
      primaryColor: String!
      secondaryColor: String!
      file: String
    ): [TenantConfiguration]
  }
`;

const resolvers = {
  Query: {
    listTenants: async (object, args, context, info) => {
      config.getLogger().info(logContext, 'listTenants: %s', args.tenantNames);
      try {
        return await get(args.tenantNames);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    },
    getUserPreferences: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'getUserPreferences: %s', args.userName);
        return await getUserPref(args.userName);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    },
    getTenantResourceType: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'getTenantResourceType: %s', JSON.stringify(args));
        return await getResource(args);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    }
  },
  Mutation: {
    modifyUserPreferences: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'modifyUserPreferences: %s', JSON.stringify(args));
        return await [updateUserPref(args)];
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    },
    getTenantConfig: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'getTenantConfig: %s', JSON.stringify(args));
        return await [add(args)];
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    },
    modifyTenantConfig: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'modifyTenantConfig: %s', JSON.stringify(args));
        return [await update(args)];
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    },
    removeTenantConfig: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'removeTenantConfig: %s', JSON.stringify(args));
        return await deleteTenant(args);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError({ data: { reason: err.message } });
      }
    },
    newResourceType: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'newResourceType: %s', JSON.stringify(args));
        return await newResource(args);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError(err.message);
      }
    },
    deleteResourceType: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'deleteResourceType: %s', JSON.stringify(args));
        return await deleteResource(args);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError(err.message);
      }
    },
    updateThisResource: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'addEndpoint: %s', JSON.stringify(args));
        return await updateResource(args);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new GraphQLError(err.message);
      }
    }
  }
};

app.use(cors());

app.use('/configuration', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (user) {
      req.user = user;
    }
    if (info) {
      req.info = info;
    }
    if (err) {
      req.err = err;
    }
    next();
  })(req, res, next);
});

function verify(payload, verified) {
  config.getLogger().debug(logContext, payload);
  let user = {};
  if (payload.sub) {
    user.sub = payload.sub;
  }
  if (payload.preferred_username) {
    user.preferred_username = payload.preferred_username;
  }
  if (payload.email) {
    user.email = payload.email;
  }
  if (payload.tenants) {
    user.tenants = payload.tenants;
  }
  verified(null, user, null);
}
async function startServer() {
  passport.use(
    new JwtStrategy(
      {
        // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: config.getConfig().jwks_url
        }),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

        // Validate the audience and the issuer.
        audience: config.getConfig().oidc_audience,
        issuer: config.getConfig().oidc_issuer,
        algorithms: ['RS256']
      },
      verify
    )
  );

  app.use(passport.initialize());

  const apolloServer = new ApolloServer({
    typeDefs: [typeDefs],
    resolvers,
    csrfPrevention: true,
    context: ({ req }) => {
      if (req.info) throw new GraphQLError(req.info);
      if (!req.user)
        throw new GraphQLError('You must be logged in', {
          extensions: { code: 'UNAUTHENTICATED' }
        });
      return {
        auth: req.user
      };
    }
  });

  await startStandaloneServer(apolloServer);
  app.use('/configuration', cors(), expressMiddleware(apolloServer));
}

startServer();
