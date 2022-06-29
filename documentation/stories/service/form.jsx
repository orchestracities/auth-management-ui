
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ServiceForm from '../../../src/components/service/serviceForm'
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

export const ServiceMainForm = ({
    title,
    close,
    action,
    service,
    getServices,
    tenantName_id,
}) => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Grid
                >
                    <ServiceForm
              title={title}
              close={close}
              service={service}
              action={action}
              getServices={getServices}
              tenantName_id={tenantName_id}
            />
                </Grid>
            </BrowserRouter>
        </ThemeProvider>
    );
};

ServiceMainForm.propTypes = {
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
    action: PropTypes.oneOf(['create', 'Sub-service-creation']),
    /**
* The function to get the services data after a save
*/
getServices: PropTypes.func,
    /**
* The corrent Tenant data (you can pass it all otherwise only the name and the id)
*/
tenantName_id: PropTypes.arrayOf(PropTypes.object),
    /**
* The corrent Service data
*/
service: PropTypes.object,

};

ServiceMainForm.defaultProps = {
    title: "",
    close: () => { },
    action: "",
    service:{},
    getServices: () => { },
    tenantName_id: [{}]
};
