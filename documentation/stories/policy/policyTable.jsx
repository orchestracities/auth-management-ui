
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import PolicyTable from '../../../src/components/policy/policiesTable'
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

export const  PolicyDataInTable= ({
    data,
    getData,
    access_modes,
    agentsTypes,
}) => {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Grid
                >
                    <PolicyTable
              data={data}
              getData={getData}
              access_modes={access_modes}
              agentsTypes={agentsTypes}
            ></PolicyTable>
                </Grid>
            </BrowserRouter>
        </ThemeProvider>
    );
};

PolicyDataInTable.propTypes = {
    /**
* The data that is going to be displayed inside the table (the data should be filtered by the policyfilters)
*/
    data:  PropTypes.arrayOf(PropTypes.object),
    /**
   * The function to get the data 
   */
     getData: PropTypes.func,
    /**
    * The possibile values of the access modes displayed on the table
    */
     access_modes: PropTypes.arrayOf(PropTypes.object),

    /**
   * The possibile values of the agents types displayed on the table
  */
     agentsTypes:  PropTypes.arrayOf(PropTypes.object)
};

PolicyDataInTable.defaultProps = {
    data:[],
    getData:()=>{},
    access_modes:[],
    agentsTypes:[]
};
