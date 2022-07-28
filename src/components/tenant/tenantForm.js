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
import ColorPicker from './colorPicker';
import IconPicker from './iconPicker';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Trans } from 'react-i18next';
import useNotification from '../shared/messages/alerts';
import { getEnv } from '../../env';
import Box from '@mui/material/Box';

const env = getEnv();

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function TenantForm({ title, close, action, tenant, getTenants, token }) {
  const [msg, sendNotification] = useNotification();
  console.log(msg);

  const [name, setName] = React.useState(action === 'modify' ? tenant.name : ' ');
  const [primaryColor, setPrimaryColor] = React.useState(action === 'modify' ? tenant.props.primaryColor : null);
  const [secondaryColor, setSecondaryColor] = React.useState(action === 'modify' ? tenant.props.secondaryColor : null);
  const [iconName, setIconName] = React.useState(action === 'modify' ? tenant.props.icon : null);

  const handleClose = () => {
    close(false);
  };
  const httpLink = createHttpLink({
    uri: env.CONFIGURATION_API_URL
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
  const handleSave = () => {
    switch (action) {
      case 'create':
        axios
          .post(env.ANUBIS_API_URL + 'v1/tenants', {
            name
          })
          .then(() => {
            close(false);
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessCreate"
                  values={{
                    data: 'Tenant'
                  }}
                />
              ),
              variant: 'success'
            });
            getTenants();
          })
          .catch((e) => {
            getTenants();
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          });

        break;
      case 'modify':
        client
          .mutate({
            mutation: gql`
              mutation modifyTenantsConfig(
                $name: String!
                $icon: String!
                $primaryColor: String!
                $secondaryColor: String!
              ) {
                modifyTenantsConfig(
                  name: $name
                  icon: $icon
                  primaryColor: $primaryColor
                  secondaryColor: $secondaryColor
                ) {
                  name
                  icon
                  primaryColor
                  secondaryColor
                }
              }
            `,
            variables: {
              name,
              icon: iconName,
              primaryColor: primaryColor.toString(),
              secondaryColor: secondaryColor.toString()
            }
          })
          .then(() => {
            close(false);
            getTenants();
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessUpdate"
                  values={{
                    data: name
                  }}
                />
              ),
              variant: 'success'
            });
          })
          .catch((e) => {
            getTenants();
            close(false);
            sendNotification({ msg: e.message + ' the config', variant: 'error' });
          });
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            <Trans>common.saveButton</Trans>
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '740px' }}>
        <Grid container spacing={3}>
          {action === 'modify' ? (
            ''
          ) : (
            <Grid item xs={12}>
              <TextField
                id="Name"
                label={<Trans>tenant.form.name</Trans>}
                variant="outlined"
                defaultValue={action === 'modify' ? tenant.name : ''}
                sx={{
                  width: '100%'
                }}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                helperText={name === '' ? 'the name is mandatory' : ''}
                error={name === ''}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              id="Description"
              label={<Trans>tenant.form.description</Trans>}
              variant="outlined"
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item lg={12} md={12} xs={12} container direction="column" justifyContent="center" alignItems="center">
            <IconPicker previusValue={iconName} setValue={setIconName} mode={action}></IconPicker>
          </Grid>
          <Grid item lg={6} md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
            <ColorPicker
              defaultValue={primaryColor}
              setColor={setPrimaryColor}
              mode={action}
              text={<Trans>tenant.form.primaryColor</Trans>}
            ></ColorPicker>
          </Grid>
          <Grid item lg={6} md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
            <ColorPicker
              defaultValue={secondaryColor}
              setColor={setSecondaryColor}
              mode={action}
              text={<Trans>tenant.form.secondaryColor</Trans>}
            ></ColorPicker>
          </Grid>
        </Grid>
      </DialogContent>
    </Box>
  );
}
