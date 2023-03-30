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
import useNotification from '../shared/messages/alerts';
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
import MapEdit from './map/mapEditor';
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

export default function EntityDisplay({
  title,
  close,
  setView,
  env,
  data,
  getTheEntities,
  types,
  services,
  GeTenantData,
  entityEndpoint
}) {
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
  const [error, setError] = React.useState(null);
  const [msg, sendNotification] = useNotification();

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
  const [type, setType] = React.useState([]);

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
                error={errorCases(attribute.value)}
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
                <AutoFixNormalIcon
                  sx={{ color: theme.palette.getContrastText(theme.palette.primary.main) }}
                ></AutoFixNormalIcon>
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
                      <GeoJSON
                        key="ID"
                        data={{
                          type: 'FeatureCollection',
                          features: [
                            {
                              type: 'Feature',
                              id: '37',
                              properties: { name: 'North Carolina', density: 198.2 },
                              geometry: {
                                type: 'Polygon',
                                coordinates: [
                                  [
                                    [-80.978661, 36.562108],
                                    [-80.294043, 36.545677],
                                    [-79.510841, 36.5402],
                                    [-75.868676, 36.551154],
                                    [-75.75366, 36.151337],
                                    [-76.032984, 36.189676],
                                    [-76.071322, 36.140383],
                                    [-76.410893, 36.080137],
                                    [-76.460185, 36.025367],
                                    [-76.68474, 36.008937],
                                    [-76.673786, 35.937736],
                                    [-76.399939, 35.987029],
                                    [-76.3616, 35.943213],
                                    [-76.060368, 35.992506],
                                    [-75.961783, 35.899398],
                                    [-75.781044, 35.937736],
                                    [-75.715321, 35.696751],
                                    [-75.775568, 35.581735],
                                    [-75.89606, 35.570781],
                                    [-76.147999, 35.324319],
                                    [-76.482093, 35.313365],
                                    [-76.536862, 35.14358],
                                    [-76.394462, 34.973795],
                                    [-76.279446, 34.940933],
                                    [-76.493047, 34.661609],
                                    [-76.673786, 34.694471],
                                    [-76.991448, 34.667086],
                                    [-77.210526, 34.60684],
                                    [-77.555573, 34.415147],
                                    [-77.82942, 34.163208],
                                    [-77.971821, 33.845545],
                                    [-78.179944, 33.916745],
                                    [-78.541422, 33.851022],
                                    [-79.675149, 34.80401],
                                    [-80.797922, 34.820441],
                                    [-80.781491, 34.935456],
                                    [-80.934845, 35.105241],
                                    [-81.038907, 35.044995],
                                    [-81.044384, 35.149057],
                                    [-82.276696, 35.198349],
                                    [-82.550543, 35.160011],
                                    [-82.764143, 35.066903],
                                    [-83.109191, 35.00118],
                                    [-83.618546, 34.984749],
                                    [-84.319594, 34.990226],
                                    [-84.29221, 35.225734],
                                    [-84.09504, 35.247642],
                                    [-84.018363, 35.41195],
                                    [-83.7719, 35.559827],
                                    [-83.498053, 35.565304],
                                    [-83.251591, 35.718659],
                                    [-82.994175, 35.773428],
                                    [-82.775097, 35.997983],
                                    [-82.638174, 36.063706],
                                    [-82.610789, 35.965121],
                                    [-82.216449, 36.156814],
                                    [-82.03571, 36.118475],
                                    [-81.909741, 36.304691],
                                    [-81.723525, 36.353984],
                                    [-81.679709, 36.589492],
                                    [-80.978661, 36.562108]
                                  ]
                                ]
                              }
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

  const errorCases = (value) => {
    if (error !== null) {
      switch (true) {
        case value === '':
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  };

  return (
    <div key={msg}>
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
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={i} sx={{ marginTop: 1 }}>
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
                          sx={{ color: darken(theme.palette.primary.main, i / 10) }}
                          key={'title' + i}
                        >
                          {attribute.name + ':'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                        <FormControl fullWidth>
                          <InputLabel id={'rowType' + i} error={errorCases(type.type)}>
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
    </div>
  );
}
