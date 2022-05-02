import React, { Component } from 'react'
import { styled, useTheme, createTheme, ThemeProvider } from '@mui/material/styles'
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
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import { MainTitle } from './components/shared/mainTitle'
import SortButton from './components/shared/sortButton'
import Container from '@mui/material/Container'
import DashboardCard from './components/shared/cards'
import Grid from '@mui/material/Grid'
import AddButton from './components/shared/addButton'
import TenantSelection from './components/shared/tenantSelection'
import PolicyFilters from './components/policy/policyFilters'
import PoliciesTable from './components/policy/policiesTable'
import Keycloak from 'keycloak-js'
import { WebSocketLink } from 'apollo-link-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import axios from 'axios'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import TenantPage from './pages/tenantPage'
import ServicePage from './pages/servicePage'
import PolicyPage from './pages/policyPage'
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom"
import { ThirtyFpsOutlined } from '@mui/icons-material'
import jwt_decode from "jwt-decode"
import { createTheme, ThemeProvider } from '@mui/material/styles'
import UserMenu from './components/shared/userMenu'

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
      this.setState({ open: newValue, direction: (newValue) ? 'ltr' : '' })
    },
    direction: 'ltr',
    authenticated: false,
    tokenData: [],
    keycloak: '',
    groups: [],
    language: "",
    setAppLanguage: (newLanguagePreference) => {
      this.setState({ language: newLanguagePreference });
    },
    catchColor: (newID) => {
      const data = this.state.tenants.filter((e) => e.id === newID)
      if (data.length > 0) {
        this.setState({
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
        }, () => {
        })
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
        const index = userTenants.map(function (e) {
          return e.name
        }).indexOf(thisData.name)
        userTenants[index].props = thisData
      })
      return userTenants
    },
    getTenants: () => {
      axios.get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/tenants')
        .then((response) => {
          const userTenants = []
          let tenantFiltered = []
          const tenantFilteredNames = []
          this.state.tokenData.tenants.map((thisTenant, index) => {
            tenantFiltered = response.data.filter((e) => e.name === thisTenant.name)
            tenantFiltered.length > 0 ? userTenants.push(tenantFiltered[0]) : tenantFiltered = []
          })
          userTenants.map((thisTenant, index) => {
            tenantFilteredNames.push(thisTenant.name.toString())
          })
          const httpLink = createHttpLink({
            uri: 'http://localhost:4000/graphql'
          })

          const authLink = setContext((_, { headers }) => {
            return {
              headers: {
                ...headers,
                Authorization: `Bearer ${this.state.keycloak.token}`
              }
            }
          })

          const client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache()
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
                tenantNames: tenantFilteredNames
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
                    usrName: this.state.keycloak.idTokenParsed.sub
                  }
                })
                .then((result) => {
                  this.state.setAppLanguage(result.data.getUserPreferences[0].language);
                });
              this.setState({ tenants: this.state.preferencesMapper(result.data.listTenants, userTenants) });
              this.state.seTenant(this.state.thisTenant);
            });
        })
        .catch((e) => {
          console.error(e)
        })
    },
    login: (keycloak, authenticated) => {
      this.setState({ keycloak, authenticated })
      this.state.keycloak.loadUserInfo().then(userInfo => {
        keycloak.loadUserInfo().then(userInfo => {
          const decoded = jwt_decode(keycloak.token)
          this.setState({ tokenData: decoded })
          const wsLink = new GraphQLWsLink(createClient({
            url: 'ws://localhost:4000/graphql',
            options: {
              reconnect: true
            }
          }))

          this.state.getTenants()
        })
      })
    }
  }

  links = [{ name: 'Tenant', route: '/Tenant', icon: <InboxIcon></InboxIcon> },
    { name: 'Service', route: '/Service', icon: <InboxIcon></InboxIcon> },
    { name: 'Policy', route: '/Policy', icon: <InboxIcon></InboxIcon> }
  ]

  componentDidMount () {
    const keycloak = Keycloak({
      url: 'http://localhost:8080/auth/',
      realm: 'master',
      clientId: 'client1'
    })
    keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then(authenticated => {
      this.state.login(keycloak, authenticated)
    })
  }

  handleDrawerOpen = () => {
    this.state.setOpen(true)
  }

  handleDrawerClose = () => {
    this.state.setOpen(false)
  }

  constructor (props) {
    super(props)
  }

  render () {
    return (
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
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                </Typography>
                <div>
                  < TenantSelection seTenant={this.state.seTenant} tenantValues={this.state.tenants} correntValue={this.state.thisTenant}></TenantSelection>
                </div>
                <div>
                  <UserMenu keycloakToken={this.state.keycloak.token} language={{language:this.state.language,setLanguage:this.state.setAppLanguage}} userData={this.state.keycloak}></UserMenu>
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
                  {this.state.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </DrawerHeader>
              <Divider />
              <List>
                {this.links.map((thisItem, index) => (
                  <NavLink to={thisItem.route}>
                    <ListItem button key={thisItem.name}>
                      <ListItemIcon>
                        {thisItem.icon}
                      </ListItemIcon>
                      <ListItemText primary={thisItem.name} />
                    </ListItem>
                  </NavLink>
                ))}
              </List>
              <Divider />
            </Drawer>
            {(this.state.authenticated)
              ? <Main open={this.state.open}><Routes>
              <Route path="Tenant" element={<TenantPage keycloakToken={this.state.keycloak.token} getTenants={this.state.getTenants} tenantValues={this.state.tenants} seTenant={this.state.seTenant} />} />
              <Route path="Service" element={<ServicePage getTenants={this.state.getTenants} tenantValues={this.state.tenants} thisTenant={this.state.thisTenant} />} />
              <Route path="Policy" element={<PolicyPage getTenants={this.state.getTenants} tenantValues={this.state.tenants} thisTenant={this.state.thisTenant} />} />
            </Routes></Main>
              : <Main open={this.state.open} />}
            <DrawerHeader />
          </BrowserRouter>

        </Box>
      </ThemeProvider>
    )
  }
}
