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
import { getEnv } from '../env';
import Box from '@mui/material/Box';

const env = getEnv();

export default function ServicePage({ getTenants, tenantValues, thisTenant, graphqlErrors }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [services, setServices] = React.useState([{ children: [] }]);
  const [msg, sendNotification] = useNotification();
  console.log(msg);

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
      .get(env.ANUBIS_API_URL + 'v1/tenants/' + thisTenant + '/service_paths')
      .then((response) => {
        response.data[0].children.map(
          (service, index) => (service.primaryColor = incrementColor(tenantData.props.primaryColor, index * 30))
        );
        response.data[0].children.map(
          (service, index) => (service.secondaryColor = incrementColor(tenantData.props.secondaryColor, index * 50))
        );

        setServices(response.data);
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
    <Box sx={{ marginBottom: 15 }}>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {typeof thisTenant === 'undefined' || thisTenant === '' ? (
        ''
      ) : (
        <AddButton
          pageType={
            <ServiceForm
              title={<Trans>service.titles.new</Trans>}
              close={setCreateOpen}
              action={'create'}
              getServices={getServices}
              tenantName_id={tenantValues.filter((e) => e.id === thisTenant)}
            />
          }
          setOpen={setCreateOpen}
          status={createOpen}
          graphqlErrors={graphqlErrors}
        ></AddButton>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {services[0].children.length > 0 ? (
            <SortButton data={services[0].children} id={'path'} sortData={setServices}></SortButton>
          ) : (
            ''
          )}
        </Grid>
        {services[0].children.map((service, index) => (
          <Grow
            key={index}
            in={true}
            style={{ transformOrigin: '0 0 0' }}
            {...(service.id === service.id ? { timeout: index * 600 } : {})}
          >
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <DashboardCard
                key={service.id}
                colors={{ secondaryColor: service.secondaryColor, primaryColor: service.primaryColor }}
                pageType={
                  <ServiceForm
                    title={<Trans>service.titles.edit</Trans>}
                    action={'Sub-service-creation'}
                    service={service}
                    getServices={getServices}
                    tenantName_id={tenantData}
                  />
                }
                data={service}
                getData={getServices}
              ></DashboardCard>
            </Grid>
          </Grow>
        ))}
      </Grid>
    </Box>
  );
}
