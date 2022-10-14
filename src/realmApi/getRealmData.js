import axios from 'axios';
import * as log from 'loglevel';
import jwt_decode from 'jwt-decode';

export const getSubGroups = async (tenantName, token, env) => {
  const tokenDecoded = jwt_decode(token);
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(
      [env.OIDC_ISSUER.slice(0, 21), '/' + tokenDecoded.preferred_username, env.OIDC_ISSUER.slice(21)].join('') +
        '/groups/' +
        tokenDecoded.tenants[tenantName].id,
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getClients = async (token, env) => {
  const tokenDecoded = jwt_decode(token);
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(
      [env.OIDC_ISSUER.slice(0, 21), '/' + tokenDecoded.preferred_username, env.OIDC_ISSUER.slice(21)].join('') +
        '/clients',
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getRolesInClient = async (clientID, token, env) => {
  const tokenDecoded = jwt_decode(token);
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(
      [env.OIDC_ISSUER.slice(0, 21), '/' + tokenDecoded.preferred_username, env.OIDC_ISSUER.slice(21)].join('') +
        '/clients/' +
        clientID +
        '/roles',
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getRolesInRealm = async (token, env) => {
  const tokenDecoded = jwt_decode(token);
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(
      [env.OIDC_ISSUER.slice(0, 21), '/' + tokenDecoded.preferred_username, env.OIDC_ISSUER.slice(21)].join('') +
        '/roles/',
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const allUsers = async (token, env) => {
  const tokenDecoded = jwt_decode(token);
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(
      [env.OIDC_ISSUER.slice(0, 21), '/' + tokenDecoded.preferred_username, env.OIDC_ISSUER.slice(21)].join('') +
        '/users/',
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getAllRoles = async (token, env) => {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const clients = await getClients(token, env);
  const clientsId = [];
  let roles = [];
  clients.map((client) => clientsId.push(client.id));
  for (let id of clientsId) {
    let clientRoles = await getRolesInClient(id, token, env);
    clientRoles.map((thisRole) => roles.push(thisRole.name));
  }

  let realmRoles = await getRolesInRealm(token, env);
  realmRoles.map((thisRole) => roles.push(thisRole.name));
  return roles;
};
