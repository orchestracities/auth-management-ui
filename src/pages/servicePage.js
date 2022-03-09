

import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import ServiceForm from '../components/service/serviceForm';
export default function ServicePage() {
    const [open, setOpen] = React.useState(false);

   const mainTitle= "Service paths";
    return (
        <div>
          <MainTitle mainTitle={mainTitle}></MainTitle>
          <AddButton pageType={ <ServiceForm title={"New Service"} close={setOpen} ></ServiceForm>} setOpen={setOpen} status={open}></AddButton>
          <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
            <Grid item xs={12}>
              <SortButton></SortButton>
            </Grid>
            <Grid item xs={12}>
            <DashboardCard pageType={ <ServiceForm title={"Edit Tenant"} close={setOpen} ></ServiceForm>} setOpen={setOpen} status={open}></DashboardCard>
            </Grid>       
          </Grid>
        </div>
    );
}
