import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import TenantForm from '../../../src/components/tenant/tenantForm';
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

export const TenantMainForm = ({ title, close, action, getTenants, tenant, token }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <TenantForm
              title={title}
              close={close}
              action={action}
              getTenants={getTenants}
              tenant={tenant}
              token={token}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

TenantMainForm.propTypes = {
  /**
   * The Titile that is going to be displayed inside the form
   */
  title: PropTypes.string.isRequired,
  /**
   * The callBack function after the modal data is saved (should be a react hook )
   */
  close: PropTypes.func.isRequired,

  /**
   * The form action
   */
  action: PropTypes.oneOf(['create', 'modify']),
  /**
   * The function to get the data after a save
   */
  getTenants: PropTypes.func.isRequired,
  /**
   * The corrent Tenant data
   */
  tenant: PropTypes.object,

  /**
   * The token of the session
   */
  token: PropTypes.string
};

TenantMainForm.defaultProps = {
  title: '',
  close: () => {},
  action: '',
  getTenants: () => {},
  tenant: {},
  token: ''
};
