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
import axios from 'axios';
import InputAdornment from '@mui/material/InputAdornment';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';
import { getEnv } from '../../env';
import Autocomplete from '@mui/material/Autocomplete';

const env = getEnv();

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function ServiceForm({ title, close, action, service, tenantName_id, getServices }) {
  const [msg, sendNotification] = useNotification();
  console.log(msg);

  const handleClose = () => {
    close(false);
  };

  const [path, setPath] = React.useState('/');
  const [allPaths, setAllPaths] = React.useState([]);
  const [pathSelected, setPathSelected] = React.useState('');
  const getPaths = () => {
    axios
      .get(env.ANUBIS_API_URL + 'v1/tenants/' + tenantName_id.id + '/service_paths?name=' + service.path)
      .then((results) => {
        let mapper = [];
        results.data.map((thisPath) => mapper.push(thisPath.path));
        setAllPaths(mapper);
        setPathSelected(results.data[0].path);
      })
      .catch((e) => {
        sendNotification({ msg: e.response.data.detail, variant: 'error' });
      });
  };
  React.useEffect(() => {
    action === 'Sub-service-creation' ? getPaths() : '';
  }, []);
  const handleSave = () => {
    switch (action) {
      case 'create':
        axios
          .post(env.ANUBIS_API_URL + 'v1/tenants/' + tenantName_id.id + '/service_paths', {
            path
          })
          .then(() => {
            getServices();
            close(false);
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessCreate"
                  values={{
                    data: 'Service'
                  }}
                />
              ),
              variant: 'success'
            });
          })
          .catch((e) => {
            getServices();
            typeof e.response.data.detail === 'string'
              ? sendNotification({ msg: e.response.data.detail, variant: 'error' })
              : e.response.data.detail.map((msgObj) => sendNotification({ msg: msgObj.msg, variant: 'error' }));
          });
        break;
      case 'Sub-service-creation':
        axios
          .post(env.ANUBIS_API_URL + 'v1/tenants/' + tenantName_id.id + '/service_paths', {
            path: pathSelected + path
          })
          .then(() => {
            getServices();
            close(false);
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessCreate"
                  values={{
                    data: 'Sub-service'
                  }}
                />
              ),
              variant: 'success'
            });
          })
          .catch((e) => {
            getServices();
            typeof e.response.data.detail === 'string'
              ? sendNotification({ msg: e.response.data.detail, variant: 'error' })
              : e.response.data.detail.map((msgObj) => sendNotification({ msg: msgObj.msg, variant: 'error' }));
          });
        break;
      default:
        break;
    }
  };

  const cases = () => {
    switch (true) {
      case path[0] !== '/':
        return '/ should be the first char';
      case path.indexOf(' ') >= 0:
        return 'The string should be without spaces';
      case path[0] === '/' && typeof path[1] !== 'undefined':
        return '';
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
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="Tenant"
              label="Tenant"
              variant="outlined"
              defaultValue={tenantName_id.name}
              disabled
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          {action === 'Sub-service-creation' ? (
            <Grid item xs={12}>
              <Autocomplete
                id="sub-path-creation"
                sx={{ width: '100%' }}
                defaultValue={service.path}
                options={allPaths}
                autoHighlight
                getOptionLabel={(option) => option}
                onChange={(event, value) => setPathSelected(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={<Trans>service.form.parentPath</Trans>}
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'
                    }}
                  />
                )}
              />
            </Grid>
          ) : (
            ''
          )}
          <Grid item xs={12}>
            <TextField
              id="Path"
              label="Path"
              variant="outlined"
              defaultValue="/"
              sx={{
                width: '100%'
              }}
              onChange={(event) => {
                setPath(event.target.value);
              }}
              InputProps={
                action === 'Sub-service-creation'
                  ? {
                      startAdornment: <InputAdornment position="start">{pathSelected}</InputAdornment>
                    }
                  : ' '
              }
              helperText={cases()}
              error={path === '' || path.indexOf(' ') >= 0}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  );
}
