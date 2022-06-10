let logger = require('logops');
logger.format = logger.formatters.pipe;
let config = {};
const logContext = { op: 'anubisGraphql.config' };

/**
 * Sets the configuration.
 *
 * @param      {<type>}  newConfig  The new configuration
 */
function setConfig(newConfig) {
    config = newConfig;
}

/**
 * Gets the configuration.
 *
 * @return     {<type>}  The configuration.
 */
function getConfig() {
    return config;
}

function loadConfig() {
    const newConfig = getConfig();
    if (process.env.GRAPHQL_PORT) {
        newConfig.graphql_port = process.env.GRAPHL_PORT;
    } else {
        newConfig.graphql_port = 4000;
    }
    //TODO this is very basic, authentication may be needed
    if (process.env.GRAPHQL_MONGO_DB) {
        newConfig.graphql_mongo_db = process.env.GRAPHQL_MONGO_DB;
    } else {
        newConfig.graphql_mongo_db = 'mongodb://localhost:27017/graphql';
    }

    if (process.env.JWKS_URL) {
        newConfig.jwks_url = process.env.JWKS_URL;
    } else {
        newConfig.jwks_url = 'http://localhost:8080/auth/realms/master/protocol/openid-connect/certs';
    }
    if (process.env.OIDC_ISSUER) {
        newConfig.oidc_issuer = process.env.OIDC_ISSUER;
    } else {
        newConfig.oidc_issuer = 'http://localhost:8080/auth/realms/master';
    }
    if (process.env.OIDC_AUDIENCE) {
        newConfig.oidc_audience = process.env.OIDC_AUDIENCE;
    } else {
        newConfig.oidc_audience = '';
    }
    getLogger().debug(logContext, 'New server configuration: %s', JSON.stringify(newConfig));
    setConfig(newConfig);
}

function setLogger(newLogger) {
    logger = newLogger;
}

function getLogger() {
    return logger;
}

exports.setConfig = setConfig;
exports.getConfig = getConfig;
exports.setLogger = setLogger;
exports.getLogger = getLogger;
exports.loadConfig = loadConfig;
