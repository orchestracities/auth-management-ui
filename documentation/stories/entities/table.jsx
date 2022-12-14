import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import EntitiesTable from '../../../src/components/entities/entitiesTable';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import '../../../src/i18n';
import React from 'react';
import { SnackbarProvider } from 'notistack';

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
  status: {
    danger: orange[500]
  }
});

export const EntitiesTypeTable = ({ data }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <EntitiesTable data={data} />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

EntitiesTypeTable.propTypes = {
  /**
   * the array of values that will be displayed
   */
  data: PropTypes.arrayOf(PropTypes.object)
};

EntitiesTypeTable.defaultProps = {
  data: []
};
