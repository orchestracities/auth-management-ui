import * as React from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import axios from "axios"


const DialogDiv =styled('div')({
    background:"#ff000040",
   });

   
export default function DeleteDialog(props) {
    const {open,onClose,getTenants,data} = props;

    const deletElement = () => {
        axios.delete(process.env.REACT_APP_API_LOCATION+'v1/tenants/'+data.id)
        .then((response) => {
            onClose(false);
            getTenants();
        })
        .catch((e) => 
        {
          console.error(e);
        });
      
      };
      const handleClose = () => {
       
            onClose(false);
       
      };
    
    return (
        <Dialog
            open={open}
            fullWidth={true}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogDiv>
            <DialogTitle id="alert-dialog-title">
                {"Are you sure?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  { "Are you really sure about deleting:" +data.name+" ?"}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={deletElement} autoFocus color="secondary">
                    DELETE
                </Button>
            </DialogActions>
            </DialogDiv>
        </Dialog>
    );
}

