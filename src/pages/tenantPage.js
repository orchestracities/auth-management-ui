

import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import TenantForm from '../components/tenant/tenantForm';

export default function TenantPage({ tenantValues, getTenants, seTenant }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [sortedTenants, sortTenants] = React.useState([]);
  const [count, counter] = React.useState(1);
  React.useEffect(() => {
    sortTenants(tenantValues.reverse((a, b) => parseFloat(a.name) - parseFloat(b.name)))
  }, [tenantValues]);

  const rerOder = (newData) => {
    sortTenants(newData)
    counter(count + 1);
  }

  const mainTitle = "Tenant Admin List";
  return (
    <div>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <AddButton pageType={<TenantForm title={"New Tenant"} close={setCreateOpen} action={"create"} getTenants={getTenants} />} setOpen={setCreateOpen} status={createOpen} ></AddButton>
      <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
        <Grid item xs={12}>
          <SortButton data={sortedTenants} id={"name"} sortData={rerOder}></SortButton>
        </Grid>
        {tenantValues.map((tenant) => (
          <Grid item xs={4}>
            <DashboardCard pageType={<TenantForm title={"Edit Tenant"} action={"modify"} tenant={tenant}></TenantForm>} data={tenant} getData={getTenants} seTenant={seTenant}></DashboardCard>
          </Grid>
        ))}

      </Grid>
    </div>
  );
}
