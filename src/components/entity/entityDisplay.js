import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { InputLabel } from '@mui/material';
import Select from '@mui/material/Select';
import { Trans } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputAdornment from '@mui/material/InputAdornment';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import dayjs from 'dayjs';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { darken } from '@mui/material';
import { lighten } from '@mui/material';
import PinIcon from '@mui/icons-material/Pin';
import TextsmsIcon from '@mui/icons-material/Textsms';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import VanillaJSONEditor from '../shared/vanillaJsonEditor';
import ListItemText from '@mui/material/ListItemText';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from './map/constants';
import AddLocationIcon from '@mui/icons-material/AddLocation';

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    opacity: '0.3 !important',
    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16
    },
    '&:before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12
    },
    '&:after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2
  }
}));

const DisplayCollapse = ({ component, icon }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <List sx={{ width: '100%' }}>
      <ListItemButton
        onClick={handleClick}
        sx={{ background: lighten(theme.palette.primary.main, 0.55), borderRadius: 3 }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary="" />
        {open ? (
          <ExpandLess sx={{ color: theme.palette.getContrastText(theme.palette.primary.main) }} />
        ) : (
          <ExpandMore sx={{ color: theme.palette.getContrastText(theme.palette.primary.main) }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <DialogContent sx={{ minHeight: '200px' }}>{component}</DialogContent>
      </Collapse>
    </List>
  );
};

export default function EntityDisplay({ title, close, setView, data, types }) {
  const theme = useTheme();
  const isResponsive = useMediaQuery(theme.breakpoints.down('sm'));
  const getAttributesNames = (types) => {
    let map = [];
    for (let type of types) {
      map = [...map, ...Object.getOwnPropertyNames(type.attrs)];
    }
    return map;
  };
  //errorLog
  const attributeNames = getAttributesNames(types);

  const handleClose = () => {
    close(false);
  };
  const rowTypes = [
    { text: <Trans>entity.form.selectType.number</Trans>, id: 'Number' },
    { text: <Trans>entity.form.selectType.date</Trans>, id: 'DateTime' },
    { text: <Trans>entity.form.selectType.bool</Trans>, id: 'Boolean' },
    { text: <Trans>entity.form.selectType.text</Trans>, id: 'Text' },
    { text: <Trans>entity.form.selectType.json</Trans>, id: 'StructuredValue' },
    { text: <Trans>entity.form.selectType.map</Trans>, id: 'geo:json' }
  ];
  //Type

  const [attributesMap, setAttributesMap] = React.useState([]);
  const createAttributesMap = () => {
    let map = [];
    const attributes = Object.getOwnPropertyNames(data)
      .filter((value) => attributeNames.includes(value))
      .filter(function (e, i, c) {
        return c.indexOf(e) === i;
      });
    for (let attribute of attributes) {
      map.push({ name: attribute, type: data[attribute].type, value: data[attribute].value });
    }
    setAttributesMap(map);
    return 0;
  };
  React.useEffect(() => {
    createAttributesMap();
  }, []);

  const returnCordinates = (attribute) => {
    switch (true) {
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

  const ChangeView = ({ attribute }) => {
    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 0,
          properties: {
            Code: '',
            Name: ''
          },
          geometry: attribute.value
        }
      ]
    };
    const map = useMap();
    new L.GeoJSON(geoJSON),
      {
        pointToLayer: (latlng) => {
          return L.marker(latlng.geometry.coordinates, {
            icon: icon
          }).addTo(map);
        }
      };
    L.marker(returnCordinates(attribute), { icon }).addTo(map);
    return null;
  };

  const attributeTypeForm = (attribute, index) => {
    switch (attribute.type !== '' && typeof attribute.type !== 'undefined' && attribute.type !== null) {
      case attribute.type === 'Number':
        return (
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
            <TextField
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PinIcon sx={{ color: darken(theme.palette.secondary.main, index / 10) }}></PinIcon>
                  </InputAdornment>
                )
              }}
              id={'Number' + index}
              variant="outlined"
              key={'Number' + index}
              value={attribute.value}
              type="number"
              sx={{
                width: '100%'
              }}
            />
          </Grid>
        );
      case attribute.type === 'DateTime':
        return (
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={Intl.NumberFormat().resolvedOptions().locale}
            >
              <MobileDateTimePicker
                id={'dateInput' + index}
                key={'dateInput' + index}
                disabled
                showToolbar={false}
                value={attribute.value === '' ? dayjs() : dayjs(attribute.value)}
                onChange={(newValue) => {
                  const newArray = attributesMap;
                  newArray[Number(index)].value = newValue;
                  setAttributesMap([...[], ...newArray]);
                }}
                slotProps={{
                  field: {
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon
                            sx={{ color: darken(theme.palette.secondary.main, index / 10) }}
                          ></AccessTimeIcon>
                        </InputAdornment>
                      )
                    }
                  }
                }}
                sx={{
                  width: '100%'
                }}
              />
            </LocalizationProvider>
          </Grid>
        );
      case attribute.type === 'Boolean':
        return (
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={0}>
              <FormControl component="fieldset" variant="standard">
                <FormControlLabel
                  key={'switch' + index}
                  id={'switch' + index}
                  control={<CustomSwitch defaultChecked={attribute.value} color="info" disabled />}
                />
              </FormControl>
            </Grid>
          </Grid>
        );
      case attribute.type === 'Text':
        return (
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
            <TextField
              id="Text"
              disabled
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TextsmsIcon sx={{ color: darken(theme.palette.secondary.main, index / 10) }}></TextsmsIcon>
                  </InputAdornment>
                )
              }}
              value={attribute.value}
              sx={{
                width: '100%'
              }}
            />
          </Grid>
        );
      case attribute.type === 'StructuredValue':
        return (
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
            <DisplayCollapse
              key={'json' + index}
              icon={
                <AutoFixNormalIcon
                  sx={{ color: theme.palette.getContrastText(theme.palette.primary.main) }}
                ></AutoFixNormalIcon>
              }
              component={
                <Grid container maxWidth="xl" direction="row" justifyContent="center" alignItems="center">
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <VanillaJSONEditor
                      content={
                        attribute.value !== ''
                          ? {
                              json: attribute.value,
                              text: undefined
                            }
                          : {
                              json: {},
                              text: undefined
                            }
                      }
                      readOnly={true}
                    />
                  </Grid>
                </Grid>
              }
            />
          </Grid>
        );
      case attribute.type === 'geo:json':
        return (
          <Grid item xs={12} sm={12} md={10} lg={10} xl={10}>
            <DisplayCollapse
              key={'map' + index}
              icon={
                <AddLocationIcon
                  sx={{ color: theme.palette.getContrastText(theme.palette.primary.main) }}
                ></AddLocationIcon>
              }
              component={
                <Grid container maxWidth="xl" direction="row" justifyContent="center" alignItems="center">
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <MapContainer
                      zoom={18}
                      center={returnCordinates(attribute)}
                      style={{ height: '25vh', zIndex: 0 }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <ChangeView attribute={attribute} />
                      <GeoJSON
                        key="ID"
                        data={{
                          type: 'FeatureCollection',
                          features: [
                            {
                              type: 'Feature',
                              id: 0,
                              properties: {
                                Code: '',
                                Name: ''
                              },
                              geometry: attribute.value
                            }
                          ]
                        }}
                      />
                    </MapContainer>
                  </Grid>
                </Grid>
              }
            />
          </Grid>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'black' }} noWrap gutterBottom variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="info" onClick={() => setView(false)}>
            <Trans>common.editButton</Trans>
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={1}>
          <>
            {attributesMap.map((attribute, i) => (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={i} sx={{ marginTop: 2.5 }}>
                <Grid
                  container
                  spacing={isResponsive ? 1 : 3}
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          component="div"
                          sx={{ color: darken(theme.palette.primary.main, i / 15) }}
                          key={'title' + i}
                        >
                          {attribute.name + ':'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <FormControl fullWidth>
                          <InputLabel id={'rowType' + i}>
                            <Trans>entity.form.type</Trans>
                          </InputLabel>
                          <Select
                            disabled
                            color="secondary"
                            labelId={'rowType' + i}
                            id={'rowType' + i}
                            key={'rowType' + i}
                            value={attribute.type}
                            variant="outlined"
                            label={<Trans>entity.form.type</Trans>}
                            input={<OutlinedInput label="Types" />}
                          >
                            {rowTypes.map((thisType) => (
                              <MenuItem key={thisType.id} value={thisType.id}>
                                {thisType.text}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      {attributeTypeForm(attribute, i)}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </>
        </Grid>
      </DialogContent>
    </>
  );
}
