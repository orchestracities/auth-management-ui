import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ResourceForm from '../../../src/components/resource/resourceForm';
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

export const ServicePathCreation = ({ title, close, action, token, tokenData, env, getTheResources, thisTenant }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <ResourceForm
              title={title}
              close={close}
              action={action}
              token={token}
              tokenData={tokenData}
              env={env}
              getTheResources={getTheResources}
              thisTenant={thisTenant}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

ServicePathCreation.propTypes = {
  /**
   * The title that will be displayed inside the form
   */
  title: PropTypes.string,
  /**
   * The hook function to close the modal
   */
  close: PropTypes.func,

  /**
   * The token passed by keycloack
   */
  token: PropTypes.string,
  /**
   * The form action
   */
  action: PropTypes.oneOf(['create']),
  /**
   * The data inside the token after the decode
   */
  tokendata: PropTypes.object,
  /**
   * The ENV variables
   */
  env: PropTypes.object,
  /**
   * The function to call to get the resources
   */
  getTheResources: PropTypes.func,
  /**
   * The Tenant name
   */
  thisTenant: PropTypes.string
};

ServicePathCreation.defaultProps = {
  title: '',
  close: undefined,
  action: 'create',
  token: '',
  tokendata: {},
  env: {},
  getTheResources: undefined,
  thisTenant: ''
};
