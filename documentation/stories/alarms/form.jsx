import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import AlarmForm from '../../../src/components/alarms/alarmForm';
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

export const Form = ({ title, close, action, GeTenantData, services, env, types, token, data }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <AlarmForm
              title={title}
              close={close}
              action={action}
              env={env}
              data={data}
              types={types}
              services={services}
              GeTenantData={GeTenantData}
              token={token}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

Form.propTypes = {
  /**
   * The Titile that is going to be displayed inside the form
   */
  title: PropTypes.string,
  /**
   * The callBack function after the modal data is saved (should be a react hook )
   */
  close: PropTypes.func,
  /**
   * The policy data that should be modified
   */
  data: PropTypes.object,
  /**
   * The form action
   */
  action: PropTypes.oneOf(['create', 'modify']),
  /**
   * the config file passed
   */
  env: PropTypes.object,
  /**
   * the session token
   */
  token: PropTypes.string,
  /**
   * The function to get the Tenant data after a save
   */
  GeTenantData: PropTypes.func,
  /**
   * the array of object with all of the services
   */
  services: PropTypes.arrayOf(PropTypes.object),
  /**
   * the array of object with all of the attributes types
   */
  types: PropTypes.arrayOf(PropTypes.object)
};

Form.defaultProps = {
  title: 'Title',
  close: () => {},
  action: null,
  env: undefined,
  data: {},
  types: [],
  services: [],
  GeTenantData: () => {},
  token: ''
};
