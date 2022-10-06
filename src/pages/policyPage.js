import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import PolicyFilters from '../components/policy/policyFilters';
import PolicyTable from '../components/policy/policiesTable';
import PolicyForm from '../components/policy/policyForm';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import { Trans } from 'react-i18next';
import useNotification from '../components/shared/messages/alerts';
import { getEnv } from '../env';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import * as log from 'loglevel';

const env = getEnv();

export default function PolicyPage({ getTenants, tenantValues, thisTenant, graphqlErrors, token }) {
  typeof env.CONSOLE === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.CONSOLE);

  const [mode, setMode] = React.useState(null);
  const [agent, setAgent] = React.useState(null);
  const [resource, setResource] = React.useState(null);
  const [resourceType, setResourceType] = React.useState(null);
  const [agentType, setAgentype] = React.useState(null);
  const [policyFilter, setPolicyFilter] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const tenantName_id = () => {
    const tenantArray = tenantValues.filter((e) => e.id === thisTenant);
    return tenantArray[0].name;
  };
  // services
  const [services, setServices] = React.useState([]);
  const getServices = () => {
    axios
      .get(env.ANUBIS_API_URL + 'v1/tenants/' + thisTenant + '/service_paths', {
        headers: {
          // authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        log.debug(response.data);
        setServices(response.data);
        getPolicies(response.data);
        getPoliciesFiltered(response.data);
        getTenants();
      })
      .catch((e) => {
        getTenants();
        if (e.response) {
          e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
        } else {
          sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
        }
      });
  };
  // policies
  const [policies, setPolicies] = React.useState([]);
  const getPolicies = (servicesResponse) => {
    let datAccumulator = [];
    for (const service of servicesResponse) {
      axios
        .get(env.ANUBIS_API_URL + 'v1/policies', {
          headers: {
            'fiware-service': tenantName_id(),
            'fiware-servicepath': service.path
            //'authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
          response.data.forEach((e) => (e.fiware_service = tenantName_id()));
          response.data.forEach((e) => (e.fiware_service_path = service.path));
          datAccumulator = [...datAccumulator, ...response.data];
          setPolicies(datAccumulator);
        })
        .catch((e) => {
          if (e.response) {
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          } else {
            sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
          }
        });
    }
    log.debug(policies);
  };
  // policiesFiltered
  const [policiesFiltered, setPoliciesFiltered] = React.useState([]);
  const getPoliciesFiltered = (servicesResponse) => {
    const queryParameters =
      '/?' +
      (mode !== null ? '&mode=' + mode.iri : '') +
      (resource !== null ? '&resource=' + resource.access_to : '') +
      (agent !== null ? '&agent=' + agent.iri : '') +
      (resourceType !== null ? '&resource_type=' + resourceType.resource_type : '') +
      (agentType !== null ? '&agent_type=' + agentType.iri : '');
    let datAccumulator = [];
    for (const service of servicesResponse) {
      axios
        .get(env.ANUBIS_API_URL + 'v1/policies' + queryParameters, {
          headers: {
            'fiware-service': tenantName_id(),
            'fiware-servicepath': policyFilter !== null ? policyFilter.fiware_service_path : service.path
            //'authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
          if (policyFilter === null) {
            response.data.forEach((e) => (e.fiware_service = tenantName_id()));
            response.data.forEach((e) => (e.fiware_service_path = service.path));
            datAccumulator = [...datAccumulator, ...response.data];
            setPoliciesFiltered(datAccumulator);
          } else {
            response.data.forEach((e) => (e.fiware_service = tenantName_id()));
            response.data.forEach((e) => (e.fiware_service_path = policyFilter.fiware_service_path));
            setPoliciesFiltered(response.data);
          }
        })
        .catch((e) => {
          if (e.response) {
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          } else {
            sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
          }
        });
    }
    log.debug(policies);
  };

  const [access_modes, setAccess_modes] = React.useState([]);

  React.useEffect(() => {
    if (!(thisTenant === null || typeof thisTenant === 'undefined')) {
      getServices();
      axios
        .get(env.ANUBIS_API_URL + 'v1/policies/access-modes', {
          headers: {
            //'authorization': `Bearer ${token}`
          }
        })
        .then((response) => setAccess_modes(response.data))
        .catch((err) =>
          sendNotification({ msg: err.message + ': cannot reach policy managenent api', variant: 'error' })
        );
    }
  }, [thisTenant]);

  const [agentsTypes, setagentsTypes] = React.useState([]);

  React.useEffect(() => {
    if (!(thisTenant === null || typeof thisTenant === 'undefined')) {
      getServices();
      axios
        .get(env.ANUBIS_API_URL + 'v1/policies/agent-types', {
          headers: {
            //'authorization': `Bearer ${token}`
          }
        })
        .then((response) => setagentsTypes(response.data))
        .catch((err) =>
          sendNotification({ msg: err.message + ': cannot reach policy managenent api', variant: 'error' })
        );
    }
  }, [thisTenant]);

  const mainTitle = <Trans>policies.titles.page</Trans>;

  const filterMapper = {
    mode: {
      value: mode,
      set: setMode
    },
    agent: {
      value: agent,
      set: setAgent
    },
    resource: {
      value: resource,
      set: setResource
    },
    resourceType: {
      value: resourceType,
      set: setResourceType
    },
    agentType: {
      value: agentType,
      set: setAgentype
    },
    policy: {
      value: policyFilter,
      set: setPolicyFilter
    }
  };

  React.useEffect(() => {
    if (policies.length > 0) {
      getPoliciesFiltered(services);
    }
  }, [mode, agent, resource, resourceType, agentType, policyFilter]);
  const theme = useTheme();
  const smallDevice = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ marginBottom: 15 }}>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {typeof thisTenant === 'undefined' || thisTenant === '' ? (
        ''
      ) : (
        <AddButton
          pageType={
            <PolicyForm
              tenantName={tenantName_id}
              action="create"
              agentsTypes={agentsTypes}
              services={services}
              getServices={getServices}
              access_modes={access_modes}
              title={<Trans>policies.titles.new</Trans>}
              close={setOpen}
              token={token}
            ></PolicyForm>
          }
          setOpen={setOpen}
          status={open}
          graphqlErrors={graphqlErrors}
        ></AddButton>
      )}
      {policies.length > 0 ? (
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
                ? { width: document.getElementById('filterContainer').clientWidth, 'overflow-x': 'scroll' }
                : ''
            }
          >
            <PolicyFilters
              data={policies}
              access_modes={access_modes}
              agentsTypes={agentsTypes}
              mapper={filterMapper}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <PolicyTable
              tenantName={tenantName_id}
              services={services}
              data={policiesFiltered}
              getData={getServices}
              access_modes={access_modes}
              agentsTypes={agentsTypes}
            ></PolicyTable>
          </Grid>
        </Grid>
      ) : (
        <Typography sx={{ padding: '20px' }} variant="h6" component="h3">
          <Trans>policies.titles.noData</Trans>
        </Typography>
      )}
    </Box>
  );
}
