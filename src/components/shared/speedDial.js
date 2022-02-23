import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const actions = [
    { icon: <EditIcon />, name: 'Edit' },
    { icon: <DeleteIcon color="error"/>, name: 'Delete' },
];

const fabProps = {
    sx: {
        background: "#8a93e100", color: "#555555e3", boxShadow: "none", "&:hover": {
            background: "#8a93e140"
        }
    }
};
export default function MultifunctionButton() {
    return (
        <Box sx={{ height: 60, transform: 'translateZ(0px)', flexGrow: 1, zIndex: 100, background: "#8a93e140" }}>
            <SpeedDial
                FabProps={fabProps}
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 0, right: 5 }}
                icon={<MoreVertIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}