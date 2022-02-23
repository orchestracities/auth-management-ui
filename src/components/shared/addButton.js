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


export default function AddButton(pageType) {
    const [open, setOpen] = React.useState(false);

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
                open={open}
                fullWidth={true}
                maxWidth={"xl"}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              
            >
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
                            New Tenant
                        </Typography>
                        <Button autoFocus color="secondary" onClick={handleClose}>
                            save
                        </Button>
                    </Toolbar>
                </CustomDialogTitle>
                <DialogContent   sx={{minHeight:"400px"}}>
                    <Grid container
                        spacing={3}
                        >
                        <Grid item xs={12}>
                            <TextField id="Name" label="Name" variant="outlined"   sx={{
                         width: '100%',
                       }}/>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField id="Description" label="Description" variant="outlined"   sx={{
                         width: '100%',
                       }}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </div>
    );
}
