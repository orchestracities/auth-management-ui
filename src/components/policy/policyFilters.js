import * as React from 'react';
import Grid from '@mui/material/Grid';
import ActorFilter from './filters/actorFilter';
import ActorTypeFilter from './filters/actorTypeFilter';
import PathFilter from '../shared/filters/pathFilter';
import ResourceTypeFilter from './filters/resourceFilter';
import ModeFilter from './filters/modeFilter';
import AcessToFilter from './filters/resourceFilter';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function PolicyFilters({ data, access_modes, agentsTypes, mapper, services }) {
  const [status, setstatus] = React.useState(null);
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  const getAllAgentsNames = () => {
    const agents = [];
    for (const thisPolicy of data) {
      for (const thisAgent of thisPolicy.agent) {
        const thisAgentSplit = thisAgent.split(':').slice('2').join(':');
        if (thisAgentSplit !== '') {
          agents.push({ iri: thisAgent, name: thisAgentSplit });
        }
      }
    }
    return getUniqueListBy(agents, 'iri');
  };
  const getSpecificAgentsNames = (selectedAgentType) => {
    const agents = [];
    for (const thisPolicy of data) {
      for (const thisAgent of thisPolicy.agent) {
        const thisAgentSplit = thisAgent.split(':').slice('2').join(':');
        const agentType = thisAgent.split(':', 2).join(':');
        if (thisAgentSplit !== '' && agentType === selectedAgentType) {
          agents.push({ iri: thisAgent, name: thisAgentSplit });
        }
      }
    }
    return getUniqueListBy(agents, 'iri');
  };

  const agentsNames = [
    ...agentsTypes,
    ...[
      { iri: 'acl:AuthenticatedAgent', name: 'authenticated agent' },
      { iri: 'foaf:Agent', name: 'anyone' },
      { iri: 'oc-acl:ResourceTenantAgent', name: 'resource tenant agent' }
    ]
  ];
  const fiware_service_path = getUniqueListBy(services, 'path');
  const resource_type = getUniqueListBy(data, '');
  const access_to = getUniqueListBy(data, 'access_to');
  React.useEffect(() => {
    if (status === '') {
      setstatus(null);
    }
  }, [status]);

  const theme = useTheme();
  const isResponsive = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid
      container
      direction="row"
      spacing={0.5}
      justifyContent="flex-start"
      alignItems="center"
      sx={isResponsive ? { minWidth: 1100 } : ''}
    >
      <Grid
        item
        xs={status === 'PathFilter' ? 12 : 'auto'}
        sm={status === 'PathFilter' ? 12 : 'auto'}
        md={status === 'PathFilter' ? 12 : 'auto'}
        lg={status === 'PathFilter' ? 12 : 'auto'}
        xl={status === 'PathFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'PathFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <PathFilter filterValue={mapper.policy} data={fiware_service_path} status={status} setstatus={setstatus} />
      </Grid>
      <Grid
        item
        xs={status === 'ModeFilter' ? 12 : 'auto'}
        sm={status === 'ModeFilter' ? 12 : 'auto'}
        md={status === 'ModeFilter' ? 12 : 'auto'}
        lg={status === 'ModeFilter' ? 12 : 'auto'}
        xl={status === 'ModeFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'ModeFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ModeFilter filterValue={mapper.mode} data={access_modes} status={status} setstatus={setstatus} />
      </Grid>
      <Grid
        item
        xs={status === 'AcessToFilter' ? 12 : 'auto'}
        sm={status === 'AcessToFilter' ? 12 : 'auto'}
        md={status === 'AcessToFilter' ? 12 : 'auto'}
        lg={status === 'AcessToFilter' ? 12 : 'auto'}
        xl={status === 'AcessToFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'AcessToFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <AcessToFilter filterValue={mapper.resource} data={access_to} status={status} setstatus={setstatus} />
      </Grid>
      <Grid
        item
        xs={status === 'ResourceTypeFilter' ? 12 : 'auto'}
        sm={status === 'ResourceTypeFilter' ? 12 : 'auto'}
        md={status === 'ResourceTypeFilter' ? 12 : 'auto'}
        lg={status === 'ResourceTypeFilter' ? 12 : 'auto'}
        xl={status === 'ResourceTypeFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'ResourceTypeFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ResourceTypeFilter
          filterValue={mapper.resourceType}
          data={resource_type}
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ActorFilter' ? 12 : 'auto'}
        sm={status === 'ActorFilter' ? 12 : 'auto'}
        md={status === 'ActorFilter' ? 12 : 'auto'}
        lg={status === 'ActorFilter' ? 12 : 'auto'}
        xl={status === 'ActorFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'ActorFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ActorFilter
          filterValue={mapper.agent}
          data={
            mapper.agentType.value === null ? getAllAgentsNames() : getSpecificAgentsNames(mapper.agentType.value.iri)
          }
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ActorTypeFilter' ? 12 : 'auto'}
        sm={status === 'ActorTypeFilter' ? 12 : 'auto'}
        md={status === 'ActorTypeFilter' ? 12 : 'auto'}
        lg={status === 'ActorTypeFilter' ? 12 : 'auto'}
        xl={status === 'ActorTypeFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'ActorTypeFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ActorTypeFilter filterValue={mapper.agentType} data={agentsNames} status={status} setstatus={setstatus} />
      </Grid>
    </Grid>
  );
}
