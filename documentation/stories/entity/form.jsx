import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import EntityForm from '../../../src/components/entity/entityForm';
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

export const Form = ({
  title,
  close,
  action,
  env,
  data,
  getTheEntities,
  types,
  services,
  GeTenantData,
  entityEndpoint,
  view
}) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <EntityForm
              title={title}
              close={close}
              action={action}
              env={env}
              data={data}
              getTheEntities={getTheEntities}
              types={types}
              services={services}
              GeTenantData={GeTenantData}
              entityEndpoint={entityEndpoint}
              view={view}
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
   * The function to call to get the entities related to the Tenant
   */
  getTheEntities: PropTypes.func,
  /**
   * the array of object with all of the attributes types
   */
  types: PropTypes.arrayOf(PropTypes.object),
  /**
   * the array of object with all of the services
   */
  services: PropTypes.arrayOf(PropTypes.object),
  /**
   * The function to get the Tenant data after a save
   */
  GeTenantData: PropTypes.func,
  /**
   * The defined enpoint of the entity
   */
  entityEndpoint: PropTypes.string,
  /**
   * The function to go back to the view mode
   */
  view: PropTypes.func
};

Form.defaultProps = {
  title: 'Title',
  close: () => {},
  action: null,
  env: {},
  data: {},
  getTheEntities: () => {},
  types: [],
  services: [],
  GeTenantData: () => {},
  entityEndpoint: '',
  view: () => {}
};
