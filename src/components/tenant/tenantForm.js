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
import axios from "axios"

const CustomDialogTitle = styled(AppBar)({
    position: 'relative',
    background: "white",
    boxShadow: "none"
});


export default function TenantForm({ title, close, action, tenant,getTenants }) {
    const [name, setName] = React.useState((action === "modify") ? tenant.name : " ");
    const [description, setDescription] = React.useState('');

    const handleClose = () => {
        close(false);
    };

    const handleSave = () => {
       
        switch (action) {
            case "create":
              
                axios.post(process.env.REACT_APP_API_LOCATION+'v1/tenants', {
                    "name": name
                  })
                .then((response) => {
                    close(false);
                    getTenants();
                })
                .catch((e) => 
                {
                  console.error(e);
                });
               
                break;
            case "modify":
                console.log("modify")
                break;
            default:
                break;
        }
       
    };

    console.log(tenant)
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
                        {(action === "modify") ? title + ":" + tenant.name : title}
                    </Typography>
                    <Button autoFocus color="secondary" onClick={handleSave}>
                        save
                    </Button>
                </Toolbar>
            </CustomDialogTitle>
            <DialogContent sx={{ minHeight: "400px" }}>
                <Grid container
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <TextField
                            id="Name"
                            label="Name"
                            variant="outlined"
                            defaultValue={(action === "modify") ? tenant.name : ""}
                            sx={{
                                width: '100%',
                            }}
                            onChange={(event) => {
                                setName(event.target.value)
                            }}
                            helperText={(name === "")?"the name is mandatory":""}
                            error={name === ""} />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="Description" label="Description" variant="outlined" sx={{
                            width: '100%',
                        }} />
                    </Grid>
                </Grid>
            </DialogContent>
        </div>
    );
}