import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import TenantSelection from '../../../src/components/shared/tenantSelection';
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import "../../../src/i18n";
/**
 * Primary UI component for user interaction
 */
 const theme = createTheme({
    status: {
      danger: orange[500],
    },
  });

export const SelectTenant = ({
    seTenant,
    tenantValues,
    correntValue}) => {


  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Grid
     container
     direction="column"
     justifyContent="center"
     alignItems="center"
        sx={{background:"lightblue",height:"300px",width:"350px"}}
    >
             <TenantSelection
                    seTenant={seTenant}
                    tenantValues={tenantValues}
                    correntValue={correntValue}
                  ></TenantSelection>
    </Grid>
    </BrowserRouter>
    </ThemeProvider>
  );
};

SelectTenant.propTypes = {


     /**
   * The corrent value of the Tenant Selected
   */
      correntValue: PropTypes.string,
       /**
   * The callBack function to set the Tenant inside the state of the class App
   */
        seTenant: PropTypes.func,
     /**
   * The possibile values of the select
   */
      tenantValues: PropTypes.arrayOf(PropTypes.object),
};

SelectTenant.defaultProps = {
    correntValue:"",
    seTenant:undefined,
    tenantValues:[]
};
 