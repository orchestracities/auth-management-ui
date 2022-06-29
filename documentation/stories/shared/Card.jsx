import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import DashboardCard from '../../../src/components/shared/cards';
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

export const Card = ({ pageType,
    data,
    getData,
    seTenant}) => {


  return (
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Grid

    >
             <DashboardCard
                pageType={pageType}
                data={data}
                getData={getData}
                seTenant={seTenant}
              ></DashboardCard>
    </Grid>
    </BrowserRouter>
    </ThemeProvider>
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
   * The callBack function after the modal data is saved (should be a react hook )
   */
        getData: PropTypes.func,
     /**
   * The callBack function after the modal data is saved (ONLY for the Tenants Page)
   */
      seTenant: PropTypes.func,
};

Card.defaultProps = {
    pageType: undefined,
    data:{},
    getData:undefined,
    seTenant:undefined
};
 