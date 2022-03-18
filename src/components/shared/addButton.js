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
import TenantForm from '../tenant/tenantForm'

const bottomStyle = {
    position: "fixed",
    bottom: "50px",
    right: "20px",
}

const NewElement = styled(IconButton)({
    borderRadius: "15px",
    background: "#8086ba",
    color: "white",
    "&:hover": {
        background: "#8086ba"
    }
});


const CustomDialogTitle = styled(AppBar)({
    position: 'relative',
    background: "white",
    boxShadow: "none"
});


export default function AddButton({pageType,setOpen,status}) {

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Stack direction="row" sx={bottomStyle}>
                <NewElement aria-label="delete" size="large" onClick={handleClickOpen}>
                    <AddIcon fontSize="medium" />
                </NewElement>
            </Stack>
            <Dialog
                open={status}
                fullWidth={true}
                maxWidth={"xl"}
                onClose={handleClose}
                aria-labelledby="alert-dialog-titlel"
                aria-describedby="alert-dialog-descriptionl"
            >
                
              {pageType}
                <DialogActions>

                </DialogActions>
            </Dialog>
        </div>
    );
}
