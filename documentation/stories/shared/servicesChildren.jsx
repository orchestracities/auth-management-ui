
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ServiceChildren from '../../../src/components/service/serviceChildren'
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

export const ShowServicesChildren = ({
  data,
  status,
  setOpen,
  getData
}) => {


  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Grid
         
        >
          <ServiceChildren
            setOpen={setOpen}
            status={status}
            data={
            
                 data.service_paths.slice(1)
               
            }
            masterTitle={ data.name}
            getData={getData}
          />
        </Grid>
      </BrowserRouter>
    </ThemeProvider>
  );
};

ShowServicesChildren.propTypes = {
  /**
  * The data that is going to be inside the table 
  */
  data: PropTypes.arrayOf(PropTypes.object),
  /**
  * The name of the main element (a Tenant or a Path)
  */
  masterTitle: PropTypes.string,
  /**
* The value to open the modal (should be a react hook )
*/
  status: PropTypes.bool,
  /**
* The function to open the modal (should be a react hook )
*/
setOpen: PropTypes.func,
  /**
* The callBack function after a delete to update the data inside the table
*/
getData: PropTypes.func,
};

ShowServicesChildren.defaultProps = {
  data: [],
  masterTitle: "",
  status: false,
  setOpen: undefined,
  getData: undefined
};
