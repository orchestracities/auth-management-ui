import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import EntityFilters from '../../../src/components/entity/entityFilter';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import '../../../src/i18n';
import * as React from 'react';

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
  status: {
    danger: orange[500]
  }
});

export const EntityFiltering = ({ types, services }) => {
  //FILTER PART
  const [servicePath, setServicePath] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const filterMapper = {
    servicePath: {
      value: servicePath,
      set: setServicePath
    },
    type: {
      value: type,
      set: setType
    },
    date: {
      value: date,
      set: setDate
    }
  };

  return (
    <ThemeProvider theme={theme} id="filterContainer">
      <BrowserRouter>
        <Grid>
          <EntityFilters id="filterContainer" services={services} mapper={filterMapper} types={types} />
        </Grid>
      </BrowserRouter>
    </ThemeProvider>
  );
};

EntityFiltering.propTypes = {
  /**
   * An Object map used to control and read every hook associated with a specific filter read above for more info
   */
  mapper: PropTypes.object,
  /**
   * The possibile values of the services displayed on the table
   */
  services: PropTypes.arrayOf(PropTypes.object),
  /**
   * The possibile values of the types displayed on the table
   */
  types: PropTypes.arrayOf(PropTypes.object)
};

EntityFiltering.defaultProps = {
  data: [],
  mapper: {},
  services: [],
  types: []
};
