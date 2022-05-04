import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import ActorFilter from './filters/actorFilter';
import ActorTypeFilter from './filters/actorTypeFilter';
import PathFilter from './filters/pathFilter';
import ResourceFilter from './filters/resourceFilter';
import TypeFilter from './filters/typeFilter';

export default function PolicyFilters({ data }) {
  const [status, setstatus] = React.useState(null);
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
  }
  const fiware_service_path = getUniqueListBy(data, "fiware_service_path");
  const resource_type = getUniqueListBy(data, "resource_type");

  React.useEffect(() => {
    if (status ==="") {
      setstatus(null);
    } 
  }, [status]);

  return (
    (status !=="")?
    <Grid container>
      <Grid item xs={(status === "PathFilter") ? 12 : 2} sx={{ display: (status === null || status === "PathFilter") ? "flex" : "none" }}>
        <PathFilter data={fiware_service_path} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={(status === "ResourceFilter") ? 12 : 2} sx={{ display: (status === null || status === "ResourceFilter") ? "flex" : "none" }}>
        <ResourceFilter data={resource_type} status={status} setstatus={setstatus} />
      </Grid>
      <Grid item xs={3} sx={{ display: (status === null) ? "flex" : "none" }}>
        <TypeFilter></TypeFilter>
      </Grid>
      <Grid item xs={2} sx={{ display: (status === null) ? "flex" : "none" }}>
        <ActorFilter></ActorFilter>
      </Grid>
      <Grid item xs={2} sx={{ display: (status === null) ? "flex" : "none" }}>
        <ActorTypeFilter></ActorTypeFilter>
      </Grid>
    </Grid>:""
  );
}