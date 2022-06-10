const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloError, AuthenticationError } = require('apollo-server-errors');
const { buildContext } = require('graphql-passport');
const app = express();
const { Issuer, Strategy } = require('openid-client');
const expressSession = require('express-session');
const config = require('./config');
const logContext = { op: 'anubisGraphql.advancedAuth' };

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

async function startServer() {
    const issuer = await Issuer.discover(config.getConfig().oidc_configuration_url);
    config
        .getLogger()
        .debug(logContext, 'Loading open id connector configuration: %s', JSON.stringify(issuer.metadata));

    const client = new issuer.Client({
        client_id: 'keycloak-connect-graphql-public', // TODO value should be loaded from configuration
        //TODO client_secret: this.settings.clientSecret, we are using a public one... not the best choice but ok for testing now
    });
    config.getLogger().debug(logContext, 'Configuring client: %s', JSON.stringify(client.metadata));

    const params = {
        // ... any authorization params override client properties
        // client_id defaults to client.client_id
        // redirect_uri defaults to client.redirect_uris[0]
        // response type defaults to client.response_types[0], then 'code'
        // scope defaults to 'openid'
    };

    app.use(passport.initialize());
    passport.use(
        'oidc',
        new Strategy({ client, params }, (tokenSet, userinfo, done) => {
            config.getLogger().info(logContext, 'Setting up passport strategy');
            config.getLogger().debug(logContext, 'tokenSet: %s', JSON.stringify(tokenSet));
            config.getLogger().debug(logContext, 'userinfo: %s', JSON.stringify(userinfo));
            return done(null, tokenSet.claims());
        })
    );

    passport.serializeUser(function (user, done) {
        config.getLogger().debug(logContext, 'serializeUser: %s', JSON.stringify(user));
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        config.getLogger().debug(logContext, 'deserializeUser: %s', JSON.stringify(user));
        done(null, user);
    });

    async function getUser(access_token) {
      try {
          const userinfo = await client.userinfo(access_token);
          return userinfo;
      } catch (err) {
          config.getLogger().error(logContext, err);
          throw new AuthenticationError({ data: { reason: err.message } });
      }
        return null;
    }

    const apolloServer = new ApolloServer({
        typeDefs: [typeDefs],
        resolvers,
        csrfPrevention: true,
        context: async ({ req, res }) => {
            const token = req.headers.authorization.replace('Bearer ', '') || '';
            // try to authenticate
            const user = await getUser(token);

            if (!user) throw new AuthenticationError('you must be logged in');
            return {
                auth: user
            };
        }
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    const port = config.getConfig().graphql_port;
    app.listen({ port }, () =>
        config.getLogger().info(logContext, '🚀 Server ready at http://localhost:%s%s', port, apolloServer.graphqlPath)
    );
}

startServer();
