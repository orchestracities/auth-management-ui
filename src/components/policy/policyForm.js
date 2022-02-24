import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const CustomDialogTitle = styled(AppBar)({
    position: 'relative',
    background: "white",
    boxShadow: "none"
});


export default function PolicyForm({ title, close }) {
    const handleClose = () => {
        close(false);
    };
    //SERVICE
    const [service, setService] = React.useState('String');

    const handleService = (event) => {
      setService(event.target.value);
    };

    //SERVICE PATH
    const [path, setPath] = React.useState('String');

    const handlePath = (event) => {
      setPath(event.target.value);
    };

    //ACCESS
    const [access, setAccess] = React.useState('String');

    const handleAccess = (event) => {
      setAccess(event.target.value);
    };

    //RESOURCE
    const [resource, setResource] = React.useState('String');

    const handleResource = (event) => {
      setResource(event.target.value);
    };

    //MODE
    const [mode, setMode] = React.useState('String');

    const handleMode = (event) => {
      setMode(event.target.value);
    };

    //AGENT
    const [agent, setAgent] = React.useState('String');

    const handleAgent = (event) => {
      setAgent(event.target.value);
    };

    return (
        <div>
            <CustomDialogTitle >
                <Toolbar>
                    <IconButton
                        edge="start"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, color: "black" }} variant="h6" component="div">
                        {title}
                    </Typography>
                    <Button autoFocus color="secondary" onClick={handleClose}>
                        save
                    </Button>
                </Toolbar>
            </CustomDialogTitle>
            <DialogContent sx={{ minHeight: "400px" }}>
                <Grid container
                    spacing={3}
                >
                   
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="service">Service</InputLabel>
                            <Select
                                labelId="Service"
                                id="Service"
                                variant="outlined"
                                value={service}
                                label="Service"
                                onChange={setService}
                            >
                                <MenuItem value={"String"}>String</MenuItem>
                           
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="path">Service Path</InputLabel>
                            <Select
                                labelId="path"
                                id="path"
                                variant="outlined"
                                value={path}
                                label="Service Path"
                                onChange={setPath}
                            >
                                <MenuItem value={"String"}>String</MenuItem>
                           
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="access">Access To</InputLabel>
                            <Select
                                labelId="access"
                                id="access"
                                variant="outlined"
                                value={access}
                                label="Access To"
                                onChange={setAccess}
                            >
                                <MenuItem value={"String"}>String</MenuItem>
                           
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="resource">Resource Type</InputLabel>
                            <Select
                                labelId="resource"
                                id="resource"
                                variant="outlined"
                                value={resource}
                                label="Resource Type"
                                onChange={setResource}
                            >
                                <MenuItem value={"String"}>String</MenuItem>
                           
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="mode">Mode</InputLabel>
                            <Select
                                labelId="mode"
                                id="mode"
                                variant="outlined"
                                value={mode}
                                label="Mode"
                                onChange={setMode}
                            >
                                <MenuItem value={"String"}>String</MenuItem>
                           
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="agent">Agent</InputLabel>
                            <Select
                                labelId="agent"
                                id="agent"
                                variant="outlined"
                                value={agent}
                                label="Agent"
                                onChange={setAgent}
                            >
                                <MenuItem value={"String"}>String</MenuItem>
                           
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
        </div>
    );
}

