import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import DialogContent from '@mui/material/DialogContent';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const DialogRounded = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-rounded': {
        borderRadius: 15,
    },
}));

const CustomDialogTitle = styled(AppBar)({
    position: 'relative',
    background: "white",
    boxShadow: "none"
});

export default function UserMenu({ language, changeLanguage }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [settings, setOpenSettings] = React.useState(false);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const settingsOpen = () => {
        setOpenSettings(true);
    };

    const settingsClose = () => {
        setOpenSettings(false);
    };

    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <AccountCircle />
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 10,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={settingsOpen}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <DialogRounded
                open={settings}
                fullWidth={true}
                maxWidth={"md"}
                onClose={settingsClose}
                aria-labelledby="alert-dialog-titlel"
                aria-describedby="alert-dialog-descriptionl"
            >
                <CustomDialogTitle >
                    <Toolbar>
                        <IconButton
                            edge="start"
                            onClick={settingsClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1, color: "black" }} variant="h6" component="div">
                            Settings
                        </Typography>
                    </Toolbar>
                </CustomDialogTitle>
                <DialogContent>
                    <Grid container
                        spacing={3}
                    >
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="language">Language</InputLabel>
                                <Select
                                    labelId="language"
                                    id="language-select"
                                    variant="outlined"
                                    label="Language"
                                >
                                    <MenuItem value={10}>Default</MenuItem>
                                    <MenuItem value={20}>English</MenuItem>
                                    <MenuItem value={30}>Italian</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
            </DialogRounded>
        </React.Fragment>
    );
}




