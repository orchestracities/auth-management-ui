import axios from 'axios';
import * as log from 'loglevel';
import jwt_decode from 'jwt-decode';

export const getSubGroups = async (tenantID, token, env) => {
  const tokenDecoded = jwt_decode(token);
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(env.KEYCLOACK_ADMIN + '/groups/' + tenantID, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getClients = async (token, env) => {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(env.KEYCLOACK_ADMIN + '/clients', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getRolesInClient = async (clientID, token, env) => {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(env.KEYCLOACK_ADMIN + '/clients/' + clientID + '/roles', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getRolesInRealm = async (token, env) => {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(env.KEYCLOACK_ADMIN + '/roles/', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const allUsers = async (token, env) => {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  return axios
    .get(env.KEYCLOACK_ADMIN + '/users/', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    .then((response) => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getAllRoles = async (token, env) => {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const clients = await getClients(token, env);
  const clientsData = [];
  let roles = [];
  clients.map((client) => clientsData.push({ id: client.id, name: client.clientId }));
  for (let thisClient of clientsData) {
    let clientRoles = await getRolesInClient(thisClient.id, token, env);
    clientRoles.map((thisRole) => roles.push(thisClient.name + ':' + thisRole.name));
  }

  let realmRoles = await getRolesInRealm(token, env);
  realmRoles.map((thisRole) => roles.push(thisRole.name));
  return roles;
};
