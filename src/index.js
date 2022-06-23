import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import './i18n'
import { OidcProvider } from '@axa-fr/react-oidc';
import { useOidc, useOidcIdToken,useOidcAccessToken} from '@axa-fr/react-oidc';

const configuration = {
  client_id: process.env.REACT_APP_OIDC_CLIEN,
  redirect_uri: process.env.REACT_APP_URI+'authentication/callback',
  silent_redirect_uri: process.env.REACT_APP_URI+'authentication/silent-callback',
  scope: process.env.REACT_APP_OIDC_SCOPE, 
  authority: process.env.REACT_APP_OIDC_ISSUER,   
};


function LoginMockup(){
  const { login, isAuthenticated } = useOidc();
  const {idTokenPayload } = useOidcIdToken();
  const{ accessToken } = useOidcAccessToken();
  return  <App login={login} isAuthenticated={isAuthenticated} accessToken={accessToken} idTokenPayload={idTokenPayload}/>
}


ReactDOM.render(
  <OidcProvider configuration={configuration}
>
  <React.StrictMode>
   <LoginMockup></LoginMockup>
  </React.StrictMode>
  </OidcProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
