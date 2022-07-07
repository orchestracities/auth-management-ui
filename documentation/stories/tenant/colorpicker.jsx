import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import ColorPicker from '../../../src/components/tenant/colorPicker';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import '../../../src/i18n';
import React from 'react';

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
  status: {
    danger: orange[500]
  }
});

export const Colors = ({ defaultValue, mode, setColor, text }) => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Grid>
          <ColorPicker defaultValue={defaultValue} setColor={setColor} mode={mode} text={text}></ColorPicker>
        </Grid>
      </BrowserRouter>
    </ThemeProvider>
  );
};

Colors.propTypes = {
  /**
   * The initial Hex code of the color (should be a react hook )
   */
  defaultValue: PropTypes.string.isRequired,
  /**
   * The callBack function to set the value (should be a react hook )
   */
  setColor: PropTypes.func.isRequired,

  /**
   * The form action
   */
  mode: PropTypes.oneOf(['create', 'modify']),
  /**
   * The text to display inside the selector
   */
  text: PropTypes.string
};

Colors.defaultProps = {
  defaultValue: '#8086ba',
  setColor: () => {},
  mode: '',
  text: 'color choosed: '
};
