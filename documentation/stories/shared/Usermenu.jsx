import PropTypes from 'prop-types';
import UserMenu from '../../../src/components/shared/userMenu';
import Grid from '@mui/material/Grid';
import React from 'react';
import { SnackbarProvider } from 'notistack';
import '../../../src/i18n';

/**
 * Primary UI component for user interaction
 */

export const UsrMenu = ({ language, userData, token }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <Grid>
        <UserMenu token={token} language={language} userData={userData}></UserMenu>
      </Grid>
    </SnackbarProvider>
  );
};

UsrMenu.propTypes = {
  /**
   * An object with 2 properties one is the language and another is the function to set the language
   */
  language: PropTypes.object,
  /**
   * The authentication Token decoded with the correntUser data inside it
   */
  userData: PropTypes.object,
  /**
   * The authentication Token
   */
  token: PropTypes.string
};

UsrMenu.defaultProps = {
  language: { language: 'en', setLanguage: () => {} },
  userData: { name: 'EasterEgg' },
  token: undefined
};
