import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import IconList from '../tenant/iconList';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';

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
                },
            },
        }

    },
});
export default function TenantSelection({tenantValues,seTenant,correntValue}) {
  const [Tenant, set_Tenant] = React.useState(correntValue);
  const listOfIcons=IconList();
  const iconMapper=(iconName)=>{
   let thisIcon= listOfIcons.filter((e) => e.name === iconName)
    return thisIcon[0].icon;
  }
  const handleChange = (event) => {
    set_Tenant(event.target.value);
    seTenant(event.target.value);
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
          value={correntValue}
          label="Tenant"
          onChange={handleChange}
        >
            {tenantValues.map((tenant) => (
                    <MenuItem value={tenant.id}>
                          <ListItemIcon>
                                {iconMapper(tenant.props.icon)}
                            </ListItemIcon>
                        {tenant.name}</MenuItem>
                ))}
        </TenantSelect>
      </FormControl>
    </Box>
    </ThemeProvider>
  );
}