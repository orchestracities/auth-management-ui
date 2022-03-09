

import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import TenantForm from '../components/tenant/tenantForm';

export default function TenantPage() {
    const [open, setOpen] = React.useState(false);

   const mainTitle= "Tenant Admin List";
    return (
        <div>
          <MainTitle mainTitle={mainTitle}></MainTitle>
          <AddButton pageType={ <TenantForm title={"New Tenant"} close={setOpen} ></TenantForm>} setOpen={setOpen} status={open}></AddButton>
          <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
            <Grid item xs={12}>
              <SortButton></SortButton>
            </Grid>
            <Grid item xs={12}>
              <DashboardCard pageType={ <TenantForm title={"Edit Tenant"} close={setOpen} ></TenantForm>} setOpen={setOpen} status={open}></DashboardCard>
            </Grid>       
          </Grid>
        </div>
    );
}
