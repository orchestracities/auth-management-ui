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


const DialogDiv = styled('div')({
    background: "#ff000040",
});


export default function DeleteDialog(props) {
    const { open, onClose, getData, data } = props;

    const deleteMapper = (thisData) => {


        switch (true) {
            case typeof thisData.name !== "undefined":
                return process.env.REACT_APP_ANUBIS_API_URL + 'v1/tenants/' + thisData.id;
                break;
            case typeof thisData.path !== "undefined":
                return process.env.REACT_APP_ANUBIS_API_URL + 'v1/tenants/' + thisData.tenant_id + "/service_paths/" + thisData.id;
                break;
            case typeof thisData.access_to !== "undefined":
                return process.env.REACT_APP_ANUBIS_API_URL + 'v1/policies/' + thisData.id;
                break;
            default:
                break;
        }
    }

    const uiMapper = () => {
        switch (true) {
            case typeof data.name !== "undefined":
                return data.name;
                break;
            case typeof data.path !== "undefined":
                return data.path;
                break;
            case typeof data.multiple !== "undefined":
                return data.selectedText;
                break;
            case typeof data.access_to !== "undefined":
                return "";
                break;
            default:
                break;
        }
    }

    const deletElement = () => {
        if (typeof data.multiple !== "undefined") {
            for (let thisData of data.dataValues) {
                axios.delete(deleteMapper(thisData),
                    (typeof thisData.access_to !== "undefined")
                        ?
                        {
                            headers: {
                                "fiware_service": thisData.fiware_service,
                                "fiware_service_path": thisData.fiware_service_path
                            }
                        }
                        :
                        {
                            headers: {

                            }
                        })
                    .then((response) => {
                        getData();
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            }
            data.setSelected([]);
            onClose(false);

        } else {
            axios.delete(deleteMapper(data))
                .then((response) => {
                    onClose(false);
                    getData();
                })
                .catch((e) => {
                    console.error(e);
                });
        }

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
                        {"Are you really sure about deleting:" + uiMapper() + " ?"}
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

