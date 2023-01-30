import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { MapContainer, TileLayer, useMap, MapConsumer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from './constants';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { JsonEditor } from 'jsoneditor-react';
import { valid } from 'geojson-validation';
import Alert from '@mui/material/Alert';
import { Trans } from 'react-i18next';
const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));
const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function MapEdit({ env, attribute, attributesMap, setAttributesMap, index }) {
  const [open, setOpen] = React.useState(false);
  const loadJSON = (data) => {
    if (typeof data.length !== 'undefined' && data !== '') {
      let loaded = {
        type: 'FeatureCollection'
      };
      for (const [i, v] of data.entries()) {
        loaded[i.toString()] = [
          {
            type: 'Feature',
            id: i,
            properties: {
              Code: '',
              Name: ''
            },
            geometry: v
          }
        ];
      }
      return loaded;
    } else {
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            id: 0,
            properties: {
              Code: '',
              Name: ''
            },
            geometry: data
          }
        ]
      };
    }
  };
  const [geoJSON, setGeoJSON] = React.useState(loadJSON(attribute.value));

  const compressJSON = (data) => {
    const properties = Object.getOwnPropertyNames(data);
    let jsonCompressed = [];
    for (const entry of properties) {
      if (typeof data[entry] === 'object') {
        if (typeof data[entry].length !== 'undefined') {
          for (let newEntry of data[entry]) {
            typeof newEntry.geometry !== 'undefined' ? jsonCompressed.push(newEntry.geometry) : '';
          }
        } else {
          typeof data[entry].geometry !== 'undefined' ? jsonCompressed.push(data[entry].geometry) : '';
        }
      }
    }
    return jsonCompressed;
  };
  const [tabValue, setTabValue] = React.useState(0);
  const [locationValue, setLocationValue] = React.useState(null);
  const returnCordinates = () => {
    switch (true) {
      //for a geoJSON that is not valid
      case !valid(geoJSON):
        return [47.373878, 8.545094];
      //for a missed or default value
      case attribute.value === '':
        return [47.373878, 8.545094];
      //for a JSON that has multiple features but only one coordinate
      case typeof attribute.value.length !== 'undefined' && typeof attribute.value[0].coordinates[0] === 'number':
        return attribute.value[0].coordinates;
      //for a JSON that has multiple features and multiple coordinates
      case typeof attribute.value.length !== 'undefined' && typeof attribute.value[0].coordinates !== 'number':
        return attribute.value[0].coordinates[0];
      //for a JSON that has a single feature and only one coordinate
      case typeof attribute.value.length === 'undefined' && typeof attribute.value.coordinates[0] === 'number':
        return attribute.value.coordinates;
      //for a JSON that has a single feature but multiple coordinates
      case typeof attribute.value.length === 'undefined' && typeof attribute.value.coordinates !== 'number':
        return attribute.value.coordinates[0];
      //default
      default:
        return [47.373878, 8.545094];
    }
  };
  const [mapCordinate, setMapCordinate] = React.useState(returnCordinates());

  React.useEffect(() => {
    if (locationValue !== null) {
      geocodeByAddress(locationValue.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setMapCordinate([lat, lng]);
          setGeoJSON({
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                id: 0,
                properties: {
                  Code: '',
                  Name: ''
                },
                geometry: {
                  type: 'Point',
                  coordinates: [lat, lng]
                }
              }
            ]
          });
          const newArray = attributesMap;
          newArray[Number(index)].value = {
            type: 'Point',
            coordinates: [lat, lng]
          };
          valid(geoJSON) ? setAttributesMap([...[], ...newArray]) : '';
        });
    }
  }, [locationValue]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    valid(geoJSON)
      ? new L.GeoJSON(geoJSON, {
          pointToLayer: (latlng) => {
            return L.marker(latlng.geometry.coordinates, {
              icon: icon
            }).addTo(map);
          }
        })
      : '';
    locationValue !== null ? L.marker(mapCordinate, { icon }).addTo(map) : '';
    map.setView(center, zoom);
    return null;
  };
  return (
    <>
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<AutoFixNormalIcon />}
          onClick={() => {
            handleClickOpen();
          }}
        >
          <Trans
            i18nKey="entity.form.editMAP"
            values={{
              name: attribute.name
            }}
          />
        </Button>
      </Grid>
      <DialogRounded
        TransitionComponent={Transition}
        open={open}
        fullScreen={fullScreen}
        maxWidth={'xl'}
        fullWidth={true}
        onClose={handleClose}
      >
        <CustomDialogTitle>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </CustomDialogTitle>
        <DialogContent sx={{ minHeight: '400px' }}>
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                <Tab label="Map" {...a11yProps(0)} />
                <Tab label="JSON" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <GooglePlacesAutocomplete
                    apiKey={env.GOOGLE_MAPS}
                    selectProps={{
                      locationValue,
                      onChange: setLocationValue
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MapContainer zoom={18} style={{ height: '50vh', zIndex: 0 }}>
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ChangeView center={mapCordinate} zoom={18} />
                    {valid(geoJSON) ? <GeoJSON key="ID" data={geoJSON} /> : ''}
                    <MapConsumer>
                      {(map) => {
                        map.on('click', function (e) {
                          setLocationValue(null);
                          map.eachLayer((layer) => {
                            if (typeof layer['_latlng'] !== 'undefined') layer.remove();
                          });
                          const { lat, lng } = e.latlng;
                          L.marker([lat, lng], { icon }).addTo(map);

                          const newArray = attributesMap;
                          newArray[Number(index)].value = {
                            type: 'Point',
                            coordinates: [lat, lng]
                          };
                          setGeoJSON({
                            type: 'FeatureCollection',
                            features: [
                              {
                                type: 'Feature',
                                id: 0,
                                properties: {
                                  Code: '',
                                  Name: ''
                                },
                                geometry: {
                                  type: 'Point',
                                  coordinates: [lat, lng]
                                }
                              }
                            ]
                          });
                          valid(geoJSON) ? setAttributesMap([...[], ...newArray]) : '';
                        });
                        return null;
                      }}
                    </MapConsumer>
                  </MapContainer>
                </Grid>
              </Grid>{' '}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <JsonEditor
                    htmlElementProps={{ style: { height: '300px' } }}
                    key={index}
                    value={geoJSON}
                    onChange={(value) => {
                      const newArray = attributesMap;
                      const newData = compressJSON(value);
                      newArray[Number(index)].value = newData;
                      setGeoJSON(value);
                      valid(geoJSON) ? setAttributesMap([...[], ...newArray]) : '';
                    }}
                  />
                  {!valid(geoJSON) ? (
                    <Alert
                      variant="filled"
                      severity="info"
                      sx={{
                        bottom: '0px',
                        width: '100%',
                        padding: '0.5px 30px',
                        fontSize: '0.75rem',
                        zIndex: 1201
                      }}
                      icon={false}
                    >
                      <Trans>entity.form.geoJSONerror</Trans>
                    </Alert>
                  ) : (
                    ''
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  );
}
