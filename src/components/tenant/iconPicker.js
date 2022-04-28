import * as React from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import IconList from './iconList';


export default function IconPicker({previusValue, setValue,mode}) {

    const handleChange = (event) => {
        setValue(event.target.value);

    };
    console.log(IconList())
    return (
        <Box sx={{
            width: '100%',
        }}>
            <FormControl fullWidth>
                <InputLabel id="icon-select">Icon</InputLabel>
                <Select
                    labelId="icon-select"
                    id="demo-simple-select"
                    value={(mode === "modify") ? previusValue : ""}
                    label="Icon"
                    onChange={handleChange}
                >
                    {IconList().map((thisItem, index) => (

                        <MenuItem value={thisItem.name}>
                            <ListItemIcon>
                                {thisItem.icon}
                            </ListItemIcon>
                            {thisItem.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
