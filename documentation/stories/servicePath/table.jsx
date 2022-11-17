import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ResourceTable from '../../../src/components/resource/resourceTypeTable';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import '../../../src/i18n';
import React from 'react';
import { SnackbarProvider } from 'notistack';

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
  status: {
    danger: orange[500]
  }
});

export const ServicePathTable = ({ token, tokenData, env, resources, getTheResources, GeTenantData }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <ResourceTable
              token={token}
              tokenData={tokenData}
              env={env}
              resources={resources}
              getTheResources={getTheResources}
              GeTenantData={GeTenantData}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

ServicePathTable.propTypes = {
  /**
   * The user token passed by Keycloack
   */
  token: PropTypes.string,
  /**
   * The user token decoded passed by Keycloack
   */
  tokenData: PropTypes.object,

  /**
   * the ENV variables
   */
  env: PropTypes.object,
  /**
   * the array of values that will be displayed
   */
  resources: PropTypes.arrayOf(PropTypes.object),
  /**
   * The function to get the resource types data after a save
   */
  getTheResources: PropTypes.func,
  /**
   * The function to return the name or the ID of the tenant
   */
  GeTenantData: PropTypes.func
};

ServicePathTable.defaultProps = {
  token: '',
  tokenData: {},
  env: {},
  resources: [],
  getTheResources: undefined,
  GeTenantData: undefined
};
