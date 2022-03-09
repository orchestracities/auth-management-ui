
import * as React from 'react';
import { MainTitle } from '../components/shared/mainTitle';
import AddButton from '../components/shared/addButton';
import { Grid } from '@mui/material';
import PolicyFilters from '../components/policy/policyFilters'
import PolicyTable from '../components/policy/policiesTable'
import PolicyForm from '../components/policy/policyForm'


export default function PolicyPage() {
    const [open, setOpen] = React.useState(false);

   const mainTitle= "Policies:";
    return (
        <div>
          <MainTitle mainTitle={mainTitle}></MainTitle>
          <AddButton pageType={ <PolicyForm title={"New Policy"} close={setOpen} ></PolicyForm>} setOpen={setOpen} status={open}></AddButton>
          <Grid container spacing={2} sx={{ marginLeft: "15px " }}>
            <Grid item xs={12}>
            <PolicyFilters></PolicyFilters>
            </Grid>
            <Grid item xs={12}>
             <PolicyTable></PolicyTable>
            </Grid>       
          </Grid>
        </div>
    );
}
