import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import PolicyTable from '../../../src/components/policy/policiesTable';
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

export const PolicyDataInTable = ({  env,
  token,data, getData, access_modes, agentsTypes, page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  policiesLenght }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <PolicyTable
              data={data}
              env={env}
              token={token}
              getData={getData}
              access_modes={access_modes}
              agentsTypes={agentsTypes}
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              policiesLenght={policiesLenght}
            ></PolicyTable>
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

PolicyDataInTable.propTypes = {
  /**
   * The data that is going to be displayed inside the table (the data should be filtered by the policyfilters)
   */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
   * The function to get the data
   */
  getData: PropTypes.func,
  /**
   * The possibile values of the access modes displayed on the table
   */
  access_modes: PropTypes.arrayOf(PropTypes.object),
  /**
   * the object that is containing the env variables
   */
  env: PropTypes.object,
  /**
   * the session token
   */
  token: PropTypes.string,
  /**
   * The possibile values of the agents types displayed on the table
   */
  agentsTypes: PropTypes.arrayOf(PropTypes.object),
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
    * the number of policies inside the DB
    */
   policiesLenght: PropTypes.number
};

PolicyDataInTable.defaultProps = {
  data: [],
  getData: () => {},
  access_modes: [],
  agentsTypes: [],
  env: undefined,
  token: '',
  page: 0,
  setPage: () => {},
  rowsPerPage: 10,
  setRowsPerPage: () => {},
  policiesLenght: 0
};
