
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import PolicyFilters from '../../../src/components/policy/policyFilters'
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import "../../../src/i18n";
import * as React from 'react'

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
    status: {
        danger: orange[500],
    },
});

export const  PoliciesFiltering= ({
    data,
    access_modes,
    agentsTypes,
}) => {
                          
const [mode, setMode] = React.useState(null)
const [agent, setAgent] = React.useState(null)
const [resource, setResource] = React.useState(null)
const [resourceType, setResourceType] = React.useState(null)
const [agentType, setAgentype] = React.useState(null)
const [policyFilter, setPolicyFilter] = React.useState(null)

const filterMapper = {
mode: {
value: mode,
set: setMode
},
agent: {
value: agent,
set: setAgent
},
resource: {
value: resource,
set: setResource
},
resourceType: {
value: resourceType,
set: setResourceType
},
agentType: {
value: agentType,
set: setAgentype
},
policy: {
value: policyFilter,
set: setPolicyFilter
}
}

    return (
        <ThemeProvider theme={theme} id="filterContainer">
           
            <BrowserRouter>
                <Grid
                >
                   <PolicyFilters
                   id="filterContainer"
              data={data}
              access_modes={access_modes}
              agentsTypes={agentsTypes}
              mapper={filterMapper}
            />
                </Grid>
            </BrowserRouter>
        </ThemeProvider>
    );
};

PoliciesFiltering.propTypes = {
    /**
* The data that is going to be filtered
*/
    data:  PropTypes.arrayOf(PropTypes.object),
    /**
   * An Object map used to control and read every hook associated with a specific filter read above for more info
   */
     mapper: PropTypes.object,
    /**
    * The possibile values of the access modes displayed on the table
    */
     access_modes: PropTypes.arrayOf(PropTypes.object),

    /**
   * The possibile values of the agents types displayed on the table
  */
     agentsTypes:  PropTypes.arrayOf(PropTypes.object)
};

PoliciesFiltering.defaultProps = {
    data:[],
    mapper:{},
    access_modes:[],
    agentsTypes:[],
};
