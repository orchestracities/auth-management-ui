import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import AlarmCard from '../components/alarms/alarmCard';
import ServiceForm from '../components/service/serviceForm';
import axios from 'axios';
import Grow from '@mui/material/Grow';
import { Trans } from 'react-i18next';
import useNotification from '../components/shared/messages/alerts';
import Box from '@mui/material/Box';
import * as log from 'loglevel';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { lighten } from '@mui/material';

export default function AlarmsPage({ getTenants, tenantValues, thisTenant, graphqlErrors, env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const theme = useTheme();

  const [createOpen, setCreateOpen] = React.useState(false);
  const [alarmsList, setAlarmsList] = React.useState([
    {
      id: 1,
      alarm_type: 'entity',
      tenant: 'EKZ',
      servicepath: '/EnvironmentManagement/Aeroqual',
      entity_id: 'urn:ngsi-ld:AirQualityObserved:AQY_BB-629',
      entity_type: '',
      channel_type: 'email',
      channel_destination: 'smartcity@ekz.ch',
      time_unit: 'h',
      max_time_since_last_update: 6,
      alarm_frequency_time_unit: 'd',
      alarm_frequency_time: 1,
      time_of_last_alarm: '2023-04-05T15:27:37.222Z',
      status: 'active'
    }
  ]);
  const [count, counter] = React.useState(1);

  const [msg, sendNotification] = useNotification();
  log.debug(msg);
  const rerOder = (newData) => {
    setAlarmsList(newData);
    counter(count + 1);
  };

  React.useEffect(() => {}, [thisTenant]);

  const mainTitle = 'TESTOH';
  return (
    <Box>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {typeof thisTenant === 'undefined' || thisTenant === '' ? (
        ''
      ) : (
        <AddButton
          pageType={<></>}
          setOpen={setCreateOpen}
          status={createOpen}
          graphqlErrors={graphqlErrors}
        ></AddButton>
      )}
      {alarmsList.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {alarmsList.length > 0 ? <SortButton data={alarmsList} id={'id'} sortData={rerOder}></SortButton> : ''}
          </Grid>
          {alarmsList.map((alarm, index) => (
            <Grow
              key={index}
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(alarm.id === alarm.id ? { timeout: index * 600 } : {})}
            >
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <AlarmCard
                  env={env}
                  key={alarm.id}
                  colors={{
                    secondaryColor: lighten(theme.palette.secondary.main, index * 0.05),
                    primaryColor: lighten(theme.palette.primary.main, index * 0.05)
                  }}
                  pageType={<></>}
                  data={alarm}
                ></AlarmCard>
              </Grid>
            </Grow>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ padding: '20px' }} variant="h6" component="h3">
          <Trans>service.titles.noData</Trans>
        </Typography>
      )}
    </Box>
  );
}
