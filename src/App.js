import React, { Component } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import TenantSelection from './components/shared/tenantSelection';
import axios from 'axios';
import { ApolloClient, InMemoryCache, from, gql, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { SnackbarProvider } from 'notistack';
import TenantPage from './pages/tenantPage';
import ServicePage from './pages/servicePage';
import PolicyPage from './pages/policyPage';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import UserMenu from './components/shared/userMenu';
import Alert from '@mui/material/Alert';
import { getEnv } from './env';
import Container from '@mui/material/Container';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Grid } from '@mui/material';
import { Trans } from 'react-i18next';

const env = getEnv();

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  flexGrow: 1,
  marginTop: theme.spacing(12),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  minHeight: '100px',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    minHeight: '100px',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const CustomToolbar = styled(Toolbar)({
  height: '100px',
  borderRadius: 4
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

export default class App extends Component {
  state = {
    openLateralMenu: false,
    setOpenLateralMenu: (newValue) => {
      this.setState({ openLateralMenu: newValue, direction: newValue ? 'ltr' : '' });
    },
    direction: 'ltr',
    tokenData: [],
    groups: [],
    language: '',
    setAppLanguage: (newLanguagePreference) => {
      this.setState({ language: newLanguagePreference });
      if (this.state.connectionIssue !== false) {
        this.state.getTenants();
      }
    },
    catchColor: (newID) => {
      const data = this.state.tenants.filter((e) => e.id === newID);
      if (data.length > 0) {
        this.setState(
          {
            tenantColor: createTheme({
              palette: {
                primary: {
                  // light: will be calculated from palette.primary.main,
                  main: data[0].props.primaryColor
                  // dark: will be calculated from palette.primary.main,
                },
                secondary: {
                  // light: will be calculated from palette.primary.main,
                  main: data[0].props.secondaryColor
                  // dark: will be calculated from palette.primary.main,
                }
              }
            })
          },
          () => {}
        );
      }
    },
    tenantColor: createTheme({
      palette: {
        primary: {
          main: '#8086ba'
        },
        secondary: {
          main: '#4c61a9'
        },
        contrastThreshold: 3,
        tonalOffset: 0.2
      }
    }),
    tenants: [],
    thisTenant: '',
    seTenant: (newValue) => {
      this.setState({ thisTenant: newValue });
      this.state.catchColor(newValue);
    },
    preferencesMapper: (data, userTenants) => {
      if (data.length > 0) {
        data.map((thisData, i) => {
          const index = userTenants
            .map(function (e) {
              return e.name;
            })
            .indexOf(thisData.name);
          userTenants[index].props = thisData;
          return i;
        });
        return userTenants;
      } else {
        userTenants.map(
          (tenant) =>
            (tenant.props = {
              name: tenant.name,
              icon: 'none',
              primaryColor: '#8086ba',
              secondaryColor: '#8086ba'
            })
        );
        this.setState({
          tenants: userTenants
        });
      }
    },
    connectionIssue: false,
    recall: null,
    getNetworkError: (thisError, type) => {
      const style = {
        position: 'fixed',
        bottom: '0px',
        width: '100%',
        padding: '3px 3px',
        fontSize: '0.63rem',
        zIndex: 1201
      };
      if (thisError !== '') {
        type === 'error' ? this.setState({ recall: setInterval(() => this.state.getTenants(), 10000) }) : '';
        this.setState({
          connectionIssue: (
            <Alert variant="filled" severity={type} sx={style} icon={false}>
              {thisError}
            </Alert>
          )
        });
      } else {
        this.setState({
          connectionIssue: (
            <Alert variant="filled" severity="info" sx={style} icon={false}>
              Online
            </Alert>
          )
        });
        setTimeout(function () {
          location.reload();
        }, 2300);
      }
    },
    getTenants: () => {
      axios
        .get(env.ANUBIS_API_URL + 'v1/tenants')
        .then((response) => {
          const userTenants = [];
          let tenantFiltered = [];
          const tenantFilteredNames = [];
          this.state.tokenData.tenants.map((thisTenant, index) => {
            tenantFiltered = response.data.filter((e) => e.name === thisTenant.name);
            tenantFiltered.length > 0 ? userTenants.push(tenantFiltered[0]) : (tenantFiltered = []);
            return index;
          });
          userTenants.map((thisTenant, index) => {
            tenantFilteredNames.push(thisTenant.name.toString());
            return index;
          });
          const httpLink = createHttpLink({
            uri: env.CONFIGURATION_API_URL
          });

          const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
            if (graphQLErrors)
              graphQLErrors.forEach(({ message }) => operation.variables.state.getNetworkError(message));
            if (networkError) {
              operation.variables.state.getNetworkError(<Trans>common.messages.graphqlOff</Trans>, 'warning');
              operation.variables.state.preferencesMapper([], userTenants);
              operation.variables.state.seTenant(operation.variables.state.thisTenant);
            }
          });

          const authLink = setContext((_, { headers }) => {
            // get the authentication token from local storage if it exists
            // return the headers to the context so httpLink can read them
            return {
              headers: {
                ...headers,
                authorization: `Bearer ${this.props.accessToken}`
              }
            };
          });

          const client = new ApolloClient({
            link: from([errorLink, authLink.concat(httpLink)]),
            cache: new InMemoryCache()
          });

          client
            .query({
              query: gql`
                query listTenants($tenantNames: [String]!) {
                  listTenants(tenantNames: $tenantNames) {
                    name
                    icon
                    primaryColor
                    secondaryColor
                  }
                }
              `,
              variables: {
                tenantNames: tenantFilteredNames,
                state: this.state
              }
            })
            .then((result) => {
              if (this.state.connectionIssue) {
                this.state.getNetworkError('');
              }
              client
                .query({
                  query: gql`
                    query getUserPreferences($userName: String!) {
                      getUserPreferences(userName: $userName) {
                        userName
                        language
                      }
                    }
                  `,
                  variables: {
                    userName: this.props.idTokenPayload.sub,
                    state: this.state
                  }
                })
                .then((result) => {
                  this.state.setAppLanguage(result.data.getUserPreferences[0].language);
                });
              this.setState({
                tenants: this.state.preferencesMapper(result.data.listTenants, userTenants)
              });
              this.state.seTenant(this.state.thisTenant);
            });
        })
        .catch((e) => {
          if (e.message === 'Network Error') {
            this.state.getNetworkError(e.message, 'error');
          }
        });
    },
    afterLogin: (authenticated) => {
      if (authenticated) {
        const decoded = jwt_decode(this.props.accessToken);
        this.setState({ tokenData: decoded });
        this.state.getTenants();
      }
    }
  };
  constructor(props) {
    super(props);
  }
  links = [
    { name: 'Tenant', route: '/Tenant', icon: <InboxIcon></InboxIcon> },
    { name: 'Service', route: '/Service', icon: <InboxIcon></InboxIcon> },
    { name: 'Policy', route: '/Policy', icon: <InboxIcon></InboxIcon> }
  ];

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.login();
    } else {
      this.state.afterLogin(this.props.isAuthenticated);
    }
  }

  handleDrawerOpen = () => {
    this.state.setOpenLateralMenu(true);
  };

  handleDrawerClose = () => {
    this.state.setOpenLateralMenu(false);
  };

  toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    this.setState({ open: open });
  };

  render() {
    return (
      <SnackbarProvider maxSnack={5} sx={{ zIndex: 90000 }}>
        <ThemeProvider theme={this.state.tenantColor}>
          <Box sx={{ display: 'flex' }}>
            <BrowserRouter>
              <CssBaseline />
              <AppBar position="fixed" open={this.state.openLateralMenu}>
                <CustomToolbar color="primary">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(this.state.openLateralMenu && { display: 'none' }) }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                  <div>
                    <TenantSelection
                      seTenant={this.state.seTenant}
                      tenantValues={this.state.tenants}
                      correntValue={this.state.thisTenant}
                    ></TenantSelection>
                  </div>
                  <div>
                    <UserMenu
                      token={this.props.accessToken}
                      language={{
                        language: this.state.language,
                        setLanguage: this.state.setAppLanguage
                      }}
                      userData={this.props.idTokenPayload}
                    ></UserMenu>
                  </div>
                </CustomToolbar>
              </AppBar>
              <SwipeableDrawer
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box'
                  }
                }}
                variant="persistent"
                open={this.state.openLateralMenu}
                onClose={this.toggleDrawer(false)}
                anchor={'left'}
                onOpen={this.toggleDrawer(true)}
              >
                <DrawerHeader>
                  <IconButton onClick={this.handleDrawerClose}>
                    {this.state.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                  </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                  {this.links.map((thisItem, index) => (
                    <NavLink to={thisItem.route} key={index}>
                      <ListItem button key={thisItem.name}>
                        <ListItemIcon>{thisItem.icon}</ListItemIcon>
                        <ListItemText primary={thisItem.name} />
                      </ListItem>
                    </NavLink>
                  ))}
                </List>
                <Divider />
              </SwipeableDrawer>
              {this.props.isAuthenticated ? (
                <Main open={this.state.open}>
                  <Container maxWidth="xl">
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} id="filterContainer"></Grid>
                  </Container>
                  <Container maxWidth="xl">
                    <Routes>
                      <Route
                        path="Tenant"
                        element={
                          <TenantPage
                            token={this.props.accessToken}
                            getTenants={this.state.getTenants}
                            tenantValues={this.state.tenants}
                            seTenant={this.state.seTenant}
                            graphqlErrors={this.state.connectionIssue}
                          />
                        }
                      />
                      <Route
                        path="Service"
                        element={
                          <ServicePage
                            getTenants={this.state.getTenants}
                            tenantValues={this.state.tenants}
                            thisTenant={this.state.thisTenant}
                            graphqlErrors={this.state.connectionIssue}
                          />
                        }
                      />
                      <Route
                        path="Policy"
                        element={
                          <PolicyPage
                            getTenants={this.state.getTenants}
                            tenantValues={this.state.tenants}
                            thisTenant={this.state.thisTenant}
                            graphqlErrors={this.state.connectionIssue}
                          />
                        }
                      />
                    </Routes>
                  </Container>
                </Main>
              ) : (
                <Main open={this.state.openLateralMenu} />
              )}
              <DrawerHeader />
            </BrowserRouter>
            {this.state.connectionIssue}
          </Box>
        </ThemeProvider>
      </SnackbarProvider>
    );
  }
}
