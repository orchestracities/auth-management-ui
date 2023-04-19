import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import AlarmCard from '../../../src/components/alarms/alarmCard';
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

export const AlarmsCard = ({ pageType, data, getData, colors, env, token, language }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <AlarmCard
              pageType={pageType}
              data={data}
              colors={colors}
              getData={getData}
              env={env}
              token={token}
              language={language}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

AlarmsCard.propTypes = {
  /**
   * is the element that will be rendered inside the modal, can only be a AlarmForm with "Modify" as action
   */
  pageType: PropTypes.any,
  /**
   * The object with the data
   */
  data: PropTypes.object,
  /**
   * The primary and secondary color of the card es:{secondaryColor:"#3c49d0",primaryColor:"#3c49d0"}
   */
  colors: PropTypes.object,
  /**
   * The callBack function after the modal data is saved (should be a react hook )
   */
  getData: PropTypes.func,
  /**
   * the config file passed
   */
  env: PropTypes.object,
  /**
   * the session token
   */
  token: PropTypes.string,
  /**
   * the corrent language selected by the user
   */
  language: PropTypes.string
};

AlarmsCard.defaultProps = {
  pageType: <></>,
  data: {},
  colors: { secondaryColor: '', primaryColor: '' },
  getData: undefined,
  env: undefined,
  token: '',
  language: 'en'
};
