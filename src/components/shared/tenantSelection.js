import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import IconList from '../tenant/iconList';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';

const TenantSelect = styled(Select)(({ theme }) => ({
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText
  },

  '& .MuiInputLabel': {
    color: theme.palette.primary.contrastText,
    fontSize: '10px'
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.contrastText,
    fontSize: '1em',
    minWidth: '30px'
  },
  '& :hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-root': {
    borderColor: theme.palette.primary.contrastText,
    color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.primary.contrastText,
    padding: '8px 10px'
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.contrastText
  },
  '&:hover .MuiOutlinedInput-input': {
    color: theme.palette.primary.contrastText
  },
  '&:hover .MuiInputLabel-root': {
    color: theme.palette.primary.contrastText
  },
  '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
    color: theme.palette.primary.contrastText
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.primary.contrastText
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.contrastText
  }
}));

const TenantLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primary.contrastText + ' !important'
}));
export default function TenantSelection({ tenantValues, seTenant, currentValue }) {
  const listOfIcons = IconList();
  const [tenantSelected, setTenantSelected] = React.useState('');
  const iconMapper = (iconName) => {
    const thisIcon = listOfIcons.filter((e) => e.name === iconName);
    return thisIcon[0].icon;
  };
  const handleChange = (event) => {
    setTenantSelected(event.target.value);
    seTenant(event.target.value);
  };

  React.useEffect(() => {
    setTenantSelected(currentValue);
  }, [currentValue]);
  return (
    <Box sx={{ minWidth: 180 }}>
      <FormControl fullWidth>
        <TenantLabel id="tenant">Tenant</TenantLabel>
        <TenantSelect
          labelId="tenant"
          id="tenant"
          label={'Tenant'}
          variant="outlined"
          value={tenantSelected}
          onChange={handleChange}
        >
          {tenantValues.map((tenant) => (
            <MenuItem key={tenant.id} value={tenant.id}>
              {tenant.props.icon === 'custom' ? (
                <ListItemIcon>
                  <Avatar
                    sx={{ width: 20, height: 20, cursor: 'pointer' }}
                    aria-label="recipe"
                    src={tenant.props.customImage}
                  />
                </ListItemIcon>
              ) : (
                <ListItemIcon>{iconMapper(tenant.props.icon)}</ListItemIcon>
              )}
              {tenant.name}
            </MenuItem>
          ))}
        </TenantSelect>
      </FormControl>
    </Box>
  );
}
