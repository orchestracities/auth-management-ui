import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import AlarmCard from '../components/alarms/alarmCard';
import useMediaQuery from '@mui/material/useMediaQuery';
import axios from 'axios';
import Grow from '@mui/material/Grow';
import { Trans } from 'react-i18next';
import useNotification from '../components/shared/messages/alerts';
import Box from '@mui/material/Box';
import * as log from 'loglevel';
import AlarmsFilters from '../components/alarms/alarmsFilter';
import AlarmForm from '../components/alarms/alarmForm';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { lighten } from '@mui/material';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export default function AlarmsPage({ tenantValues, thisTenant, graphqlErrors, env, language, token }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const theme = useTheme();
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
    cache: new InMemoryCache({ addTypename: false })
  });
  const GeTenantData = (type) => {
    const tenantArray = tenantValues.filter((e) => e.id === thisTenant);
    if (type === 'name') {
      return tenantArray[0].name;
    } else {
      return tenantArray[0].id;
    }
  };

  const [servicePath, setServicePath] = React.useState(null);
  const filterMapper = {
    servicePath: {
      value: servicePath,
      set: setServicePath
    }
  };

  const [createOpen, setCreateOpen] = React.useState(false);
  const [alarmsList, setAlarmsList] = React.useState([]);
  const [count, counter] = React.useState(1);

  const getAlarms = () => {
    client
      .query({
        query: gql`
          query getAlarms($tenantName: String!, $servicePath: String!) {
            getAlarms(tenantName: $tenantName, servicePath: $servicePath) {
              id
              alarm_type
              tenant
              servicepath
              entity_id
              entity_type
              channel_type
              channel_destination
              time_unit
              max_time_since_last_update
              alarm_frequency_time_unit
              alarm_frequency_time
              time_of_last_alarm
              status
            }
          }
        `,
        variables: {
          tenantName: GeTenantData('name'),
          servicePath:
            servicePath === '' || servicePath === null || typeof servicePath === 'undefined' ? '' : servicePath.path
        }
      })
      .then((response) => {
        let alarmsValues = response.data.getAlarms.map((value, index) => ({
          ...value,
          ...{
            secondaryColor: lighten(theme.palette.secondary.main, index / 50),
            primaryColor: lighten(theme.palette.primary.main, index / 50)
          }
        }));
        setAlarmsList(alarmsValues);
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  const [msg, sendNotification] = useNotification();
  log.debug(msg);
  const rerOder = (newData) => {
    setAlarmsList(
      newData.map((obj) => Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, JSON.parse(val)])))
    );
    counter(count + 1);
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

  const getTypeURL = () => {
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
        variables: { tenantName: GeTenantData('name'), skip: 0, limit: 0 }
      })
      .then((response) => {
        let filtered = response.data.getTenantResourceType.data.filter((e) => e.name === 'type');
        filtered.length > 0
          ? getTypesFromResource(filtered[0].endpointUrl)
          : getTypesFromResource(env.ORION + '/v2/types');
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  //types
  const [types, setTypes] = React.useState([]);
  const getTypesFromResource = (typeUrl) => {
    const headers = { 'fiware-Service': GeTenantData('name') };
    axios
      .get(typeUrl, {
        headers: headers
      })
      .then((response) => {
        setTypes(response.data);
      });
  };

  React.useEffect(() => {
    thisTenant !== null ? getAlarms() : '';
  }, [servicePath]);

  React.useEffect(() => {
    setServicePath(null);
    thisTenant !== null ? getAlarms() : '';
    thisTenant !== null ? getServices() : '';
    thisTenant !== null ? getTypeURL() : '';
  }, [thisTenant]);

  const mainTitle = <Trans>alarms.page.title</Trans>;
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {typeof thisTenant === 'undefined' || thisTenant === '' ? (
        ''
      ) : (
        <AddButton
          pageType={
            <AlarmForm
              env={env}
              title={<Trans>alarms.form.new</Trans>}
              types={types}
              token={token}
              GeTenantData={GeTenantData}
              getAlarms={getAlarms}
              close={setCreateOpen}
              action={'create'}
              services={services}
            />
          }
          setOpen={setCreateOpen}
          status={createOpen}
          graphqlErrors={graphqlErrors}
        ></AddButton>
      )}
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          sx={
            smallDevice
              ? {
                  width:
                    document.getElementById('filterContainer') === null
                      ? 300
                      : document.getElementById('filterContainer').clientWidth,
                  'overflow-x': 'scroll'
                }
              : ''
          }
        >
          <AlarmsFilters services={services} data={alarmsList} mapper={filterMapper} sortData={rerOder} />
        </Grid>
        {alarmsList.length > 0 ? (
          <>
            {alarmsList.map((alarm, index) => (
              <Grow
                key={index}
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(alarm.id === alarm.id ? { timeout: index * 600 } : {})}
              >
                <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                  <AlarmCard
                    env={env}
                    language={language}
                    key={alarm.id}
                    colors={{
                      secondaryColor: alarm.secondaryColor,
                      primaryColor: alarm.primaryColor
                    }}
                    getData={getAlarms}
                    pageType={
                      <AlarmForm
                        env={env}
                        title={<Trans i18nKey="alarms.form.edit" values={{ name: alarm.id }} />}
                        types={types}
                        token={token}
                        getAlarms={getAlarms}
                        GeTenantData={GeTenantData}
                        close={setCreateOpen}
                        action={'edit'}
                        data={alarm}
                        services={services}
                      />
                    }
                    data={alarm}
                  ></AlarmCard>
                </Grid>
              </Grow>
            ))}
          </>
        ) : (
          <Typography sx={{ padding: '20px' }} variant="h6" component="h3">
            <Trans>alarms.page.noData</Trans>
          </Typography>
        )}
      </Grid>
    </Box>
  );
}
