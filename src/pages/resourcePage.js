import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ResourceTable from '../components/resource/resourceTypeTable';
import ResourceForm from '../components/resource/resourceForm';
import * as log from 'loglevel';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../components/shared/messages/alerts';
import { Trans } from 'react-i18next';
import * as tableApi from '../componentsApi/tableApi';

export default function ResourcePage({ token, graphqlErrors, env, tokenData, thisTenant, tenantValues }) {
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

  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [resources, setResources] = React.useState([]);
  const mainTitle = <Trans>resourceType.page.title</Trans>;

  const GeTenantData = (type) => {
    const tenantArray = tenantValues.filter((e) => e.id === thisTenant);
    if (type === 'name') {
      return tenantArray[0].name;
    } else {
      return tenantArray[0].id;
    }
  };
  //TABLE PART
  const [page, setPage] = React.useState(0);
  const [resourceTypeLength, setResourceTypeLength] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(tableApi.getRowsPerPage(env));
  const pageMaxNumber = tableApi.getTableMax(env);
  React.useEffect(() => {
    thisTenant !== null ? getTheResources() : '';
  }, [page, rowsPerPage]);

  const getTheResources = () => {
    client
      .query({
        query: gql`
          query getTenantResourceType($tenantName: String!, $skip: Int!, $limit: Int!) {
            getTenantResourceType(tenantName: $tenantName, skip: $skip, limit: $limit) {
              data {
                name
                userID
                tenantName
                endpointUrl
                ID
              }
              count
            }
          }
        `,
        variables: {
          tenantName: GeTenantData('name'),
          skip: page * (rowsPerPage === pageMaxNumber ? pageMaxNumber : rowsPerPage),
          limit: rowsPerPage
        }
      })
      .then((data) => {
        setResources(data.data.getTenantResourceType.data);
        setResourceTypeLength(data.data.getTenantResourceType.count);
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  React.useEffect(() => {
    thisTenant !== null ? getTheResources() : '';
  }, [thisTenant]);

  return (
    <Box>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <AddButton
        pageType={
          <ResourceForm
            title="New Resource Type"
            close={setCreateOpen}
            action={'create'}
            GeTenantData={GeTenantData}
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

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <ResourceTable
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              resourceTypeLength={resourceTypeLength}
              token={token}
              tokenData={tokenData}
              env={env}
              GeTenantData={GeTenantData}
              resources={resources}
              getTheResources={getTheResources}
            ></ResourceTable>
          </Grid>
        </Grid>
      ) : (
        <Typography sx={{ padding: '20px' }} variant="h6" component="h3">
          no data
        </Typography>
      )}
    </Box>
  );
}
