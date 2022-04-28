
import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import PolicyFilters from '../components/policy/policyFilters'
import PolicyTable from '../components/policy/policiesTable'
import PolicyForm from '../components/policy/policyForm'
import axios from "axios"
import Typography from '@mui/material/Typography';


export default function PolicyPage({ getTenants, tenantValues, thisTenant }) {
  const [open, setOpen] = React.useState(false);
  const tenantName_id = () => {
    let tenantArray = tenantValues.filter((e) => e.id === thisTenant);
    return tenantArray[0].name;
  }
  //services
  const [services, setServices] = React.useState([{ children: [] }]);
  const getServices = () => {
    axios.get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/tenants/' + thisTenant + "/service_paths")
      .then((response) => {
        console.log(response.data);
        setServices(response.data);
        getPolicies(response.data);
        getTenants();
      })
      .catch((e) => {
        console.error(e);
      });
  }
  //policies
  const [policies, setPolicies] = React.useState([{ children: [] }]);
  const getPolicies = (servicesResponse) => {
    let datAccumulator = [];
    for (let service of servicesResponse) {
      axios.get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/policies', {
        headers: {
          "fiware_service": tenantName_id(),
          "fiware_service_path": service.path
        }
      })
        .then((response) => {
          response.data.forEach(e => e.fiware_service = tenantName_id());
          response.data.forEach(e => e.fiware_service_path = service.path);
          datAccumulator = [...datAccumulator, ...response.data];
          setPolicies(datAccumulator);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  console.log(policies);
  }
  const [access_modes, setAccess_modes] = React.useState([]);

  React.useEffect(() => {
    getServices();
    axios.get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/policies/access-modes')
    .then(response => setAccess_modes(response.data))
    .catch(err => console.log(err));
  }, [thisTenant]);

  const mainTitle = "Policies";

  return (
    <div>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      {
        (typeof thisTenant === undefined || thisTenant === "")
          ? ""
  : <AddButton pageType={<PolicyForm tenantName={tenantName_id} action="create" services={services} getServices={getServices} access_modes={access_modes} title={"New Policy"} close={setOpen} ></PolicyForm>} setOpen={setOpen} status={open}></AddButton>
      }
      {(policies.length > 1)?<Grid container spacing={2} sx={{ marginLeft: "15px " }}>
        <Grid item xs={12}>
          <PolicyFilters></PolicyFilters>
        </Grid>
        <Grid item xs={12}>
          <PolicyTable data={policies} getData={getServices}></PolicyTable>
        </Grid>
      </Grid>:<Typography sx={{padding:"20px"}} variant="h6" component="h3">
            No data avaitable
      </Typography>}
      
    </div>
  );
}

