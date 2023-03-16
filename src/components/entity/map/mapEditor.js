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
import AddLocationIcon from '@mui/icons-material/AddLocation';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from './constants';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VanillaJSONEditor from '../../shared/vanillaJsonEditor';
import { valid } from 'geojson-validation';
import Alert from '@mui/material/Alert';
import { Trans } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import HistoryIcon from '@mui/icons-material/History';
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

const MapEditButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 15,
  marginTop: 15,
  background: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    background: theme.palette.secondary.main
  }
}));

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
  };
  const [geoJSON, setGeoJSON] = React.useState({ json: attribute.value, text: undefined });

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
    return jsonCompressed[0];
  };
  const [tabValue, setTabValue] = React.useState(0);
  const [locationValue, setLocationValue] = React.useState(null);
  const returnCordinates = () => {
    switch (true) {
      //for a geoJSON that is not valid
      case !valid(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text)):
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
  const [key, setKey] = React.useState(returnCordinates());

  React.useEffect(() => {
    if (locationValue !== null) {
      geocodeByAddress(locationValue.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {
          setMapCordinate([lat, lng]);
          setGeoJSON({
            json: compressJSON({
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
            })
          });
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
  const ChangeView = ({ center }) => {
    const map = useMap();
    valid(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text))
      ? new L.GeoJSON(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text), {
          pointToLayer: (latlng) => {
            return L.marker(latlng.geometry.coordinates, {
              icon: icon
            }).addTo(map);
          }
        })
      : '';
    locationValue !== null ? L.marker(mapCordinate, { icon }).addTo(map) : '';
    map.setView(center);
    return null;
  };

  const isResponsive = useMediaQuery(theme.breakpoints.down('sm'));

  const saveTheData = () => {
    const newArray = attributesMap;
    const newData = compressJSON(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text));
    newArray[Number(index)].value = newData;
    valid(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text))
      ? setAttributesMap([...[], ...newArray])
      : '';
    handleClose();
  };

  const goBack = () => {
    setLocationValue(null);
    setGeoJSON({ json: { ...{}, ...attribute.value } });
    setMapCordinate(returnCordinates());
    setKey(key + 1);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Tooltip
          title={
            <Trans
              i18nKey="entity.form.editMAP"
              values={{
                name: attribute.name
              }}
            />
          }
        >
          <MapEditButton aria-label="EditMap" size="large" onClick={handleClickOpen}>
            <AddLocationIcon fontSize="medium" />
          </MapEditButton>
        </Tooltip>
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
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} noWrap gutterBottom variant="h6" component="div">
              {attribute.name}
            </Typography>

            <Button
              autoFocus
              color="secondary"
              onClick={saveTheData}
              disabled={!valid(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text))}
            >
              <Trans>common.saveButton</Trans>
            </Button>
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
              <Grid container spacing={isResponsive ? 1 : 3}>
                <Grid item xs={10}>
                  <GooglePlacesAutocomplete
                    apiKey={env.GOOGLE_MAPS}
                    selectProps={{
                      locationValue,
                      onChange: setLocationValue
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Tooltip title={<Trans i18nKey="entity.form.restore" />}>
                    <IconButton edge="end" color="info" onClick={goBack} aria-label="close">
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item xs={12}>
                  <MapContainer
                    zoom={18}
                    center={mapCordinate}
                    style={{ height: '50vh', zIndex: 0 }}
                    key={key}
                    scrollWheelZoom={true}
                    whenReady={(map) => {
                      map.target.on('click', function (e) {
                        setLocationValue(null);
                        map.target.eachLayer((layer) => {
                          if (typeof layer['_latlng'] !== 'undefined') layer.remove();
                        });
                        const { lat, lng } = e.latlng;
                        L.marker([lat, lng], { icon }).addTo(map.target);
                        setGeoJSON({
                          json: compressJSON({
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
                          })
                        });
                      });
                      return null;
                    }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ChangeView center={mapCordinate} />
                    {valid(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text)) ? (
                      <GeoJSON key="ID" data={geoJSON.json} />
                    ) : (
                      ''
                    )}
                  </MapContainer>
                </Grid>
              </Grid>{' '}
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={isResponsive ? 1 : 3}>
                <Grid item xs={12}>
                  <VanillaJSONEditor
                    key={index}
                    content={geoJSON}
                    readOnly={false}
                    onChange={(value) => {
                      setGeoJSON(value);
                    }}
                  />
                  {!valid(loadJSON(typeof geoJSON.json !== 'undefined' ? geoJSON.json : geoJSON.text)) ? (
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
