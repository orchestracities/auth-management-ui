import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import EntityTable from '../../../src/components/entity/entityTable';
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

export const EntityTypeTable = ({
  data,
  env,
  token,
  language,
  getTheEntities,
  entityEndpoint,
  types,
  GeTenantData,
  services,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  entitiesLenght
}) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <EntityTable
              data={data}
              env={env}
              token={token}
              language={language}
              getTheEntities={getTheEntities}
              entityEndpoint={entityEndpoint}
              types={types}
              GeTenantData={GeTenantData}
              services={services}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              entitiesLenght={entitiesLenght}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

EntityTypeTable.propTypes = {
  /**
   * the array of values that will be displayed
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * the object that is containing the env variables
   */
  env: PropTypes.object,
  /**
   * the session token
   */
  token: PropTypes.string,
  /**
   * the current language of the user
   */
  language: PropTypes.string,
  /**
   * the function to call to get the entity list
   */
  getTheEntities: PropTypes.func,
  /**
   * the entities endpoint
   */
  entityEndpoint: PropTypes.string,
  /**
   * the array of values that will be displayed
   */
  types: PropTypes.arrayOf(PropTypes.object),
  /**
   * the array of attributes types
   */
  GeTenantData: PropTypes.func,
  /**
   * the array of services related to the entities
   */
  services: PropTypes.arrayOf(PropTypes.object),
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
  entitiesLenght: PropTypes.number
};

EntityTypeTable.defaultProps = {
  data: [],
  env: undefined,
  token: '',
  language: 'en',
  getTheEntities: () => {},
  entityEndpoint: '',
  types: [],
  GeTenantData: () => {},
  services: [],
  page: 0,
  setPage: () => {},
  rowsPerPage: 10,
  setRowsPerPage: () => {},
  entitiesLenght: 0
};
