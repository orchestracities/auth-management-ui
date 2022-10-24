import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconList from './iconList';
import { Trans } from 'react-i18next';

export default function IconPicker({ previusValue, setValue }) {
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box
      sx={{
        width: '100%'
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="icon-select">
          <Trans>tenant.form.icon</Trans>
        </InputLabel>
        <Select
          labelId="icon-select"
          id="demo-simple-select"
          value={previusValue}
          label={<Trans>tenant.form.icon</Trans>}
          onChange={handleChange}
        >
          {IconList().map((thisItem) => (
            <MenuItem key={thisItem.name} value={thisItem.name}>
              <ListItemIcon>{thisItem.icon}</ListItemIcon>
              {thisItem.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
