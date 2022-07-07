import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';
import '../../../src/i18n';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import ButtonToChip from './notificationButton';

/**
 * Primary UI component for user interaction
 */
const theme = createTheme({
  status: {
    danger: orange[500]
  }
});

export const Notification = ({ text, variant }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <ButtonToChip message={text} type={variant} />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

Notification.propTypes = {
  /**
   * The message displayed
   */
  text: PropTypes.string,

  /**
   * The notification type
   */
  variant: PropTypes.oneOf(['default', 'success', 'error', 'warning', 'info'])
};

Notification.defaultProps = {
  text: 'A message',
  variant: 'default'
};
