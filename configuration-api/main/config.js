let logger = require('logops');
const dotenv = require('dotenv');
logger.format = logger.formatters.pipe;
let config = {};
const logContext = { op: 'configuration-api.config' };

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
  const result = dotenv.config();
  if (result.error) {
    getLogger().warn(logContext, 'No .env file in path %s', result.error.path);
  }
  if (process.env.CONFIGURATION_API_PORT) {
    newConfig.port = process.env.CONFIGURATION_API_PORT;
  } else {
    newConfig.port = 4000;
  }
  //TODO this is very basic, authentication may be needed
  if (process.env.MONGO_DB) {
    newConfig.mongo_db = process.env.MONGO_DB;
  } else {
    newConfig.mongo_db = 'mongodb://root:example@localhost:27017/admin';
  }
  if (process.env.JWKS_URL) {
    newConfig.jwks_url = process.env.JWKS_URL;
  } else {
    newConfig.jwks_url = 'http://localhost:8080/realms/default/protocol/openid-connect/certs';
  }
  if (process.env.REACT_APP_OIDC_ISSUER) {
    newConfig.oidc_issuer = process.env.REACT_APP_OIDC_ISSUER;
  } else {
    newConfig.oidc_issuer = 'http://localhost:8080/realms/default';
  }
  if (process.env.REACT_APP_OIDC_AUDIENCE) {
    newConfig.oidc_audience = process.env.REACT_APP_OIDC_AUDIENCE;
  } else {
    newConfig.oidc_audience = '';
  }
  getLogger().info(logContext, 'New server configuration: %s', JSON.stringify(newConfig));
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
