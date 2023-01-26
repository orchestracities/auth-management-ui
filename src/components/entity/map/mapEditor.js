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
import { MapContainer, TileLayer, useMap, MapConsumer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from './constants';

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function MapEdit({ env, attribute, attributesMap, setAttributesMap, index }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [mapCordinate, setMapCordinate] = React.useState([47.373878, 8.545094]);

  React.useEffect(() => {
    value !== null
      ? geocodeByAddress(value.label)
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => setMapCordinate([lat, lng ]))
      : '';
  }, [value]);
  React.useEffect(() => {
   console.log(mapCordinate)
  }, [mapCordinate]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const ChangeView=({ center, zoom })=>{
    const map = useMap();
    value !== null? L.marker(mapCordinate, { icon }).addTo(map):"";
    map.setView(center, zoom);
    return null;
  }
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
          {'Edit Location of: '}
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
        <Grid container spacing={3}>
        <Grid item xs={12}>
          <GooglePlacesAutocomplete
            apiKey={env.GOOGLE_MAPS}
            selectProps={{
              value,
              onChange: setValue
            }}
          />
          </Grid>
          <Grid item xs={12}>
          <MapContainer
            center={mapCordinate}
            zoom={13}
            style={{ height: '50vh',zIndex:0 }}
           
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
              <ChangeView  center={mapCordinate} zoom={  value !== null?18:13} /> 
            <MapConsumer>
              {(map) => {

                map.on('click', function (e) {
                  setValue(null)
                  map.eachLayer((layer) => {
                    if (typeof layer['_latlng'] !== "undefined")
                      layer.remove();
                  });
                  const { lat, lng } = e.latlng;
                  L.marker([lat, lng], { icon }).addTo(map);
                });
                return null;
              }}
            </MapConsumer>
          </MapContainer>
          </Grid>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  );
}
