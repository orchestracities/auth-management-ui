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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FormHelperText from '@mui/material/FormHelperText';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import * as log from 'loglevel';
import isEmail from 'validator/lib/isEmail';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function AlarmForm({
  title,
  close,
  action,
  getAlarms,
  GeTenantData,
  services,
  env,
  types,
  token,
  data
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
    cache: new InMemoryCache({ addTypename: false })
  });
  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const handleClose = () => {
    close(false);
  };

  const [alarmType, setAlarmType] = React.useState(action === 'create' ? 'entity' : data.alarm_type);
  const [pathSelected, setPathSelected] = React.useState(action === 'create' ? null : { path: data.servicepath });
  const [entityType, setEntityType] = React.useState(action === 'create' ? {} : { type: data.entity_type });
  const [channel, setChannel] = React.useState(action === 'create' ? 'email' : data.channel_type);
  const [maxTime, setMaxTime] = React.useState(action === 'create' ? 1 : data.max_time_since_last_update);
  const [timeUnit, setTimeUnit] = React.useState(action === 'create' ? 'd' : data.time_unit);
  const [minTime, setMinTime] = React.useState(action === 'create' ? 1 : data.alarm_frequency_time);
  const [frequency, setFrequency] = React.useState(action === 'create' ? 'd' : data.alarm_frequency_time_unit);

  const [channelDestination, setChannelDestination] = React.useState(
    action === 'create' ? [] : data.channel_destination
  );
  const servicePathForm = {
    pathSelected: {
      value: pathSelected,
      set: setPathSelected
    },
    entityType: {
      value: entityType,
      set: setEntityType
    },
    channel: {
      value: channel,
      set: setChannel
    },
    channelDestination: {
      value: channelDestination,
      set: setChannelDestination
    },
    maxTime: {
      value: maxTime,
      set: setMaxTime
    },
    timeUnit: {
      value: timeUnit,
      set: setTimeUnit
    },
    minTime: {
      value: minTime,
      set: setMinTime
    },
    frequency: {
      value: frequency,
      set: setFrequency
    }
  };
  const [entityID, setEntityID] = React.useState(action === 'create' ? null : { id: data.entity_id });
  React.useEffect(() => {
    alarmType === 'entity' && entityID !== null && typeof entityID.type !== 'undefined'
      ? setEntityType({ type: entityID.type })
      : '';
  }, [entityID]);

  const entityForm = {
    pathSelected: {
      value: pathSelected,
      set: setPathSelected
    },
    entityType: {
      value: entityType,
      set: setEntityType
    },
    channel: {
      value: channel,
      set: setChannel
    },
    channelDestination: {
      value: channelDestination,
      set: setChannelDestination
    },
    maxTime: {
      value: maxTime,
      set: setMaxTime
    },
    timeUnit: {
      value: timeUnit,
      set: setTimeUnit
    },
    minTime: {
      value: minTime,
      set: setMinTime
    },
    frequency: {
      value: frequency,
      set: setFrequency
    },
    entityID: {
      value: entityID,
      set: setEntityID
    }
  };

  const [entities, setEntities] = React.useState([]);
  React.useEffect(() => {
    setEntities([]);
  }, [pathSelected]);

  const getEntityURL = () => {
    client
      .query({
        query: gql`
          query getTenantResourceType($tenantName: String!, $skip: Int!, $limit: Int!) {
            getTenantResourceType(tenantName: $tenantName, skip: $skip, limit: $limit) {
              data {
                name
                userID
                tenantName
                endpointUrl
                ID
              }
              count
            }
          }
        `,
        variables: { tenantName: GeTenantData('name'), skip: 0, limit: 0 }
      })
      .then((response) => {
        let filtered = response.data.getTenantResourceType.data.filter((e) => e.name === 'entity');
        filtered.length > 0
          ? getEntitiesFromResource(
              filtered[0].endpointUrl.slice(0, filtered[0].endpointUrl.indexOf('?')) +
                '?attrs=dateCreated,dateModified,*&offset=' +
                entities.length +
                '&limit=' +
                100 +
                '&options=count'
            )
          : getEntitiesFromResource(
              env.ORION +
                '/v2/entities?attrs=dateCreated,dateModified,*&offset=' +
                entities.length +
                '&limit=' +
                100 +
                '&options=count'
            );
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  const getEntitiesFromResource = (entityUrl) => {
    const headers = {
      'fiware-Service': GeTenantData('name'),
      //'Authorization': `Bearer ${token}`,
      'fiware-ServicePath': pathSelected === null ? '/' : pathSelected.path
    };
    axios
      .get(entityUrl, {
        headers: headers
      })
      .then((response) => {
        entities.length < response.headers['fiware-total-count'] ? setEntities([...entities, ...response.data]) : '';
      })
      .catch((e) => {
        sendNotification({ msg: e.message, variant: 'error' });
      });
  };

  const handleSave = () => {
    if (
      channelDestination.length > 0 &&
      [alarmType, pathSelected.path, entityType.type, channel, timeUnit, maxTime, frequency, minTime].find(
        (element) => element === ''
      ) === undefined
    ) {
      switch (action) {
        case 'create':
          client
            .mutate({
              mutation: gql`
                mutation newAlarm(
                  $alarm_type: String!
                  $tenant: String!
                  $servicepath: String!
                  $entity_id: String!
                  $entity_type: String!
                  $channel_type: String!
                  $channel_destination: [String]!
                  $time_unit: String!
                  $max_time_since_last_update: Int!
                  $alarm_frequency_time_unit: String!
                  $alarm_frequency_time: Int!
                  $time_of_last_alarm: String!
                  $status: String!
                ) {
                  newAlarm(
                    alarm_type: $alarm_type
                    tenant: $tenant
                    servicepath: $servicepath
                    entity_id: $entity_id
                    entity_type: $entity_type
                    channel_type: $channel_type
                    channel_destination: $channel_destination
                    time_unit: $time_unit
                    max_time_since_last_update: $max_time_since_last_update
                    alarm_frequency_time_unit: $alarm_frequency_time_unit
                    alarm_frequency_time: $alarm_frequency_time
                    time_of_last_alarm: $time_of_last_alarm
                    status: $status
                  ) {
                    id
                    alarm_type
                    tenant
                    servicepath
                    entity_id
                    entity_type
                    channel_type
                    channel_destination
                    time_unit
                    max_time_since_last_update
                    alarm_frequency_time_unit
                    alarm_frequency_time
                    time_of_last_alarm
                    status
                  }
                }
              `,
              variables: {
                alarm_type: alarmType,
                tenant: GeTenantData('name'),
                servicepath: pathSelected.path,
                entity_id: alarmType === 'entity' ? entityID.id : '',
                entity_type: entityType.type,
                channel_type: channel,
                channel_destination: channelDestination,
                time_unit: timeUnit,
                max_time_since_last_update: Number(maxTime),
                alarm_frequency_time_unit: frequency,
                alarm_frequency_time: Number(minTime),
                time_of_last_alarm: new Date().toString(),
                status: 'active'
              }
            })
            .then(() => {
              getAlarms();
              close(false);
              sendNotification({
                msg: (
                  <Trans
                    i18nKey="common.messages.sucessCreate"
                    values={{
                      data: 'Alert'
                    }}
                  />
                ),
                variant: 'success'
              });
            })
            .catch((e) => {
              sendNotification({ msg: e.message + ' the config', variant: 'error' });
            });

          break;
        case 'edit':
          client
            .mutate({
              mutation: gql`
                mutation modifyAlarm(
                  $id: String!
                  $alarm_type: String!
                  $tenant: String!
                  $servicepath: String!
                  $entity_id: String!
                  $entity_type: String!
                  $channel_type: String!
                  $channel_destination: [String]!
                  $time_unit: String!
                  $max_time_since_last_update: Int!
                  $alarm_frequency_time_unit: String!
                  $alarm_frequency_time: Int!
                  $time_of_last_alarm: String!
                  $status: String!
                ) {
                  modifyAlarm(
                    id: $id
                    alarm_type: $alarm_type
                    tenant: $tenant
                    servicepath: $servicepath
                    entity_id: $entity_id
                    entity_type: $entity_type
                    channel_type: $channel_type
                    channel_destination: $channel_destination
                    time_unit: $time_unit
                    max_time_since_last_update: $max_time_since_last_update
                    alarm_frequency_time_unit: $alarm_frequency_time_unit
                    alarm_frequency_time: $alarm_frequency_time
                    time_of_last_alarm: $time_of_last_alarm
                    status: $status
                  ) {
                    id
                    alarm_type
                    tenant
                    servicepath
                    entity_id
                    entity_type
                    channel_type
                    channel_destination
                    time_unit
                    max_time_since_last_update
                    alarm_frequency_time_unit
                    alarm_frequency_time
                    time_of_last_alarm
                    status
                  }
                }
              `,
              variables: {
                id: data.id,
                alarm_type: alarmType,
                tenant: GeTenantData('name'),
                servicepath: pathSelected.path,
                entity_id: alarmType === 'entity' ? entityID.id : '',
                entity_type: entityType.type,
                channel_type: channel,
                channel_destination: channelDestination,
                time_unit: timeUnit,
                max_time_since_last_update: Number(maxTime),
                alarm_frequency_time_unit: frequency,
                alarm_frequency_time: Number(minTime),
                time_of_last_alarm: data.time_of_last_alarm,
                status: data.status
              }
            })
            .then(() => {
              getAlarms();
              close(false);
              sendNotification({
                msg: (
                  <Trans
                    i18nKey="common.messages.sucessUpdate"
                    values={{
                      data: 'Alert'
                    }}
                  />
                ),
                variant: 'success'
              });
            })
            .catch((e) => {
              sendNotification({ msg: e.message + ' the config', variant: 'error' });
            });

          break;
        default:
          break;
      }
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
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>{<Trans>alarms.form.alarmType</Trans>}</InputLabel>
              <Select
                labelId={'Alarmtype'}
                id={'Alarmtype'}
                key={'Alarmtype'}
                value={alarmType}
                variant="outlined"
                onChange={(event) => {
                  setAlarmType(event.target.value);
                }}
                label={<Trans>alarms.form.alarmType</Trans>}
                sx={{
                  width: '100%'
                }}
                input={<OutlinedInput label={<Trans>alarms.form.alarmType</Trans>} />}
              >
                <MenuItem key={'entity'} value={'entity'}>
                  {<Trans>alarms.form.entity</Trans>}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {alarmType === 'entity' ? (
            <EntityPath
              services={services}
              action={action}
              types={types}
              entities={entities}
              getEntityURL={getEntityURL}
              form={entityForm}
            />
          ) : (
            <ServicePath services={services} action={action} types={types} form={servicePathForm} />
          )}
        </Grid>
      </DialogContent>
    </div>
  );
}

const ServicePath = ({ form, services, types }) => {
  const channels = [{ text: 'Email', id: 'email' }];
  const timeUnit = [
    { text: <Trans>alarms.card.time.day</Trans>, id: 'd' },
    { text: <Trans>alarms.card.time.hours</Trans>, id: 'h' },
    { text: <Trans>alarms.card.time.minutes</Trans>, id: 'm' },
    { text: <Trans>alarms.card.time.seconds</Trans>, id: 's' },
    { text: <Trans>alarms.card.time.milliseconds</Trans>, id: 'ms' }
  ];

  const errorCases = (value) => {
    switch (true) {
      case value === '':
        return true;
      case value === null:
        return true;
      case typeof value === 'object' && value.length <= 0:
        return true;
      default:
        return false;
    }
  };

  const helper = (value) => {
    switch (true) {
      case value === '':
        return <Trans>common.errors.mandatory</Trans>;
      case value === null:
        return <Trans>common.errors.mandatory</Trans>;
      case typeof value === 'object' && value.length <= 0:
        return <Trans>common.errors.mandatory</Trans>;

      default:
        return '';
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'types'} error={errorCases(form.pathSelected.value)}></InputLabel>
          <Autocomplete
            id="pathSelected"
            error={errorCases(form.pathSelected.value)}
            sx={{ width: '100%' }}
            options={services}
            autoHighlight
            value={form.pathSelected.value}
            defaultValue={form.pathSelected.value}
            getOptionLabel={(option) => option.path}
            isOptionEqualToValue={(option, value) => option.path === value.path}
            onChange={(event, value) => form.pathSelected.set(value)}
            renderInput={(params) => (
              <TextField
                error={errorCases(form.pathSelected.value)}
                {...params}
                label={<Trans>alarms.form.servicePath</Trans>}
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'pathSelected'
                }}
              />
            )}
          />
          <FormHelperText error={errorCases(form.pathSelected.value)}>{helper(form.pathSelected.value)}</FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'entityType'}></InputLabel>
          <Autocomplete
            id="entityType"
            fullWidth={true}
            options={types}
            autoHighlight
            getOptionLabel={(option) => option.type}
            isOptionEqualToValue={(option, value) => option.type === value.type}
            defaultValue={form.entityType.value}
            value={form.entityType.value}
            onChange={(event, value) => form.entityType.set(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={<Trans>alarms.form.entityType</Trans>}
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'entityType'
                }}
              />
            )}
          />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'channel'}>{<Trans>alarms.form.notificationChannel</Trans>}</InputLabel>
          <Select
            color="primary"
            labelId={'channel'}
            id={'channel'}
            key={'channel'}
            value={form.channel.value}
            onChange={(event) => {
              form.channel.set(event.target.value);
            }}
            variant="outlined"
            label={<Trans>alarms.form.notificationChannel</Trans>}
            input={<OutlinedInput label={<Trans>alarms.form.notificationChannel</Trans>} />}
          >
            {channels.map((channel) => (
              <MenuItem key={channel.id} value={channel.id}>
                {channel.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'channelDestination'} error={errorCases(form.channelDestination.value)}></InputLabel>
          <Autocomplete
            multiple
            color="primary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="secondary"></MailOutlineIcon>
                </InputAdornment>
              )
            }}
            id={'channelDestination'}
            options={[]}
            defaultValue={form.channelDestination.value}
            limitTags={2}
            freeSolo
            value={form.channelDestination.value}
            onChange={(event, value) => {
              const filteredArray = value.filter(function (e) {
                return isEmail(e);
              });
              form.channelDestination.set(filteredArray);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                error={errorCases(form.channelDestination.value)}
                {...params}
                variant="outlined"
                label={<Trans>alarms.form.channelDestination</Trans>}
                placeholder={'...'}
              />
            )}
          />
          <FormHelperText error={errorCases(form.pathSelected.value)}>
            {helper(form.channelDestination.value)}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="maxTime"
          label={<Trans>alarms.form.maxTime</Trans>}
          variant="outlined"
          type="number"
          value={form.maxTime.value}
          onChange={(event) => {
            form.maxTime.set(event.target.value);
          }}
          sx={{
            width: '100%'
          }}
          error={errorCases(form.maxTime.value)}
          helperText={helper(form.maxTime.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'timeUnit'}>{<Trans>alarms.form.timeUnit</Trans>}</InputLabel>
          <Select
            color="primary"
            labelId={'timeUnit'}
            id={'timeUnit'}
            key={'timeUnit'}
            value={form.timeUnit.value}
            onChange={(event) => {
              form.timeUnit.set(event.target.value);
            }}
            variant="outlined"
            label={<Trans>alarms.form.timeUnit</Trans>}
            input={<OutlinedInput label={<Trans>alarms.form.timeUnit</Trans>} />}
          >
            {timeUnit.map((time) => (
              <MenuItem key={time.id} value={time.id}>
                {time.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="minTime"
          label={<Trans>alarms.form.minTime</Trans>}
          variant="outlined"
          type="number"
          value={form.minTime.value}
          onChange={(event) => {
            form.minTime.set(event.target.value);
          }}
          sx={{
            width: '100%'
          }}
          error={errorCases(form.minTime.value)}
          helperText={helper(form.minTime.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'frequency'}>{<Trans>alarms.form.alarmFrequency</Trans>}</InputLabel>
          <Select
            color="primary"
            labelId={'frequency'}
            id={'frequency'}
            key={'frequency'}
            value={form.frequency.value}
            onChange={(event) => {
              form.frequency.set(event.target.value);
            }}
            variant="outlined"
            label={<Trans>alarms.form.alarmFrequency</Trans>}
            input={<OutlinedInput label={<Trans>alarms.form.alarmFrequency</Trans>} />}
          >
            {timeUnit.map((time) => (
              <MenuItem key={time.id} value={time.id}>
                {time.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};

const EntityPath = ({ form, services, entities, getEntityURL, types }) => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(!loading);
  }, [entities]);

  const channels = [{ text: 'Email', id: 'email' }];
  const timeUnit = [
    { text: <Trans>alarms.card.time.day</Trans>, id: 'd' },
    { text: <Trans>alarms.card.time.hours</Trans>, id: 'h' },
    { text: <Trans>alarms.card.time.minutes</Trans>, id: 'm' },
    { text: <Trans>alarms.card.time.seconds</Trans>, id: 's' },
    { text: <Trans>alarms.card.time.milliseconds</Trans>, id: 'ms' }
  ];

  const errorCases = (value) => {
    switch (true) {
      case value === '':
        return true;
      case value === null:
        return true;
      case typeof value === 'object' && value.length <= 0:
        return true;
      default:
        return false;
    }
  };

  const helper = (value) => {
    switch (true) {
      case value === '':
        return <Trans>common.errors.mandatory</Trans>;
      case value === null:
        return <Trans>common.errors.mandatory</Trans>;
      case typeof value === 'object' && value.length <= 0:
        return <Trans>common.errors.mandatory</Trans>;

      default:
        return '';
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'types'} error={errorCases(form.pathSelected.value)}></InputLabel>
          <Autocomplete
            id="pathSelected"
            error={errorCases(form.pathSelected.value)}
            sx={{ width: '100%' }}
            options={services}
            value={form.pathSelected.value}
            defaultValue={form.pathSelected.value}
            autoHighlight
            getOptionLabel={(option) => option.path}
            isOptionEqualToValue={(option, value) => option.path === value.path}
            onChange={(event, value) => form.pathSelected.set(value)}
            renderInput={(params) => (
              <TextField
                error={errorCases(form.pathSelected.value)}
                {...params}
                label={<Trans>alarms.form.servicePath</Trans>}
                variant="outlined"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'pathSelected'
                }}
              />
            )}
          />
          <FormHelperText error={errorCases(form.pathSelected.value)}>{helper(form.pathSelected.value)}</FormHelperText>
        </FormControl>
      </Grid>
      {form.pathSelected.value !== null ? (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id={'entityID'} error={errorCases(form.entityID.value)}></InputLabel>
            <Autocomplete
              disabled={
                form.pathSelected.value === null ||
                typeof form.pathSelected.value === 'undefined' ||
                form.pathSelected.value === ''
                  ? true
                  : false
              }
              id="entityID"
              error={errorCases(form.entityID.value)}
              sx={{ width: '100%' }}
              options={entities}
              autoHighlight
              loading={loading}
              onOpen={() => getEntityURL()}
              getOptionLabel={(option) => option.id}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => form.entityID.set(value)}
              defaultValue={form.entityID.value}
              value={form.entityID.value}
              renderInput={(params) => (
                <TextField
                  error={errorCases(form.entityID.value)}
                  {...params}
                  label={<Trans>alarms.form.entity</Trans>}
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'entityID'
                  }}
                />
              )}
            />
            <FormHelperText error={errorCases(form.entityID.value)}>{helper(form.entityID.value)}</FormHelperText>
          </FormControl>
        </Grid>
      ) : (
        ''
      )}
      {form.entityID.value !== null ? (
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id={'entityType'}></InputLabel>
            <Autocomplete
              id="entityType"
              disabled
              fullWidth={true}
              options={types}
              autoHighlight
              getOptionLabel={(option) => option.type}
              isOptionEqualToValue={(option, value) => option.type === value.type}
              defaultValue={form.entityType.value}
              value={form.entityType.value}
              onChange={(event, value) => form.entityType.set(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={<Trans>alarms.form.entityType</Trans>}
                  variant="outlined"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'entityType'
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
      ) : (
        ''
      )}

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'channel'}>{<Trans>alarms.form.notificationChannel</Trans>}</InputLabel>
          <Select
            color="primary"
            labelId={'channel'}
            id={'channel'}
            key={'channel'}
            value={form.channel.value}
            onChange={(event) => {
              form.channel.set(event.target.value);
            }}
            variant="outlined"
            label={<Trans>alarms.form.notificationChannel</Trans>}
            input={<OutlinedInput label={<Trans>alarms.form.notificationChannel</Trans>} />}
          >
            {channels.map((channel) => (
              <MenuItem key={channel.id} value={channel.id}>
                {channel.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'channelDestination'} error={errorCases(form.channelDestination.value)}></InputLabel>
          <Autocomplete
            multiple
            color="primary"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon color="secondary"></MailOutlineIcon>
                </InputAdornment>
              )
            }}
            id={'channelDestination'}
            options={[]}
            defaultValue={form.channelDestination.value}
            limitTags={2}
            freeSolo
            value={form.channelDestination.value}
            onChange={(event, value) => {
              const filteredArray = value.filter(function (e) {
                return isEmail(e);
              });
              form.channelDestination.set(filteredArray);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip key={index} variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                error={errorCases(form.channelDestination.value)}
                {...params}
                variant="outlined"
                label={<Trans>alarms.form.channelDestination</Trans>}
                placeholder={'...'}
              />
            )}
          />
          <FormHelperText error={errorCases(form.channelDestination.value)}>
            {helper(form.channelDestination.value)}
          </FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="maxTime"
          label={<Trans>alarms.form.maxTime</Trans>}
          variant="outlined"
          type="number"
          value={form.maxTime.value}
          onChange={(event) => {
            form.maxTime.set(event.target.value);
          }}
          sx={{
            width: '100%'
          }}
          error={errorCases(form.maxTime.value)}
          helperText={helper(form.maxTime.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'timeUnit'}>{<Trans>alarms.form.timeUnit</Trans>}</InputLabel>
          <Select
            color="primary"
            labelId={'timeUnit'}
            id={'timeUnit'}
            key={'timeUnit'}
            value={form.timeUnit.value}
            onChange={(event) => {
              form.timeUnit.set(event.target.value);
            }}
            variant="outlined"
            label={<Trans>alarms.form.timeUnit</Trans>}
            input={<OutlinedInput label={<Trans>alarms.form.timeUnit</Trans>} />}
          >
            {timeUnit.map((time) => (
              <MenuItem key={time.id} value={time.id}>
                {time.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="minTime"
          label={<Trans>alarms.form.minTime</Trans>}
          variant="outlined"
          type="number"
          value={form.minTime.value}
          onChange={(event) => {
            form.minTime.set(event.target.value);
          }}
          sx={{
            width: '100%'
          }}
          error={errorCases(form.minTime.value)}
          helperText={helper(form.minTime.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id={'frequency'}>{<Trans>alarms.form.alarmFrequency</Trans>}</InputLabel>
          <Select
            color="primary"
            labelId={'frequency'}
            id={'frequency'}
            key={'frequency'}
            value={form.frequency.value}
            onChange={(event) => {
              form.frequency.set(event.target.value);
            }}
            variant="outlined"
            label={<Trans>alarms.form.alarmFrequency</Trans>}
            input={<OutlinedInput label={<Trans>alarms.form.alarmFrequency</Trans>} />}
          >
            {timeUnit.map((time) => (
              <MenuItem key={time.id} value={time.id}>
                {time.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};
