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

  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' +
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
      '((\\d{1,3}\\.){3}\\d{1,3}))' +
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
      '(\\?[;&a-z\\d%_.~+=-]*)?' +
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  const [endpoint, setEndpoint] = React.useState(data[0].name);

  const cases = () => {
    switch (true) {
      case endpoint === '':
        return 'The url is mandatory';
      case endpoint.indexOf(' ') >= 0:
        return 'The url should be without spaces';
      case urlPattern.test(endpoint) === false:
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
                mutation updateThisEndpoint($nameAndID: String!, $name: String!, $resourceTypeName: String!) {
                  updateThisEndpoint(nameAndID: $nameAndID, name: $name, resourceTypeName: $resourceTypeName) {
                    name
                    resourceTypeName
                    nameAndID
                  }
                }
              `,
              variables: { nameAndID: data[0].nameAndID, name: endpoint, resourceTypeName: data[0].resourceTypeName }
            })
            .then(() => {
              close(false);
              getTheResources();
              sendNotification({
                msg: (
                  <Trans
                    i18nKey="common.messages.sucessCreate"
                    values={{
                      data: 'new Resource Type called: ' + name
                    }}
                  />
                ),
                variant: 'success'
              });
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
              label={<Trans>resourceType.form.ResourceName</Trans>}
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
              helperText={cases()}
              error={endpoint === '' || endpoint.indexOf(' ') >= 0 || urlPattern.test(endpoint) === false}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  );
}
