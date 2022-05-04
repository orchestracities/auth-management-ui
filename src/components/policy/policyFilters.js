import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ActorFilter from './filters/actorFilter';
import ActorTypeFilter from './filters/actorTypeFilter';
import PathFilter from './filters/pathFilter';
import ResourceFilter from './filters/resourceFilter';
import ResourceTypeFilter from './filters/typeFilter';
import ModeFilter from './filters/modeFilter';

export default function PolicyFilters({ data,access_modes,agentsTypes,mapper }) {
  const [status, setstatus] = React.useState(null);
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }
  const fiware_service_path = getUniqueListBy(data, "fiware_service_path");
  const resource_type = getUniqueListBy(data, "resource_type");
  const agentsNames = [{ iri: 'acl:AuthenticatedAgent', name: 'Authenticated Agent' }, { iri: 'foaf:Agent', name: 'Agent' }, { iri: 'oc-acl:ResourceTenantAgent', name: 'Resource Tenant Agent' }, { iri: 'default', name: 'Default' }]
  React.useEffect(() => {
    if (status ==="") {
      setstatus(null);
    } 
  }, [status]);

  return (
    <Grid container spacing={4}  direction="row"
    justifyContent="space-between"
    alignItems="center">
      <Grid item xs={(status === "PathFilter") ? 12 : 1} sx={{ display: (status === null || status === "PathFilter") ? "flex" : "none" }}>
        <PathFilter filterValue={mapper.policy} data={fiware_service_path} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ModeFilter") ? 12 : 1} sx={{ display: (status === null || status === "ModeFilter") ? "flex" : "none" }}>
        <ModeFilter filterValue={mapper.mode} data={access_modes} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ResourceTypeFilter") ? 12 : 3} sx={{ display: (status === null || status === "ResourceTypeFilter") ? "flex" : "none" }}>
      <ResourceTypeFilter filterValue={mapper.resourceType} data={resource_type} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ActorFilter") ? 12 : 2} sx={{ display: (status === null || status === "ActorFilter") ? "flex" : "none" }}>
      <ActorFilter filterValue={mapper.agent} data={agentsNames} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ActorTypeFilter") ? 12 : 3} sx={{ display: (status === null || status === "ActorTypeFilter") ? "flex" : "none" }}>
      <ActorTypeFilter filterValue={mapper.agentType} data={agentsTypes} status={status} setstatus={setstatus} />
      </Grid>
    </Grid>
  );
}