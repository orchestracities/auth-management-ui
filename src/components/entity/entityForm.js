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
import FormHelperText from '@mui/material/FormHelperText';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';
import * as log from 'loglevel';
import isURL from 'validator/lib/isURL';
import axios from 'axios';

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function EntityForm({
  title,
  close,
  action,
  token,
  env,
  data,
  getTheEntities,
  types,
  services,
  GeTenantData,
  entityEndpoint
}) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);

  const httpLink = createHttpLink({
    uri: typeof env !== 'undefined' ? env.CONFIGURATION_API_URL : ''
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  const getAttributesNames = (types) => {
    let map = [];
    for (let type of types) {
      map = [...map, ...Object.getOwnPropertyNames(type.attrs)];
    }
    return map;
  };
  //errorLog
  const attributeNames = getAttributesNames(types);
  console.log(attributeNames);
  const [error, setError] = React.useState(null);
  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const handleClose = () => {
    close(false);
  };
  const [service, setService] = React.useState('');
  const [type, setType] = React.useState('');
  const [name, setName] = React.useState('');
  const [endpoint, setEndpoint] = React.useState('');
  const [attributesMap, setAttributesMap] = React.useState([]);
  const createAttributesMap = () => {
    if (action !== 'create') {
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
      return;
    } else {
      return 0;
    }
  };
  React.useEffect(() => {
    createAttributesMap();
  }, []);

  const handleAttributeName = (value, index) => {
    const newArray = attributesMap;
    newArray[Number(index)].name = value;
    setAttributesMap([...[], ...newArray]);
  };
  const handleType = (event) => {
    setType(event.target.value);
  };

  const handleService = (event) => {
    setService(event.target.value);
  };

  const nameCases = () => {
    switch (true) {
      case name === '':
        return 'The name is mandatory';
      case name.indexOf(' ') >= 0:
        return 'The name should be without spaces';
      default:
        return false;
    }
  };

  const linkCases = () => {
    switch (true) {
      case endpoint === '':
        return 'The url is mandatory';
      case endpoint.indexOf(' ') >= 0:
        return 'The url should be without spaces';
      case !isURL(endpoint, { host_whitelist: ['localhost'] }):
        return 'The url should be valid';
      default:
        return false;
    }
  };

  const handleSave = () => {
    if (true) {
      const headers =
        service !== ''
          ? {
              'fiware-Service': GeTenantData('name'),
              //'Authorization': `Bearer ${token}`,
              'fiware-ServicePath': service[service.length - 1] === '/' ? service + '#' : service + '/#'
            }
          : {
              'fiware-Service': GeTenantData('name')
              //'Authorization': `Bearer ${token}`,
            };
      switch (action) {
        case 'create':
          axios
            .post(
              entityEndpoint,
              {
                id: 'urn:ngsi-ld:AirQualityObserved:Tenant2',
                type: 'AirQualityObserved',
                temperature: {
                  type: 'Number',
                  value: 12.2,
                  metadata: {}
                }
              },
              {
                headers: headers
              }
            )
            .then((response) => {
              console.log(response);
            })
            .catch((e) => {
              sendNotification({ msg: e.message, variant: 'error' });
            });
          break;
        case 'modify':
          break;
        default:
          break;
      }
    }
  };
  const errorCases = (value) => {
    if (error !== null) {
      switch (true) {
        case value === '' || typeof value === 'undefined' || value === null:
          return true;
        case value.length === 0:
          return true;
        case value === 'specific' && (agentsMap.length === 0 || agentsMap[0].type === null || agentsMap[0].name === ''):
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  };
  const errorText = (value) => {
    if (error !== null) {
      switch (true) {
        case value === '' || typeof value === 'undefined' || value === null:
          return <Trans>common.errors.mandatory</Trans>;
        case value.length === 0:
          return <Trans>common.errors.mandatory</Trans>;
        case value === 'specific' && (agentsMap.length === 0 || agentsMap[0].type === null || agentsMap[0].name === ''):
          return <Trans>common.errors.userMap</Trans>;
        default:
          return false;
      }
    } else {
      return false;
    }
  };
  return (
    <div>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={3}>
          {action === 'create' ? (
            <>
              <Grid item xs={12}>
                <TextField
                  id="ID"
                  label="ID"
                  variant="outlined"
                  value={'urn:ngsi-ld:' + type + ':' + GeTenantData('name')}
                  disabled
                  sx={{
                    width: '100%'
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id={'service'} error={errorCases(service.path)}>
                    <Trans>entity.form.servicePath</Trans>
                  </InputLabel>
                  <Select
                    color="secondary"
                    labelId={'service'}
                    id={'service'}
                    key={'service'}
                    value={service.path}
                    variant="outlined"
                    onChange={handleService}
                    label={<Trans>entity.form.servicePath</Trans>}
                    input={<OutlinedInput label="Service" />}
                    error={errorCases(service.path)}
                  >
                    {services.map((service) => (
                      <MenuItem key={service.path} value={service.path}>
                        {service.path}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={errorCases(service.path)}>{errorText(service.path)}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id={'types'} error={errorCases(type.type)}>
                    <Trans>entity.form.type</Trans>
                  </InputLabel>
                  <Select
                    color="secondary"
                    labelId={'types'}
                    id={'types'}
                    key={'types'}
                    value={type.type}
                    variant="outlined"
                    onChange={handleType}
                    label={<Trans>entity.form.type</Trans>}
                    input={<OutlinedInput label="Types" />}
                    error={errorCases(type.type)}
                  >
                    {types.map((thisType) => (
                      <MenuItem key={thisType.type} value={thisType.type}>
                        {thisType.type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText error={errorCases(type.type)}>{errorText(type.type)}</FormHelperText>
                </FormControl>
              </Grid>
            </>
          ) : (
            <>
              {attributesMap.map((attribute, i) => (
                <Grid item xs={12}>
                  <TextField
                    id={'name' + i}
                    label="Name"
                    variant="outlined"
                    key={'name' + i}
                    value={attribute.name}
                    onChange={(event) => {
                      handleAttributeName(event.target.value, i);
                    }}
                    sx={{
                      width: '100%'
                    }}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </DialogContent>
    </div>
  );
}
