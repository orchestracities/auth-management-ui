import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { Trans } from 'react-i18next';
import useNotification from './alerts';
import { getEnv } from '../../../env';
import * as log from 'loglevel';

const env = getEnv();

const DialogDiv = styled('div')(() => ({
  background: '#ff000040'
}));
const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

export default function DeleteDialog(props) {
  log.setLevel(env.CONSOLE);
  const [msg, sendNotification] = useNotification();
  log.debug(msg);
  const { open, onClose, getData, data } = props;

  const deleteMapper = (thisData) => {
    switch (true) {
      case typeof thisData.name !== 'undefined':
        return env.ANUBIS_API_URL + 'v1/tenants/' + thisData.id;
      case typeof thisData.path !== 'undefined':
        return env.ANUBIS_API_URL + 'v1/tenants/' + thisData.tenant_id + '/service_paths/' + thisData.id;
      case typeof thisData.access_to !== 'undefined':
        return env.ANUBIS_API_URL + 'v1/policies/' + thisData.id;
      default:
        break;
    }
  };

  const uiMapper = () => {
    switch (true) {
      case typeof data.name !== 'undefined':
        return data.name;
      case typeof data.path !== 'undefined':
        return data.path;
      case typeof data.multiple !== 'undefined':
        return data.selectedText;
      case typeof data.access_to !== 'undefined':
        return '';
      default:
        break;
    }
  };

  const deletElement = () => {
    if (typeof data.multiple !== 'undefined') {
      for (const thisData of data.dataValues) {
        axios
          .delete(
            deleteMapper(thisData),
            typeof thisData.access_to !== 'undefined'
              ? {
                  headers: {
                    policy_id: thisData.id,
                    'fiware-service': thisData.fiware_service,
                    'fiware-servicepath': thisData.fiware_service_path
                  }
                }
              : {
                  headers: {}
                }
          )
          .then(() => {
            getData();
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessDelete"
                  values={{
                    data: thisData.id
                  }}
                />
              ),
              variant: 'info'
            });
          })
          .catch((e) => {
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          });
      }
      data.setSelected([]);
      onClose(false);
    } else {
      axios
        .delete(deleteMapper(data))
        .then(() => {
          onClose(false);
          getData();
          sendNotification({
            msg: (
              <Trans
                i18nKey="common.messages.sucessDelete"
                values={{
                  data: data.id
                }}
              />
            ),
            variant: 'info'
          });
        })
        .catch((e) => {
          e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
        });
    }
  };
  const handleClose = () => {
    onClose(false);
  };

  return (
    <DialogRounded
      open={open}
      fullWidth={true}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogDiv>
        <DialogTitle id="alert-dialog-title">
          <Trans>common.deleteTextTitle</Trans>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Trans>common.deleteText</Trans>
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">{uiMapper() + ' ?'}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deletElement} autoFocus color="secondary">
            <Trans>common.deleteButton</Trans>
          </Button>
        </DialogActions>
      </DialogDiv>
    </DialogRounded>
  );
}
