
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import ServiceChildren from '../../../src/components/service/serviceChildren'
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

export const ChildrenOfTheService = ({
    setOpen,
    status,
    data,
    masterTitle,
    getData
}) => {
    const [open, sethisOpen] = useState(true);
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Grid
                >
                    <ServiceChildren
                        setOpen={sethisOpen}
                        status={open}
                        data={
                            data
                        }
                        masterTitle={masterTitle}
                        getData={getData}
                    />
                </Grid>
            </BrowserRouter>
        </ThemeProvider>
    );
};

ChildrenOfTheService.propTypes = {
    /**
* The Title that is going to be displayed inside the form
*/
    masterTitle: PropTypes.string.isRequired,
    /**
   * The hook value (should be a react hook )
   */
    status: PropTypes.bool,
    /**
    * The hook callBack function after the modal data is saved (should be a react hook )
    */
    setOpen: PropTypes.func.isRequired,

    /**
  * The data that is going to be displayed inside the table
  */
     data:  PropTypes.arrayOf(PropTypes.object),
    /**
* The function to get the services data
*/
getData: PropTypes.func.isRequired,
};

ChildrenOfTheService.defaultProps = {
    setOpen:()=>{},
    status:undefined,
    data:[],
    masterTitle:"Title",
    getData:()=>{}
};
