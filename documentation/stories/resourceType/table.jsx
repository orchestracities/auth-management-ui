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

export const ResourceTypeTable = ({
  token,
  tokenData,
  env,
  resources,
  getTheResources,
  GeTenantData,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  resourceTypeLength
}) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <ResourceTable
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              resourceTypeLength={resourceTypeLength}
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

ResourceTypeTable.propTypes = {
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
  GeTenantData: PropTypes.func,
  /**
   * the hook value for the table page
   */
  page: PropTypes.number,
  /**
   * the hook function to change the table page
   */
  setPage: PropTypes.func,
  /**
   * the hook value for the number of elements inside a table page
   */
  rowsPerPage: PropTypes.number,
  /**
   * the hook function to change the number of elements inside a table page
   */
  setRowsPerPage: PropTypes.func,
  /**
   * the number of entities inside the DB
   */
  resourceTypeLength: PropTypes.number
};

ResourceTypeTable.defaultProps = {
  token: '',
  tokenData: {},
  env: undefined,
  resources: [],
  getTheResources: undefined,
  GeTenantData: undefined,
  page: 0,
  setPage: () => {},
  rowsPerPage: 10,
  setRowsPerPage: () => {},
  resourceTypeLength: 0
};
