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

    if (process.env.OIDC_CONFIGURATION_URL) {
        newConfig.oidc_configuration_url = process.env.OIDC_CONFIGURATION_URL;
    } else {
        newConfig.oidc_configuration_url = 'http://localhost:8080/auth/realms/master/.well-known/openid-configuration';
    }
    if (process.env.OIDC_CLIENT) {
        newConfig.oidc_client = process.env.OIDC_URL;
    }
    if (process.env.OIDC_CLIENT_SECRET) {
        newConfig.oidc_client_secret = process.env.OIDC_CLIENT_SECRET;
    }
    if (process.env.OIDC_REDIRECT_URL) {
        newConfig.oidc_redirect_url = process.env.OIDC_REDIRECT_URL;
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
