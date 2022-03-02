import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
createHttpLink, 
} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import Keycloak from 'keycloak-js'
import { WebSocketLink } from 'apollo-link-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

var keycloak = Keycloak({
  url: 'http://localhost:8080/auth/',
  realm: 'keycloak-connect-graphql',
  clientId: 'myapp'
})



  keycloak.init({
    onLoad: 'login-required'
  }).then(authenticated => {
    if (authenticated) {
      keycloak.loadUserInfo().then(userInfo => {
        console.log("token", keycloak.token);
        const wsLink = new GraphQLWsLink(createClient({
          url: 'ws://localhost:4000/graphql',
          options: {
            reconnect: true,
          }
        }));
        
      

        const httpLink = createHttpLink({
          uri: 'http://localhost:4000/graphql',
        });
        
        const authLink = setContext((_, { headers }) => {
          // get the authentication token from local storage if it exists
          const token = localStorage.getItem('token');
          // return the headers to the context so httpLink can read them
          return {
            headers: {
              ...headers,
              Authorization: `Bearer ${keycloak.token}`
            }
          }
        });
        
        const client = new ApolloClient({
          link: authLink.concat(httpLink),
          cache: new InMemoryCache()
        });
        
        client
          .query({
            query: gql`
            query {
              greetings
            }
            `
          })
          .then(result => console.log(result));
      });
    }
  });



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
