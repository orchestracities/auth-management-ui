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

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function EndpointsForm({ title, close, action, token, resourceTypeName, env, getTheResources, data }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);

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
    cache: new InMemoryCache()
  });

  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const handleClose = () => {
    close(false);
  };

  const [endpoint, setEndpoint] = React.useState(data[0].url);

  const cases = () => {
    switch (true) {
      case endpoint === '':
        return 'The url is mandatory';
      case endpoint.indexOf(' ') >= 0:
        return 'The url should be without spaces';
      case isURL(endpoint) === false:
        return 'The url should be valid';
      default:
        return false;
    }
  };

  const handleSave = () => {
    if (cases() === false) {
      switch (action) {
        case 'modify':
          client
            .mutate({
              mutation: gql`
                mutation updateThisEndpoint($resourceID: String!, $url: String!) {
                  updateThisEndpoint(resourceID: $resourceID, url: $url) {
                    url
                    resourceID
                  }
                }
              `,
              variables: { resourceID: data[0].resourceID, url: endpoint }
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
              id="Resource Type"
              label={<Trans>resourceType.form.resourceName</Trans>}
              variant="outlined"
              defaultValue={resourceTypeName}
              disabled
              sx={{
                width: '100%'
              }}
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
              helperText={cases()}
              error={endpoint === '' || endpoint.indexOf(' ') >= 0 || isURL(endpoint) === false}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  );
}
