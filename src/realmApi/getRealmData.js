import axios from 'axios';
import { getEnv } from '../env';
import * as log from 'loglevel';
import jwt_decode from 'jwt-decode';

const env = getEnv();
typeof env.LOG_LEVEL === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);


export const getSubGroups = async (tenantName, token) => {
  const tokenDecoded = jwt_decode(token);

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
    .then(response => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getClients = async (token) => {
  const tokenDecoded = jwt_decode(token);

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
    .then(response => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getRolesInClient = async (clientID, token) => {
  const tokenDecoded = jwt_decode(token);

  return axios
    .get(
      [env.OIDC_ISSUER.slice(0, 21), '/' + tokenDecoded.preferred_username, env.OIDC_ISSUER.slice(21)].join('') +
      '/clients/' +
      clientID + "/roles",
      {
        headers: {
          authorization: `Bearer ${token}`
        }
      }
    )
    .then(response => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const getRolesInRealm = async (token) => {
  const tokenDecoded = jwt_decode(token);

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
    .then(response => response.data)
    .catch((e) => {
      log.error(e);
    });
};

export const allUsers = async (token) => {
  const tokenDecoded = jwt_decode(token);

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
    .then(response => response.data)
    .catch((e) => {
      log.error(e);
    });
};


export const getAllRoles = async (token)=>{
const clients = await getClients(token);
const clientsId=[];
let roles=[];
clients.map((client) => (
clientsId.push(client.id)
))
for (let id of clientsId){
 let clientRoles= await getRolesInClient(id,token);
 clientRoles.map(((thisRole) => roles.push(thisRole.name)))
}

let realmRoles= await getRolesInRealm(token);
realmRoles.map(((thisRole) => roles.push(thisRole.name)))
  console.log(roles)
}