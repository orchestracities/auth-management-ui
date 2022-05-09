import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import ActorFilter from "./filters/actorFilter";
import ActorTypeFilter from "./filters/actorTypeFilter";
import PathFilter from "./filters/pathFilter";
import ResourceFilter from "./filters/resourceFilter";
import TypeFilter from "./filters/typeFilter";

export default function PolicyFilters() {
  return (
    <Grid container>
      <Grid item xs={2}>
        <PathFilter></PathFilter>
      </Grid>
      <Grid item xs={3}>
        <ResourceFilter></ResourceFilter>
      </Grid>
      <Grid item xs={3}>
        <TypeFilter></TypeFilter>
      </Grid>
      <Grid item xs={2}>
        <ActorFilter></ActorFilter>
      </Grid>
      <Grid item xs={2}>
        <ActorTypeFilter></ActorTypeFilter>
      </Grid>
    </Grid>
  );
}
