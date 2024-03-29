import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import ServiceForm from '../components/service/serviceForm';
import axios from 'axios';
import Grow from '@mui/material/Grow';
import { Trans } from 'react-i18next';
import useNotification from '../components/shared/messages/alerts';
import Box from '@mui/material/Box';
import * as log from 'loglevel';
import Typography from '@mui/material/Typography';

export default function ServicePage({ getTenants, tenantValues, thisTenant, graphqlErrors, env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);

  const [createOpen, setCreateOpen] = React.useState(false);
  const [services, setServices] = React.useState([]);
  const [msg, sendNotification] = useNotification();
  log.debug(msg);
  const [count, counter] = React.useState(1);
  const rerOder = (newData) => {
    setServices(newData);
    counter(count + 1);
  };

  const tenantFiltered = tenantValues.filter((e) => e.id === thisTenant);
  const tenantData = tenantFiltered[0];
  const incrementColor = (color, step) => {
    let colorToInt = parseInt(color.substr(1), 16);
    const nstep = parseInt(step);
    if (!isNaN(colorToInt) && !isNaN(nstep)) {
      colorToInt += nstep;
      let ncolor = colorToInt.toString(16);
      ncolor = '#' + new Array(7 - ncolor.length).join(0) + ncolor;
      if (/^#[0-9a-f]{6}$/i.test(ncolor)) {
        return ncolor;
      }
    }
    return color;
  };

  const getServices = () => {
    axios
      .get((typeof env !== 'undefined' ? env.ANUBIS_API_URL : '') + 'v1/tenants/' + thisTenant + '/service_paths')
      .then((response) => {
        response.data[0].children.map(
          (service, index) => (service.primaryColor = incrementColor(tenantData.props.primaryColor, index * 5))
        );
        response.data[0].children.map(
          (service, index) => (service.secondaryColor = incrementColor(tenantData.props.secondaryColor, index * 10))
        );
        setServices(response.data[0].children);
        getTenants();
      })
      .catch((e) => {
        getTenants();
        if (e.response) {
          e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
        } else {
          sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
        }
      });
  };

  React.useEffect(() => {
    getServices();
  }, [thisTenant]);

  const mainTitle = <Trans>service.titles.page</Trans>;
  return (
    <Box>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {typeof thisTenant === 'undefined' || thisTenant === '' ? (
        ''
      ) : (
        <AddButton
          pageType={
            <ServiceForm
              env={env}
              title={<Trans>service.titles.new</Trans>}
              close={setCreateOpen}
              action={'create'}
              getServices={getServices}
              tenantName_id={tenantData}
            />
          }
          setOpen={setCreateOpen}
          status={createOpen}
          graphqlErrors={graphqlErrors}
        ></AddButton>
      )}
      {services.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {services.length > 0 ? <SortButton data={services} id={'path'} sortData={rerOder}></SortButton> : ''}
          </Grid>
          {services.map((service, index) => (
            <Grow
              key={index}
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(service.id === service.id ? { timeout: index * 600 } : {})}
            >
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <DashboardCard
                  env={env}
                  key={service.id}
                  colors={{ secondaryColor: service.secondaryColor, primaryColor: service.primaryColor }}
                  pageType={
                    <ServiceForm
                      env={env}
                      title={<Trans>service.titles.edit</Trans>}
                      action={'Sub-service-creation'}
                      service={service}
                      getServices={getServices}
                      tenantName_id={tenantData}
                    />
                  }
                  tenantName_id={tenantData}
                  data={service}
                  getData={getServices}
                ></DashboardCard>
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
