import PropTypes from 'prop-types';
import { MainTitle } from '../../../src/components/shared/mainTitle';
import Grid from '@mui/material/Grid';

/**
 * Primary UI component for user interaction
 */


export const SimpleTitle = ({ mainTitle,
  ...props }) => {


  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <MainTitle mainTitle={mainTitle}></MainTitle>
    </Grid>
  );
};

SimpleTitle.propTypes = {
  /**
    * is a string that can be passed as a value or as a translatedComponent with i18next
    */
  mainTitle: PropTypes.string.isRequired,

};

SimpleTitle.defaultProps = {
  mainTitle: "title",

};
