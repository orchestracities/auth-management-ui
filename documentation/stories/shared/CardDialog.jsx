
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import MultifunctionButton from '../../../src/components/shared/speedDial'
import { BrowserRouter} from "react-router-dom";
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import "../../../src/i18n";
import React from 'react';
import { SnackbarProvider } from "notistack";

/**
 * Primary UI component for user interaction
 */
 const theme = createTheme({
    status: {
      danger: orange[500],
    },
  });

export const CardDialog = ({ pageType,
    data,
    getData,
    status,
    setOpen
    }) => {


  return (
    <SnackbarProvider maxSnack={5}>
    <ThemeProvider theme={theme}>
    <BrowserRouter>
    <Grid
    >
             <MultifunctionButton
            key={data.id}
            data={data}
            getData={getData}
            pageType={pageType}
            setOpen={setOpen}
            status={status}
          ></MultifunctionButton>
    </Grid>
    </BrowserRouter>
    </ThemeProvider>
    </SnackbarProvider>
  );
};

CardDialog.propTypes = {
      /**
   * The ID of the react element
   */
       key: PropTypes.string,
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
   * The react hook function related to the opening and the closing of the button
   */
      setOpen: PropTypes.func,
         /**
   * The react hook value related to the opening and the closing of the button
   */
          status: PropTypes.bool,
};

CardDialog.defaultProps = {
    key:"",
    pageType: undefined,
    data:{},
    getData:undefined,
    setOpen:undefined,
    status:false
};
 