import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import EntityDisplay from '../../../src/components/entity/entityDisplay';
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

export const Display = ({
  title,
  close,
  data,
  types,
  setView
}) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <EntityDisplay
              title={title}
              close={close}
              data={data}
              types={types}
              setView={setView}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

Display.propTypes = {
  /**
   * The Titile that is going to be displayed inside the form
   */
  title: PropTypes.string,
  /**
   * The callBack function after the modal data is saved (should be a react hook )
   */
  close: PropTypes.func,
  /**
   * The policy data that should be modified
   */
  data: PropTypes.object,
  /**
   * the array of object with all of the attributes types
   */
  types: PropTypes.arrayOf(PropTypes.object),
  /**
   * The function to switch to the edit mode of the form
   */
  setView: PropTypes.func
};

Display.defaultProps = {
  title: 'Title',
  close: () => {},
  data: {},
  types: [],
  setView: () => {}
};
