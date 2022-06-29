
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import PolicyForm from '../../../src/components/policy/policyForm'
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import "../../../src/i18n";
import React from 'react';

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
    status: {
        danger: orange[500],
    },
});

export const PolicyMainForm = ({
    action,
    agentsTypes,
    services,
    getServices,
    access_modes,
    title,
    close
}) => {
    const getTenantName=()=>{
        return "Tenant1"
    }
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Grid
                >  <PolicyForm
                    tenantName={getTenantName}
                    action={action}
                    agentsTypes={agentsTypes}
                    services={services}
                    getServices={getServices}
                    access_modes={access_modes}
                    title={title}
                    close={close}
                ></PolicyForm>
                </Grid>
            </BrowserRouter>
        </ThemeProvider>
    );
};

PolicyMainForm.propTypes = {
    /**
 * The Titile that is going to be displayed inside the form
 */
    title: PropTypes.string,
    /**
    * The callBack function after the modal data is saved (should be a react hook )
    */
    close: PropTypes.func,

    /**
  * The form action
  */
    action: PropTypes.oneOf(['create']),
        /**
* The function to get the services data after a save
*/
services: PropTypes.arrayOf(PropTypes.object),
    /**
* The function to get the services data after a save
*/
    getServices: PropTypes.func,
    /**
* A function to get the corrent Tenant name
*/
tenantName: PropTypes.func,

    /**
      * The possibile values of the access modes displayed on the table
      */
    access_modes: PropTypes.arrayOf(PropTypes.object),

    /**
   * The possibile values of the agents types displayed on the table
  */
    agentsTypes: PropTypes.arrayOf(PropTypes.object)

};

PolicyMainForm.defaultProps = {
    tenantName:()=>{},
    action:()=>{},
    agentsTypes:[],
    services:[],
    getServices:()=>{},
    access_modes:[],
    title:"",
    close:()=>{}
};

