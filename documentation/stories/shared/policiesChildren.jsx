
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import PoliciesChildren from '../../../src/components/policy/policiesChildren'
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

export const ShowPoliciesChildren = ({ 
    tenantId,
    tenantName,
    seTenant,
    }) => {


  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Grid
    >
             <PoliciesChildren
            tenantId={tenantId}
            tenantName={tenantName}
            seTenant={seTenant}
          ></PoliciesChildren>
    </Grid>
    </BrowserRouter>
    </ThemeProvider>
  );
};

ShowPoliciesChildren.propTypes = {
      /**
   * The ID of Tenant related to the policies
   */
       tenantId: PropTypes.string,
   /**
   * The Name of Tenant related to the policies
   */
    tenantName: PropTypes.string,

     /**
   * The callback function that is used to set the tenant after the click action on the button by the user
   */
      seTenant: PropTypes.func,
};

ShowPoliciesChildren.defaultProps = {
    tenantId:"",
    tenantName: "",
    seTenant:undefined
};
 