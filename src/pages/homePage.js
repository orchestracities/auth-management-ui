import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import { Trans } from 'react-i18next';
import * as log from 'loglevel';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { AuthorizedElement } from '../loginComponents/checkRoles';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { menu } from '../menu';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const HomePageItem = ({ item, tokenData, tenantValues, thisTenant, color }) => {
  return (
    <LevelZero item={item} tokenData={tokenData} tenantValues={tenantValues} thisTenant={thisTenant} color={color} />
  );
};

const LevelOne = ({ item, tokenData, tenantValues, thisTenant }) => {
  const { t } = useTranslation();
  return (
    <AuthorizedElement
      tokenDecoded={tokenData}
      tenantValues={tenantValues}
      thisTenant={thisTenant}
      roleNeeded={item.withRole}
      iSuperAdmin={item.withSuperAdmin}
    >
      <NavLink to={item.route}>
        <ListItem button>
          <ListItemText primary={t(item.title)} />
        </ListItem>
      </NavLink>
    </AuthorizedElement>
  );
};

const LevelZero = ({ item, tokenData, tenantValues, thisTenant, color }) => {
  const { t } = useTranslation();
  const { items: children } = item;

  return (
    <AuthorizedElement
      tokenDecoded={tokenData}
      tenantValues={tenantValues}
      thisTenant={thisTenant}
      roleNeeded={item.withRole}
      iSuperAdmin={item.withSuperAdmin}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <CardHeader avatar={<Avatar sx={{ bgcolor: color }}>{item.icon}</Avatar>} title={t(item.title)} />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {t(item.description)}
          </Typography>
          <List component="div" disablePadding>
            {children.map((child, key) => (
              <LevelOne key={key} item={child} tokenData={tokenData} />
            ))}
          </List>
        </CardContent>
      </Card>
    </AuthorizedElement>
  );
};

export default function HomePage({ tokenData, thisTenant, tenantValues, env, userData,language,token }) {
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
    cache: new InMemoryCache(
     { addTypename: false}
    )
  });
  const [mainTitle, setMainTitle] = React.useState("");
  const tenantFiltered = tenantValues.filter((e) => e.id === thisTenant);
  const tenantData = tenantFiltered[0];
  const color = tenantData && tenantData.props && tenantData.props.primaryColor ? tenantData.props.primaryColor : '';
  React.useEffect(() => {
    client
                .query({
                  query: gql`
                    query getUserPreferences($userName: String!) {
                      getUserPreferences(userName: $userName) {
                        userName
                        language
                        lastTenantSelected
                        welcomeText {
                          language
                          text
                        }
                      }
                    }
                  `,
                  variables: {
                    userName: userData.sub,
                  }
                })
                .then((result) => {
                  console.log(result.data.getUserPreferences[0].language)
                  let filtered = [];
                  filtered = result.data.getUserPreferences[0].welcomeText.filter((e) => e.language === result.data.getUserPreferences[0].language);
                 setMainTitle(filtered[0].text)
                });
  }, [language]);
  return (
    <Box>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <Grid container spacing={2}>
        {menu.map((item, key) => {
          return item.title !== 'menu.home.title' ? (
            <Grow
              key={key}
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(key === key ? { timeout: key * 600 } : {})}
            >
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <HomePageItem
                  key={key}
                  item={item}
                  tokenData={tokenData}
                  tenantValues={tenantValues}
                  thisTenant={thisTenant}
                  color={color}
                />
              </Grid>
            </Grow>
          ) : (
            ''
          );
        })}
      </Grid>
    </Box>
  );
}
