import React, { Component } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { MainTitle } from './components/shared/mainTitle'
import SortButton from './components/shared/sortButton'
import Container from '@mui/material/Container';
import DashboardCard from './components/shared/cards'
import Grid from '@mui/material/Grid';
import AddButton from './components/shared/addButton'
import TenantSelection from './components/shared/tenantSelection';
import PolicyFilters from './components/policy/policyFilters';
import PoliciesTable from './components/policy/policiesTable';
import Keycloak from 'keycloak-js'
import { WebSocketLink } from 'apollo-link-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
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
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(12),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);



const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  background: "#8086ba",
  minHeight: "100px",
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    background: "#8086ba",
    minHeight: "100px",
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const CustomToolbar = styled(Toolbar)({
  height: "100px",
  borderRadius: 4,

});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default class App extends Component {

  state = {
    open: false,
    setOpen: (newValue) => {
      this.setState({ open: newValue,direction:(newValue)?"ltr":"" })
    },
    direction:"ltr",
    mainTitle: "Tenant Admin List",
    authenticated: false,
    name: "",
    email: "",
    id: "",
    keycloak : "",
    groups:[],
    login: (keycloak, authenticated) => {
      this.setState({ keycloak: keycloak, authenticated: authenticated })
      this.state.keycloak.loadUserInfo().then(userInfo => {
        this.setState({ name: userInfo.name, email: userInfo.email, id: userInfo.sub });
        keycloak.loadUserInfo().then(userInfo => {
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
      });
    },
  }


  componentDidMount() {
    const keycloak=Keycloak({
      url: 'http://localhost:8080/auth/',
      realm: 'keycloak-connect-graphql',
      clientId: 'myapp'
    })
    keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then(authenticated => {
      this.state.login(keycloak, authenticated)
    });
  }

  handleDrawerOpen = () => {
    this.state.setOpen(true);
  };

  handleDrawerClose = () => {
    this.state.setOpen(false);
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="fixed" open={this.state.open}>
          <CustomToolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(this.state.open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

            </Typography>

            <div>
              < TenantSelection></TenantSelection>
            </div>
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                edge="end"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </CustomToolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={this.state.open}
        >
          <DrawerHeader>
            <IconButton onClick={this.handleDrawerClose}>
              {this.state.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Main open={this.state.open}>
          <DrawerHeader />
          <MainTitle {...this.state}></MainTitle>
          <AddButton></AddButton>
          <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
            <Grid item xs={12}>
              <PolicyFilters></PolicyFilters>
            </Grid>
            <Grid item xs={12}>
              <PoliciesTable></PoliciesTable>
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <DashboardCard></DashboardCard>
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <DashboardCard></DashboardCard>
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <DashboardCard></DashboardCard>
            </Grid>
            <Grid item xs={12} lg={6} xl={4}>
              <DashboardCard></DashboardCard>
            </Grid>
          </Grid>
        </Main>
      </Box>
    );
  }
}
