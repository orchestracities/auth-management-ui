import * as React from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useTranslation, Trans } from 'react-i18next';
import { ApolloClient, ApolloLink, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import useNotification from './messages/alerts';
import * as log from 'loglevel';
import { useOidc } from '@axa-fr/react-oidc';

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function UserMenu({ language, userData, token, lastTenantSelected, env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);

  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [settings, setOpenSettings] = React.useState(false);
  const [msg, sendNotification] = useNotification();

  log.debug(msg);

  const { logout } = useOidc();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const settingsOpen = () => {
    setOpenSettings(true);
  };

  const settingsClose = () => {
    setOpenSettings(false);
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  React.useEffect(() => {
    i18n.changeLanguage(language.language);
  }, [language]);

  const handleLanguagePreference = (newValue) => {
    language.setLanguage(newValue);
    newValue === 'defaultBrowser'
      ? i18n.changeLanguage(Intl.NumberFormat().resolvedOptions().locale)
      : i18n.changeLanguage(newValue);
    const httpLink = ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.map(({ message, locations, path }) => {
            sendNotification({
              msg: `GraphQLError: ${message}, Location: ${locations}, Path: ${path}`,
              variant: 'error'
            });
          });
        if (networkError) {
          sendNotification({ msg: `NetworkError: cannot reach configuration api"`, variant: 'error' });
        }
      }),
      createHttpLink({ uri: env.CONFIGURATION_API_URL })
    ]);

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
    if (lastTenantSelected !== null) {
      client
        .mutate({
          mutation: gql`
            mutation modifyUserPreferences($userName: String!, $language: String!, $lastTenantSelected: String) {
              modifyUserPreferences(userName: $userName, language: $language, lastTenantSelected: $lastTenantSelected) {
                userName
                language
                lastTenantSelected
              }
            }
          `,
          variables: {
            userName: userData.sub,
            language: newValue,
            lastTenantSelected: lastTenantSelected
          }
        })
        .then((result) => {
          log.debug(result);
          sendNotification({
            msg: (
              <Trans
                i18nKey="common.messages.sucessUpdate"
                values={{
                  data: 'User Preference'
                }}
              />
            ),
            variant: 'success'
          });
        });
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            color="inherit"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <AccountCircle />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 10,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => openInNewTab(env.OIDC_ISSUER + '/account/')}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          {userData && userData.name ? userData.name : ''}
        </MenuItem>
        <Divider />
        <MenuItem onClick={settingsOpen}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Trans>common.userSettings.title</Trans>
        </MenuItem>
        <MenuItem onClick={() => logout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <DialogRounded
        open={settings}
        fullWidth={true}
        maxWidth={'md'}
        onClose={settingsClose}
        aria-labelledby="alert-dialog-titlel"
        aria-describedby="alert-dialog-descriptionl"
      >
        <CustomDialogTitle>
          <Toolbar>
            <IconButton edge="start" onClick={settingsClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
              <Trans>common.userSettings.title</Trans>
            </Typography>
          </Toolbar>
        </CustomDialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="language">
                  {' '}
                  <Trans>common.userSettings.language</Trans>
                </InputLabel>
                <Select
                  labelId="language"
                  id="language-select"
                  variant="outlined"
                  onChange={(event) => {
                    handleLanguagePreference(event.target.value);
                  }}
                  value={language.language === '' ? 'defaultBrowser' : language.language}
                  label={<Trans>common.userSettings.language</Trans>}
                >
                  <MenuItem value={'defaultBrowser'}>Default</MenuItem>
                  <MenuItem value={'en'}>English</MenuItem>
                  <MenuItem value={'it'}>Italian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
    </React.Fragment>
  );
}
