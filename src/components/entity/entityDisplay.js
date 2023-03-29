import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
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
import FormHelperText from '@mui/material/FormHelperText';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';
import axios from 'axios';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputAdornment from '@mui/material/InputAdornment';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ClearIcon from '@mui/icons-material/Clear';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import JsonEdit from './jsonEditor';
import MapEdit from './map/mapEditor';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

const CustomSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
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
    const action="modify"
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
  const [service, setService] = React.useState('');
  const [id, setId] = React.useState('');
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
  const addEntities = () => {
    setAttributesMap([...[{ name: '', type: 'Number', value: '' }], ...attributesMap]);
  };
  const removeEntities = (index) => {
    const newArray = attributesMap;
    newArray.splice(index, 1);
    setAttributesMap([...[], ...newArray]);
  };
  const handleAttributeName = (value, index) => {
    const newArray = attributesMap;
    newArray[Number(index)].name = value;
    setAttributesMap([...[], ...newArray]);
  };
  const handleAttributeType = (value, index) => {
    const newArray = attributesMap;
    newArray[Number(index)].type = value;
    newArray[Number(index)].value = '';
    setAttributesMap([...[], ...newArray]);
  };
  const handlePropagation = (e) => {
    e.stopPropagation();
  };
  const attributeTypeForm = (attribute, index) => {
    switch (attribute.type !== '' && typeof attribute.type !== 'undefined' && attribute.type !== null) {
      case attribute.type === 'Number':
        return (
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <TextField
             disabled
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
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={Intl.NumberFormat().resolvedOptions().locale}
            >
              <MobileDateTimePicker
                id={'dateInput' + index}
                key={'dateInput' + index}
                showToolbar={false}
                value={attribute.value === '' ? new Date() : attribute.value}
                onChange={(newValue) => {
                  const newArray = attributesMap;
                  newArray[Number(index)].value = newValue;
                  setAttributesMap([...[], ...newArray]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" onClick={handlePropagation}>
                          <ClearIcon
                            color="secondary"
                            onClick={() => {
                              const newArray = attributesMap;
                              newArray[Number(index)].value = null;
                              setAttributesMap([...[], ...newArray]);
                            }}
                            sx={{ '&:hover': { cursor: 'pointer' } }}
                          />
                        </InputAdornment>
                      ),
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTimeIcon color="secondary"></AccessTimeIcon>
                        </InputAdornment>
                      )
                    }}
                    error={errorCases(attribute.value)}
                    sx={{
                      width: '100%'
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        );
      case attribute.type === 'Boolean':
        return (
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={0}>
              <FormControlLabel
                key={'switch' + index}
                id={'switch' + index}
                control={
                  <CustomSwitch
                    defaultChecked
                    onChange={(event) => {
                      const newArray = attributesMap;
                      newArray[Number(index)].value = event.target.checked;
                      setAttributesMap([...[], ...newArray]);
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        );
      case attribute.type === 'Text':
        return (
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <TextField
              id="Text"
              variant="outlined"
              value={attribute.value}
              onChange={(event) => {
                const newArray = attributesMap;
                newArray[Number(index)].value = event.target.value;
                setAttributesMap([...[], ...newArray]);
              }}
              sx={{
                width: '100%'
              }}
              error={errorCases(attribute.value)}
            />
          </Grid>
        );
      case attribute.type === 'StructuredValue':
        return (
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <JsonEdit
              attribute={attribute}
              attributesMap={attributesMap}
              setAttributesMap={setAttributesMap}
              index={index}
            ></JsonEdit>
          </Grid>
        );
      case attribute.type === 'geo:json':
        return (
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <MapEdit
              env={env}
              attribute={attribute}
              attributesMap={attributesMap}
              setAttributesMap={setAttributesMap}
              index={index}
            ></MapEdit>
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

  const attributeNameHelper = (value) => {
    switch (true) {
      case value === '':
        return <Trans>common.errors.mandatory</Trans>;
      case !isNaN(Number(value[0])):
        return 'FirstChar should not be a Number';
      case value.length > 256:
        setError(true);
        return 'String too long';
      case !/^[a-zA-Z0-9-]+$/.test(value):
        return 'The string contains charts that are not allowed';
      default:
        return value.length + '/' + 256;
    }
  };
  const theme = useTheme();
  const isResponsive = useMediaQuery(theme.breakpoints.down('sm'));

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
          <Button autoFocus color="info" onClick={()=>setView(false)}>
            <Trans>common.editButton</Trans>
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={1}>
            <>
              {attributesMap.map((attribute, i) => (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} key={i} sx={{ marginTop: 1}}>
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
                          <Typography variant="h6" gutterBottom component="div" color="primary">
                          {attribute.name+ ":"}
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
