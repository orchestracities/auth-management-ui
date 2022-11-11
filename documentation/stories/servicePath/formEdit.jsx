import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import EndpointsForm from '../../../src/components/resource/endpointsForm';
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

export const EndpointEdit = ({ title, close, action, token, resourceTypeName, env, getTheResources, data }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <EndpointsForm
              title={title}
              close={close}
              action={action}
              token={token}
              resourceTypeName={resourceTypeName}
              env={env}
              getTheResources={getTheResources}
              data={data}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

EndpointEdit.propTypes = {
  /**
   * The title that will be displayed inside the form
   */
  title: PropTypes.string,
  /**
   * The hook function to close the modal
   */
  close: PropTypes.func,
  /**
 * The form action
 */
  action: PropTypes.oneOf(['modify']),
  /**
   * The token passed by keycloack
   */
  token: PropTypes.string,
  /**
    * The Resource Type name
    */
   resourceTypeName: PropTypes.string,
  /**
    * The ENV variables
    */
  env: PropTypes.object,
  /**
  * The function to call to get the resources
  */
  getTheResources: PropTypes.func,
  /**
   * The data that needs to be displayed
   */
   data: PropTypes.arrayOf(PropTypes.object),

};

EndpointEdit.defaultProps = {
  title: "",
  close: undefined,
  action: "modify",
  token: "",
  resourceTypeName: "",
  env: {},
  getTheResources: undefined,
  data: []
};
