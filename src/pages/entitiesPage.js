import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import * as log from 'loglevel';
import axios from 'axios';
import { Trans } from 'react-i18next';
import useNotification from '../components/shared/messages/alerts';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EntitiesFilters from '../components/entities/entitiesFilter';
import EntitiesTable from '../components/entities/entitiesTable';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import dayjs from 'dayjs';

export default function EntitiesPage({ token, graphqlErrors, env, thisTenant, tenantValues }) {
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
  const [entities, setEntities] = React.useState([]);
  const mainTitle = <Trans>entities.page.title</Trans>;

  //FILTER PART
  const [servicePath, setServicePath] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const filterMapper = {
    servicePath: {
      value: servicePath,
      set: setServicePath
    },
    type: {
      value: type,
      set: setType
    },
    date: {
      value: date,
      set: setDate
    }
  };

  const getTheResourceURL = () => {
    client
      .query({
        query: gql`
          query getTenantResourceType($tenantName: String!) {
            getTenantResourceType(tenantName: $tenantName) {
              name
              userID
              tenantName
              endpointUrl
              ID
            }
          }
        `,
        variables: { tenantName: GeTenantData('name') }
      })
      .then((response) => {
        let filtered = response.data.getTenantResourceType.filter((e) => e.name === 'entity');
        filtered.length > 0
          ? getEntitiesFromResource(filtered[0].endpointUrl.replace('&orderBy=id', '') + 'Created,dateModified,*')
          : getEntitiesFromResource(env.ORION + '/v2/entities?attrs=dateCreated,dateModified,*');
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  // services
  const [services, setServices] = React.useState([]);
  const getServices = () => {
    axios
      .get(
        (typeof env !== 'undefined' ? env.ANUBIS_API_URL : '') + 'v1/tenants/' + GeTenantData('id') + '/service_paths',
        {}
      )
      .then((response) => {
        setServices(response.data);
      });
  };

  //types
  const [types, setTypes] = React.useState([]);
  const getTypes = () => {
    const headers = { 'fiware-Service': GeTenantData('name') };
    axios
      .get(env.ORION + '/v2/types?attrs=type', {
        headers: headers
      })
      .then((response) => {
        setTypes(response.data);
      });
  };
  const GeTenantData = (type) => {
    const tenantArray = tenantValues.filter((e) => e.id === thisTenant);
    if (type === 'name') {
      return tenantArray[0].name;
    } else {
      return tenantArray[0].id;
    }
  };

  const getEntitiesFromResource = (resourceUrl) => {
    const queryParameters =
      (type !== null ? '&type=' + type.type : '') +
      (date !== null ? '&q=dateModified>=' + dayjs(date).toISOString() : '');

    const headers =
      servicePath !== null
        ? {
            'fiware-Service': GeTenantData('name'),
            //'Authorization': `Bearer ${token}`,
            'fiware-ServicePath':
              servicePath.path[servicePath.path.length - 1] === '/' ? servicePath.path + '#' : servicePath.path + '/#'
          }
        : {
            'fiware-Service': GeTenantData('name')
            //'Authorization': `Bearer ${token}`,
          };
    axios
      .get(resourceUrl + queryParameters, {
        headers: headers
      })
      .then((response) => {
        setEntities(response.data);
        getServices();
        getTypes();
      })
      .catch((e) => {
        sendNotification({ msg: e.message, variant: 'error' });
      });
  };

  React.useEffect(() => {
    thisTenant !== null ? getTheResourceURL() : '';
  }, [thisTenant, servicePath, type, date]);

  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box sx={{ marginBottom: 15 }}>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <AddButton
        pageType={<div></div>}
        setOpen={setCreateOpen}
        status={createOpen}
        graphqlErrors={graphqlErrors}
      ></AddButton>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={
            smallDevice ? { width: document.getElementById('filterContainer').clientWidth, 'overflow-x': 'scroll' } : ''
          }
        >
          <EntitiesFilters services={services} data={entities} mapper={filterMapper} types={types} />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <EntitiesTable token={token} env={env} data={entities}></EntitiesTable>
        </Grid>
      </Grid>
    </Box>
  );
}
