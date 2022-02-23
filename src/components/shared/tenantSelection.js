import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const TenantSelect = styled(Select)(
    ({ theme }) => ''
  
  );
const StyledOption = styled(MenuItem)(
    ({ theme }) => '',
  );

export default function TenantSelection(tenantValue) {
  const [Tenant, setAge] = React.useState('First');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  

  return (
    <Box sx={{ minWidth: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="tenant">Tenant</InputLabel>
        <TenantSelect
          labelId="tenant"
          id="tenant"
          value={Tenant}
          label="Tenant"
          onChange={handleChange}
        >
          <StyledOption value={"First"}>First</StyledOption>
          <StyledOption value={"Second"}>Second</StyledOption>
          <StyledOption value={"Third"}>Third</StyledOption>
        </TenantSelect>
      </FormControl>
    </Box>
  );
}