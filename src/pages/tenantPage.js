import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import TenantForm from '../components/tenant/tenantForm';
import Grow from '@mui/material/Grow';
import { Trans } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function TenantPage({ tenantValues, getTenants, seTenant, client, token, graphqlErrors, env }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [sortedTenants, sortTenants] = React.useState([]);
  const [count, counter] = React.useState(1);
  React.useEffect(() => {
    sortTenants(tenantValues.reverse((a, b) => parseFloat(a.name) - parseFloat(b.name)));
  }, [tenantValues]);
  const mainTitle = <Trans>tenant.titles.page</Trans>;
  const rerOder = (newData) => {
    sortTenants(newData);
    counter(count + 1);
  };

  return (
    <Box sx={{ marginBottom: 15 }}>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <AddButton
        pageType={
          <TenantForm
            env={env}
            token={token}
            client={client}
            title={<Trans>tenant.titles.new</Trans>}
            close={setCreateOpen}
            action={'create'}
            getTenants={getTenants}
          />
        }
        setOpen={setCreateOpen}
        status={createOpen}
        graphqlErrors={graphqlErrors}
      ></AddButton>
      {tenantValues.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <SortButton data={sortedTenants} id={'name'} sortData={rerOder}></SortButton>
          </Grid>
          {tenantValues.map((tenant, index) => (
            <Grow
              key={index}
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(index === index ? { timeout: index * 600 } : {})}
            >
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <DashboardCard
                  env={env}
                  index={index}
                  key={index}
                  pageType={
                    <TenantForm
                      env={env}
                      token={token}
                      client={client}
                      title={<Trans i18nKey="tenant.titles.edit" values={{ name: tenant.name }} />}
                      action={'modify'}
                      tenant={tenant}
                      getTenants={getTenants}
                    ></TenantForm>
                  }
                  data={tenant}
                  getData={getTenants}
                  seTenant={seTenant}
                  tenantName_id={tenant}
                ></DashboardCard>
              </Grid>
            </Grow>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ padding: '20px' }} variant="h6" component="h3">
          <Trans>tenant.titles.noData</Trans>
        </Typography>
      )}
    </Box>
  );
}
