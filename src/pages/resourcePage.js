import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import Grow from '@mui/material/Grow';
import { Trans } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ResourceTable from '../components/resource/resourceTypeTable';
import ResourceForm from '../components/resource/resourceForm';
import * as log from 'loglevel';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../components/shared/messages/alerts';
export default function ResourcePage({ token, graphqlErrors, env, tokenData }) {
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

  const [createOpen, setCreateOpen] = React.useState(false);
  const [resources, setResources] = React.useState([]);
  const mainTitle = <Trans>tenant.titles.page</Trans>;

  const getTheResources = () => {
    client
      .query({
        query: gql`
          query getUserResourceType($userID: String!) {
            getUserResourceType(userID: $userID) {
              name
              userID
            }
          }
        `,
        variables: { userID: tokenData.preferred_username }
      })
      .then((data) => {
        setResources(data.data.getUserResourceType);
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  React.useEffect(() => {
    getTheResources();
  }, []);

  return (
    <Box sx={{ marginBottom: 15 }}>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <AddButton
        pageType={
          <ResourceForm
            title="New Resource Type"
            close={setCreateOpen}
            action={'create'}
            token={token}
            tokenData={tokenData}
            env={env}
            getTheResources={getTheResources}
          />
        }
        setOpen={setCreateOpen}
        status={createOpen}
        graphqlErrors={graphqlErrors}
      ></AddButton>
      {resources.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}></Grid>

          <Grow key={1} in={true} style={{ transformOrigin: '0 0 0' }} {...(1 === 1 ? { timeout: 1 * 600 } : {})}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <ResourceTable
                token={token}
                tokenData={tokenData}
                env={env}
                resources={resources}
                getTheResources={getTheResources}
              ></ResourceTable>
            </Grid>
          </Grow>
        </Grid>
      ) : (
        <Typography sx={{ padding: '20px' }} variant="h6" component="h3">
          <Trans>tenant.titles.noData</Trans>
        </Typography>
      )}
    </Box>
  );
}
