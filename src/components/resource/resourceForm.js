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

export default function ResourceForm({ title, close, action, token, tokenData, env, getTheResources }) {
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

  const [name, setName] = React.useState('');

  const cases = () => {
    switch (true) {
      case name === '':
        return 'The name is mandatory';
      case name.indexOf(' ') >= 0:
        return 'The name should be without spaces';
      default:
        return false;
    }
  };

  const handleSave = () => {
    if (cases() === false) {
      switch (action) {
        case 'create':
          client
            .mutate({
              mutation: gql`
                mutation newResourceType($name: String!, $userID: String!) {
                  newResourceType(name: $name, userID: $userID) {
                    name
                    userID
                  }
                }
              `,
              variables: { name: name, userID: tokenData.preferred_username }
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
        case 'modify':
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
              id="User ID"
              label="User ID"
              variant="outlined"
              defaultValue={tokenData.preferred_username}
              disabled
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="Resource type name"
              label="Resource type name"
              variant="outlined"
              sx={{
                width: '100%'
              }}
              onChange={(event) => {
                setName(event.target.value);
              }}
              helperText={cases()}
              error={name === '' || name.indexOf(' ') >= 0}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  );
}
