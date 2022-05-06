import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ActorFilter from './filters/actorFilter';
import ActorTypeFilter from './filters/actorTypeFilter';
import PathFilter from './filters/pathFilter';
import ResourceTypeFilter from './filters/typeFilter';
import ModeFilter from './filters/modeFilter';

export default function PolicyFilters({ data, access_modes, agentsTypes, mapper }) {
  const [status, setstatus] = React.useState(null);
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }
  const fiware_service_path = getUniqueListBy(data, "fiware_service_path");
  const resource_type = getUniqueListBy(data, "resource_type");
  const agentsNames = [{ iri: 'acl:AuthenticatedAgent', name: 'Authenticated Agent' }, { iri: 'foaf:Agent', name: 'Agent' }, { iri: 'oc-acl:ResourceTenantAgent', name: 'Resource Tenant Agent' }, { iri: 'default', name: 'Default' }]
  React.useEffect(() => {
    if (status === "") {
      setstatus(null);
    }
  }, [status]);

  return (
    <Grid container
      direction="row"
      spacing={0.5}
      justifyContent="flex-start"
      alignItems="center">
      <Grid item xs={(status === "PathFilter") ? 12 : "auto"} sx={{ display: (status === null || status === "PathFilter") ? "flex" : "none" }} zeroMinWidth>
        <PathFilter filterValue={mapper.policy} data={fiware_service_path} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ModeFilter") ? 12 : "auto"} sx={{ display: (status === null || status === "ModeFilter") ? "flex" : "none" }} zeroMinWidth>
        <ModeFilter filterValue={mapper.mode} data={access_modes} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ResourceTypeFilter") ? 12 :"auto"} sx={{ display: (status === null || status === "ResourceTypeFilter") ? "flex" : "none" }} zeroMinWidth>
        <ResourceTypeFilter filterValue={mapper.resourceType} data={resource_type} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ActorFilter") ? 12 : "auto"} sx={{ display: (status === null || status === "ActorFilter") ? "flex" : "none" }} zeroMinWidth>
        <ActorFilter filterValue={mapper.agent} data={agentsNames} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ActorTypeFilter") ? 12 : "auto"} sx={{ display: (status === null || status === "ActorTypeFilter") ? "flex" : "none" }} zeroMinWidth>
        <ActorTypeFilter filterValue={mapper.agentType} data={agentsTypes} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ActorTypeFilter") ? 12 : "auto"} sx={{ display: (status === null || status === "ActorTypeFilter") ? "flex" : "none" }}>
      </Grid>
    </Grid>
  );
}
