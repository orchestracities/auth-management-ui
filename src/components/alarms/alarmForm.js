import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';

import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import * as log from 'loglevel';

const CustomDialogTitle = styled(AppBar)({
    position: 'relative',
    background: 'white',
    boxShadow: 'none'
});

export default function AlarmForm({ title, close, action, tenantName_id, services, env }) {
    typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
    const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';
    const [msg, sendNotification] = useNotification();
    log.debug(msg);

    const handleClose = () => {
        close(false);
    };

    const [alarmType, setAlarmType] = React.useState("entity")
    const [pathSelected, setPathSelected] = React.useState('');

    const handleSave = () => {
        switch (action) {
            case 'create':

                break;
            case 'edit':
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <CustomDialogTitle>
                <Toolbar>
                    <IconButton edge="start" onClick={handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
                        {"alarmCreation"}
                    </Typography>
                    <Button autoFocus color="secondary" onClick={handleSave}>
                        save
                    </Button>
                </Toolbar>
            </CustomDialogTitle>
            <DialogContent sx={{ minHeight: '400px' }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>
                                {'Alarm type'}
                            </InputLabel>
                            <Select
                                labelId={'Alarm type'}
                                id={'Alarm type'}
                                key={'Alarm type'}
                                value={alarmType}
                                variant="outlined"
                                onChange={(event) => {
                                    setAlarmType(event.target.value);
                                }}
                                label={'Alarm type'}
                                sx={{
                                    width: '100%'
                                }}
                                input={<OutlinedInput label={"Alarm Type"} />}
                            >
                                <MenuItem key={"entity"} value={"entity"}>
                                    {"entity"}
                                </MenuItem>
                                <MenuItem key={"entity"} value={"path"}>
                                    {"path"}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {(alarmType === "entity") ? "" : <ServicePath services={services} setPathSelected={setPathSelected}></ServicePath>}
                </Grid>
            </DialogContent>
        </div>
    );
}


function ServicePath({ setPathSelected, services }) {


    return (

        <Grid item xs={12}>
            <Autocomplete
                id="pathSelector"
                sx={{ width: '100%' }}
                options={services}
                autoHighlight
                getOptionLabel={(option) => option.path}
                isOptionEqualToValue={(option, value) => option.path === value.path}
                onChange={(event, value) => setPathSelected(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={<Trans>service.form.parentPath</Trans>}
                        variant="outlined"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'newPath'
                        }}
                    />
                )}
            />
        </Grid>

    );
}
