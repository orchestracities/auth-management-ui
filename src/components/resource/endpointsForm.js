import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';
import * as log from 'loglevel';
import isURL from 'validator/lib/isURL';
import charNotAllowed from './charNotAllowed';

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function EndpointsForm({ title, close, action, token, env, getTheResources, data }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const notAllowed = charNotAllowed;
  const httpLink = createHttpLink({
    uri: typeof env !== 'undefined' ? env.CONFIGURATION_API_URL : ''
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ addTypename: false })
  });

  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const handleClose = () => {
    close(false);
  };

  const [endpoint, setEndpoint] = React.useState(data[0].endpointUrl);
  const [name, setName] = React.useState(data[0].name);

  const nameCases = () => {
    switch (true) {
      case name === '':
        return 'The name is mandatory';
      case name.indexOf(' ') >= 0:
        return 'The name should be without spaces';
      case notAllowed(name):
        return 'Special characters not allowed';
      default:
        return false;
    }
  };

  const linkCases = () => {
    switch (true) {
      case endpoint === '':
        return 'The url is mandatory';
      case endpoint.indexOf(' ') >= 0:
        return 'The url should be without spaces';
      case !isURL(endpoint, { host_whitelist: ['localhost'] }):
        return 'The url should be valid';
      default:
        return false;
    }
  };

  const handleSave = () => {
    if (nameCases() === false && linkCases() === false) {
      switch (action) {
        case 'modify':
          client
            .mutate({
              mutation: gql`
                mutation updateThisResource(
                  $name: String!
                  $userID: String!
                  $tenantName: String!
                  $endpointUrl: String!
                  $id: String!
                ) {
                  updateThisResource(
                    name: $name
                    userID: $userID
                    tenantName: $tenantName
                    endpointUrl: $endpointUrl
                    id: $id
                  ) {
                    ID
                    name
                    userID
                    tenantName
                    endpointUrl
                  }
                }
              `,
              variables: {
                id: data[0].ID,
                name: name.toLowerCase(),
                userID: data[0].userID,
                tenantName: data[0].tenantName,
                endpointUrl: endpoint
              }
            })
            .then(() => {
              close(false);
              getTheResources();
            })
            .catch((e) => {
              sendNotification({ msg: e.message + ' the config', variant: 'error' });
            });
          break;
        case 'create':
          break;
        default:
          break;
      }
    }
  };
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="name"
              label={<Trans>resourceType.form.resourceName</Trans>}
              variant="outlined"
              sx={{
                width: '100%'
              }}
              value={name}
              onChange={(event) => {
                setName(event.target.value.toLowerCase());
              }}
              helperText={nameCases()}
              error={name === '' || name.indexOf(' ') >= 0 || notAllowed(name)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="Endpoint"
              label={<Trans>resourceType.form.endpoint</Trans>}
              variant="outlined"
              value={endpoint}
              sx={{
                width: '100%'
              }}
              onChange={(event) => {
                setEndpoint(event.target.value);
              }}
              onClick={(e) => handlePropagation(e)}
              helperText={linkCases()}
              error={
                endpoint === '' || endpoint.indexOf(' ') >= 0 || !isURL(endpoint, { host_whitelist: ['localhost'] })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  );
}
