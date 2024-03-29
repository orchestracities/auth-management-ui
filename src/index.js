import React from 'react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n';
import { OidcProvider } from '@axa-fr/react-oidc';
import { useOidc, useOidcIdToken, useOidcAccessToken } from '@axa-fr/react-oidc';
import { getEnv } from './env';
import { createRoot } from 'react-dom/client';

const env = getEnv();

const configuration = {
  client_id: env.OIDC_CLIENT,
  redirect_uri: env.URI + 'authentication/callback',
  silent_redirect_uri: env.URI + 'authentication/silent-callback',
  scope: env.OIDC_SCOPE,
  authority: env.OIDC_ISSUER
};

function LoginMockup() {
  const { login, isAuthenticated } = useOidc();
  const { idTokenPayload } = useOidcIdToken();
  const { accessToken } = useOidcAccessToken();
  return (
    <App
      login={login}
      renewTokens={login}
      isAuthenticated={isAuthenticated}
      accessToken={accessToken}
      idTokenPayload={idTokenPayload}
    />
  );
}
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <OidcProvider configuration={configuration}>
    <React.StrictMode>
      <LoginMockup></LoginMockup>
    </React.StrictMode>
  </OidcProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
