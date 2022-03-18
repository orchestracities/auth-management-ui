

import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import TenantForm from '../components/tenant/tenantForm';

export default function TenantPage({tenantValues,getTenants}) {
    const [editOpen, setEditOpen] = React.useState(false);
    const [createOpen, setCreateOpen] = React.useState(false);

   const mainTitle= "Tenant Admin List";
    return (
        <div>
          <MainTitle mainTitle={mainTitle}></MainTitle>
          <AddButton pageType={ <TenantForm title={"New Tenant"} close={setCreateOpen} action={"create"} getTenants={getTenants} />} setOpen={setCreateOpen} status={createOpen} ></AddButton>
          <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
            <Grid item xs={12}>
              <SortButton></SortButton>
            </Grid>
            {tenantValues.map((tenant) => (
                    <Grid item xs={4}>
                    <DashboardCard  pageType={ <TenantForm title={"Edit Tenant"} close={setEditOpen} action={"modify"} tenant={tenant}></TenantForm>} setOpen={setEditOpen} status={editOpen} data={tenant} getTenants={getTenants}></DashboardCard>
                  </Grid>  
                ))}
                
          </Grid>
        </div>
    );
}
