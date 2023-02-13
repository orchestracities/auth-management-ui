import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import MapEdit from '../../../src/components/entity/map/mapEditor';
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

export const Map = ({ env, attribute, attributesMap, setAttributesMap, index }) => {
  return (
    <SnackbarProvider maxSnack={5}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Grid>
            <MapEdit
              env={env}
              attribute={attribute}
              attributesMap={attributesMap}
              setAttributesMap={setAttributesMap}
              index={index}
            />
          </Grid>
        </BrowserRouter>
      </ThemeProvider>
    </SnackbarProvider>
  );
};

Map.propTypes = {
  /**
   * the config file passed with the google cloud API
   */
  env: PropTypes.string,
  /**
   * the corrent attribute of the element passed to the map {name:'',type:'',value:''}
   */
  attribute: PropTypes.object,
  /**
   * the array of object with all of the attributes
   */
  attributesMap: PropTypes.arrayOf(PropTypes.object),
  /**
   * the hook function to change the attributeMap
   */
  setAttributesMap: PropTypes.func,
  /**
   * the index of the element inside the attributeMap
   */
  index: PropTypes.object
};

Map.defaultProps = {
  env: {},
  attribute: {},
  attributesMap: [],
  setAttributesMap: () => {},
  index: 0
};
