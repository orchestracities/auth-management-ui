/*
 * Automatically generated by cra-envs.
 * If you wish to declare a new environment variable declare it in the .env file (prefixed by REACT_APP_)
 * then run 'npx generate-env-getter js' at the root of your project.
 * This file will be updated.
 */
import { getEnvVarValue } from 'cra-envs';

export const envNames = [
  'URI',
  'ANUBIS_API_URL',
  'CONFIGURATION_API_URL',
  'OIDC_ISSUER',
  'OIDC_CLIENT',
  'OIDC_SCOPE',
  'IMAGE_SIZE',
  'LOG_LEVEL',
  'KEYCLOACK_ADMIN',
  'ORION',
  'GOOGLE_MAPS',
  'TITLE',
  'DESCRIPTION'
];

let env = undefined;

export function getEnv() {
  if (env === undefined) {
    env = {};
    for (const envName of envNames) {
      env[envName] = getEnvVarValue(envName);
    }
  }

  return env;
}
