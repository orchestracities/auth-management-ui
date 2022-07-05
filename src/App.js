import React, { Component } from 'react'
import {
  styled,
  createTheme,
  ThemeProvider
} from '@mui/material/styles'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import Grid from '@mui/material/Grid'
import TenantSelection from './components/shared/tenantSelection'
import axios from 'axios'
import {
  ApolloClient,
  InMemoryCache,
  from,
  gql,
  createHttpLink
} from '@apollo/client'
import { onError } from "@apollo/client/link/error";
import { setContext } from '@apollo/client/link/context';
import { SnackbarProvider } from 'notistack';
import TenantPage from './pages/tenantPage'
import ServicePage from './pages/servicePage'
import PolicyPage from './pages/policyPage'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import UserMenu from './components/shared/userMenu'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const drawerWidth = 240

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(12),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
)

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
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const CustomToolbar = styled(Toolbar)({
  height: '100px',
  borderRadius: 4
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}))

export default class App extends Component {
  state = {
    open: false,
    setOpen: (newValue) => {
      this.setState({ open: newValue, direction: newValue ? 'ltr' : '' })
    },
    direction: 'ltr',
    tokenData: [],
    groups: [],
    language: '',
    setAppLanguage: (newLanguagePreference) => {
      this.setState({ language: newLanguagePreference })
    },
    catchColor: (newID) => {
      const data = this.state.tenants.filter((e) => e.id === newID)
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
          () => { }
        )
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
      this.setState({ thisTenant: newValue })
      this.state.catchColor(newValue)
    },
    preferencesMapper: (data, userTenants) => {
      data.map((thisData, i) => {
        const index = userTenants
          .map(function (e) {
            return e.name
          })
          .indexOf(thisData.name)
        userTenants[index].props = thisData
        return i
      })
      return userTenants
    },
    connectionIssue:"",
    getNetworkError:(thisError)=>{
      this.setState({ connectionIssue:
      <Snackbar open={true} sx={{width:"100%",left:"0px !important",right:"0px !important",bottom:"0px !important"}}>
      <Alert variant="filled" severity="error"  sx={{width:"100%",left:"0px",right:"0px",bottom:"0px"}}>
      {thisError}
      </Alert>
  </Snackbar>
  })
  
    },
    getTenants: () => {
      axios
        .get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/tenants')
        .then((response) => {
          const userTenants = []
          let tenantFiltered = []
          const tenantFilteredNames = []
          this.state.tokenData.tenants.map((thisTenant, index) => {
            tenantFiltered = response.data.filter(
              (e) => e.name === thisTenant.name
            )
            tenantFiltered.length > 0
              ? userTenants.push(tenantFiltered[0])
              : (tenantFiltered = [])
            return index
          })
          userTenants.map((thisTenant, index) => {
            tenantFilteredNames.push(thisTenant.name.toString())
            return index
          })
          const httpLink = createHttpLink({
            uri: process.env.REACT_APP_CONFIGURATION_API_URL
          })
         
          const errorLink = onError(({ graphQLErrors, networkError,operation }) => {
            if (graphQLErrors)
              graphQLErrors.forEach(({ message}) =>
                operation.variables.state.getNetworkError(message)
              );
            if (networkError) {
              operation.variables.state.getNetworkError("Network error: "+networkError.message)
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
            }
          });

          const client = new ApolloClient({
            link: from([
              errorLink, authLink.concat(httpLink)
            ]),
            cache: new InMemoryCache(),
          })

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
                state:this.state
              }
            })
            .then((result) => {
              client
                .query({
                  query: gql`
                    query getUserPreferences($usrName: String!) {
                      getUserPreferences(usrName: $usrName) {
                        usrName
                        language
                      }
                    }
                  `,
                  variables: {
                    usrName: this.props.idTokenPayload.sub,
                    state:this.state
                  }
                })
                .then((result) => {
                  this.state.setAppLanguage(
                    result.data.getUserPreferences[0].language
                  )
                })
              this.setState({
                tenants: this.state.preferencesMapper(
                  result.data.listTenants,
                  userTenants
                )
              })
              this.state.seTenant(this.state.thisTenant)
            })
        })
    },
    afterLogin: (authenticated) => {
      if (authenticated) {
        const decoded = jwt_decode(this.props.accessToken)
        this.setState({ tokenData: decoded })
        this.state.getTenants()
      }

    }
  }
  constructor(props) {
    super(props);
  }
  links = [
    { name: 'Tenant', route: '/Tenant', icon: <InboxIcon></InboxIcon> },
    { name: 'Service', route: '/Service', icon: <InboxIcon></InboxIcon> },
    { name: 'Policy', route: '/Policy', icon: <InboxIcon></InboxIcon> }
  ]

  componentDidMount() {
    if (!this.props.isAuthenticated) {
      this.props.login();
    } else {
      this.state.afterLogin(this.props.isAuthenticated)
    }
  }

  handleDrawerOpen = () => {
    this.state.setOpen(true)
  }

  handleDrawerClose = () => {
    this.state.setOpen(false)
  }

  render() {
    return (
      <SnackbarProvider maxSnack={5}>
        <ThemeProvider theme={this.state.tenantColor}>
          <Box sx={{ display: 'flex' }}>
            <BrowserRouter>
              <CssBaseline />
              <AppBar position="fixed" open={this.state.open}>
                <CustomToolbar color="primary">
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={this.handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(this.state.open && { display: 'none' }) }}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
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
              <Drawer
                sx={{
                  width: drawerWidth,
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box'
                  }
                }}
                variant="persistent"
                anchor="left"
                open={this.state.open}
              >
                <DrawerHeader>
                  <IconButton onClick={this.handleDrawerClose}>
                    {this.state.direction === 'ltr'
                      ? (
                        <ChevronLeftIcon />
                      )
                      : (
                        <ChevronRightIcon />
                      )}
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
              </Drawer>
              {this.state.connectionIssue}
                {this.props.isAuthenticated && !this.state.connectionIssue
                ? (
                  <Main open={this.state.open}>
                    <Grid container id="filterContainer"></Grid>
                    <Routes>
                      <Route
                        path="Tenant"
                        element={
                          <TenantPage
                            token={this.props.accessToken}
                            getTenants={this.state.getTenants}
                            tenantValues={this.state.tenants}
                            seTenant={this.state.seTenant}
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
                          />
                        }
                      />
                    </Routes>
                  </Main>
                )
                : (
                  <Main open={this.state.open} />
                )}
              <DrawerHeader />
            </BrowserRouter>
          </Box>
        </ThemeProvider>
      </SnackbarProvider>
    )
  }
}
