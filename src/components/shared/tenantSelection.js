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
    color: theme.palette.primary.contrastText
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.contrastText
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
    color: theme.palette.primary.contrastText
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
export default function TenantSelection({ tenantValues, seTenant, correntValue }) {
  const listOfIcons = IconList();
  const iconMapper = (iconName) => {
    const thisIcon = listOfIcons.filter((e) => e.name === iconName);
    return thisIcon[0].icon;
  };
  const handleChange = (event) => {
    seTenant(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 230 }}>
      <FormControl fullWidth>
        <TenantLabel id="tenant">Tenant</TenantLabel>
        <TenantSelect
          labelId="tenant"
          id="tenant"
          variant="outlined"
          value={correntValue}
          label="Tenant"
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
