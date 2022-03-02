import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const TenantSelect = styled(Select)(
  {
    '& .MuiSelect-outlined': {
        color: 'green',
    },
    '& .MuiSelect-outlined:after': {
        borderBottomColor: 'green',
    },
    '& .MuiSelect-outlined': {
        '& fieldset': {
            borderColor: 'red',
        },
        '&:hover fieldset': {
            borderColor: 'yellow',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'green',
        },
    }
  }
  
  );


  const theme = createTheme({
    components: {
        // Name of the component
        MuiSelect: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    color: 'white',
                
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    color: 'white !important',
                },
            },
        },
        MuiSvgIcon: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    color: 'white !important',
                },
            },
        }

    },
});
export default function TenantSelection(tenantValue) {
  const [Tenant, set_Tenant] = React.useState('First');

  const handleChange = (event) => {
    set_Tenant(event.target.value);
  };
  

  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ minWidth: 300 }}>
      <FormControl fullWidth>
        <InputLabel id="tenant">Tenant</InputLabel>
        <TenantSelect
          labelId="tenant"
          id="tenant"
          variant="outlined"
          value={Tenant}
          label="Tenant"
          onChange={handleChange}
        >
          <MenuItem value={"First"}>First</MenuItem>
          <MenuItem value={"Second"}>Second</MenuItem>
          <MenuItem value={"Third"}>Third</MenuItem>
        </TenantSelect>
      </FormControl>
    </Box>
    </ThemeProvider>
  );
}