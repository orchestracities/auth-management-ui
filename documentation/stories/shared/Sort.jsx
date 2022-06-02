import PropTypes from 'prop-types';
import SortButton from '../../../src/components/shared/sortButton';
import Grid from '@mui/material/Grid';

/**
 * Primary UI component for user interaction
 */


export const Sort = ({ data,
    id,
    sortData,
  ...props }) => {
 

  return (
    <Grid
  >
    <SortButton
    data={data}
    id={id}
    sortData={sortData}
  ></SortButton>
  </Grid>
  );
};

Sort.propTypes = {
 /**
   * The array of Objects that needs to be sorted
   */
    data: PropTypes.arrayOf(PropTypes.object),
 /**
   * The main property of the objects that will define the order
   */
    id: PropTypes.oneOf(['path', 'name']),
 /**
   * The callBack function after the sort (should be a react hooks )
   */
    sortData:PropTypes.func,

};

Sort.defaultProps = {
    data:[],
    id:undefined,
    sortData:undefined
};
