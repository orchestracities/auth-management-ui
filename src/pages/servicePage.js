

import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import SortButton from '../components/shared/sortButton';
import DashboardCard from '../components/shared/cards';
import ServiceForm from '../components/service/serviceForm';
import axios from "axios"

export default function ServicePage({getTenants,tenantValues,thisTenant}) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [services, setServices] = React.useState([{children:[]}]);
  const getServices=()=>{
    axios.get(process.env.REACT_APP_ANUBIS_API_URL+'v1/tenants/'+thisTenant+"/service_paths")
    .then((response) => {
     
      setServices(response.data);
      getTenants();
    })
    .catch((e) => 
    {
      console.error(e);
    });
  }
  
  React.useEffect(() => {
    getServices();
  },[thisTenant]);

   const mainTitle= "Service paths";
    return (
      <div>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {(typeof thisTenant === undefined || thisTenant ==="")?"":<AddButton pageType={ <ServiceForm title={"New Service"} close={setCreateOpen} action={"create"} getServices={getServices} tenantName_id={tenantValues.filter((e) => e.id === thisTenant)} />} setOpen={setCreateOpen} status={createOpen} ></AddButton>}
      <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
        <Grid item xs={12}>
          <SortButton></SortButton>
        </Grid>
        {services[0].children.map((service) => (
                    <Grid item xs={4}>
                    <DashboardCard key={service.id} pageType={ <ServiceForm  title={"New Sub-service"}  action={"modify"} service={service} getServices={getServices} tenantName_id={tenantValues.filter((e) => e.id === thisTenant)}/>}  data={service} getData={getServices}></DashboardCard>
                  </Grid>  
                ))}
      </Grid>
    </div>
    );
}
