import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import DashboardCard from '../../../src/components/shared/cards';
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

export const Card = ({ pageType, data, colors, getData, seTenant }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <DashboardCard
              pageType={pageType}
              data={data}
              colors={colors}
              getData={getData}
              seTenant={seTenant}
            ></DashboardCard>
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

Card.propTypes = {
  /**
   * is the element that will be rendered inside the modal, can only be a ServiceForm with "Sub-service-creation" as a action or a TenantForm with "Modify" as a action
   */
  pageType: PropTypes.any,

  /**
   * The object with the data
   */
  data: PropTypes.object,
  /**
   * An Object composed by two properties the primaryColor and the secondaryColor, is mandatory for the serviceCard
   */
  colors: PropTypes.object,

  /**
   * The callBack function after the modal data is saved (should be a react hook )
   */
  getData: PropTypes.func,
  /**
   * The callBack function after the modal data is saved (ONLY for the Tenants Page)
   */
  seTenant: PropTypes.func,
  /**
   * The corrent tenant data
   */
  tenantName_id: PropTypes.object
};

Card.defaultProps = {
  pageType: undefined,
  data: {},
  colors: { secondaryColor: '', primaryColor: '' },
  getData: undefined,
  seTenant: undefined,
  tenantName_id: {}
};
