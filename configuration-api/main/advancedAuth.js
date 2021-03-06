const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloError, AuthenticationError } = require('apollo-server-errors');
const app = express();
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwksRsa = require('jwks-rsa');
const config = require('./config');
const logContext = { op: 'configuration-api.advancedAuth' };

config.loadConfig();

const { get, update, add, deleteTenant } = require('./mongo/tenantsQueries');
const { getUserPref, updateUserPref } = require('./mongo/usrSettings');
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
    modifyUserPreferences(usrName: String!, language: String!): [UserPreferencies]
    publishTenants(name: String!, icon: String!, primaryColor: String!, secondaryColor: String!): [TenantConfiguration]
    removeTenants(tenantNames: [String]!): Boolean!
    modifyTenants(name: String!, icon: String!, primaryColor: String!, secondaryColor: String!): [TenantConfiguration]
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
        throw new ApolloError({ data: { reason: err.message } });
      }
    },
    getUserPreferences: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'getUserPreferences: %s', args.usrName);
        return await getUserPref(args.usrName);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new ApolloError({ data: { reason: err.message } });
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
        throw new ApolloError({ data: { reason: err.message } });
      }
    },
    publishTenants: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'publishTenants: %s', JSON.stringify(args));
        return await [add(args)];
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new ApolloError({ data: { reason: err.message } });
      }
    },
    modifyTenants: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'modifyTenants: %s', JSON.stringify(args));
        return await [update(args)];
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new ApolloError({ data: { reason: err.message } });
      }
    },
    removeTenants: async (object, args, context, info) => {
      try {
        config.getLogger().info(logContext, 'removeTenants: %s', JSON.stringify(args));
        return await deleteTenant(args);
      } catch (err) {
        config.getLogger().error(logContext, err);
        throw new ApolloError({ data: { reason: err.message } });
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
      if (req.info) throw new AuthenticationError(req.info);
      if (!req.user) throw new AuthenticationError('you must be logged in');
      return {
        auth: req.user
      };
    }
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/configuration' });
  const port = config.getConfig().port;
  app.listen({ port }, () =>
    config.getLogger().info(logContext, '???? Server ready at http://localhost:%s%s', port, apolloServer.graphqlPath)
  );
}

startServer();
