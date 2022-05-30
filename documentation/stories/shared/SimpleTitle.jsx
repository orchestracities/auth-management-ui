import PropTypes from 'prop-types';
import {MainTitle} from '../../../src/components/shared/mainTitle';

/**
 * Primary UI component for user interaction
 */


export const SimpleTitle = ({ mainTitle,
  ...props }) => {
 

  return (
 <MainTitle mainTitle={mainTitle}></MainTitle>
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
