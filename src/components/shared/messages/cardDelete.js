import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import axios from 'axios';
import { Trans } from 'react-i18next';
import useNotification from './alerts';
import * as log from 'loglevel';

const DialogDiv = styled('div')(() => ({
  background: '#ff000040'
}));
const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

export default function DeleteDialog({ open, onClose, getData, data, env, token }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';

  const [msg, sendNotification] = useNotification();
  log.debug(msg);

  const httpLink = createHttpLink({
    uri: typeof env !== 'undefined' ? env.CONFIGURATION_API_URL : ''
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({ addTypename: false })
  });

  const urlMapper = (thisData) => {
    switch (true) {
      case typeof thisData.name !== 'undefined':
        return anubisURL + 'v1/tenants/' + thisData.id;
      case typeof thisData.path !== 'undefined':
        return anubisURL + 'v1/tenants/' + thisData.tenant_id + '/service_paths/' + thisData.id;
      case typeof thisData.access_to !== 'undefined':
        return anubisURL + 'v1/policies/' + thisData.id;
      case typeof thisData.type !== 'undefined':
        return thisData.entityEndpoint.split('?')[0] + '/' + thisData.id;
      default:
        break;
    }
  };
  const propertyMapper = (thisData) => {
    switch (true) {
      case typeof thisData.type !== 'undefined':
        return {
          headers: {
            'fiware-Service': thisData.tenant
          }
        };
      case typeof thisData.access_to !== 'undefined':
        return {
          headers: {
            policy_id: thisData.id,
            'fiware-service': thisData.fiware_service,
            'fiware-servicepath': thisData.fiware_service_path
          }
        };
      default:
        return {
          headers: {}
        };
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
      case typeof data.alarm_type !== 'undefined':
        return 'alarm: ' + data.id;
      default:
        break;
    }
  };

  const deleteTenantConfiguration = (tenantName) => {
    client
      .mutate({
        mutation: gql`
          mutation removeTenantConfig($tenantName: String!) {
            removeTenantConfig(tenantName: $tenantName) {
              name
              icon
              primaryColor
              secondaryColor
            }
          }
        `,
        variables: { tenantName: tenantName }
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  const deleteAlarm = () => {
    client
      .mutate({
        mutation: gql`
          mutation deleteAlarm($id: String!, $operation: String!) {
            deleteAlarm(id: $id, operation: $operation) {
              id
              alarm_type
              tenant
              servicepath
              entity_id
              entity_type
              channel_type
              channel_destination
              time_unit
              max_time_since_last_update
              alarm_frequency_time_unit
              alarm_frequency_time
              time_of_last_alarm
              status
            }
          }
        `,
        variables: { id: data.id, operation: 'MONGO' }
      })
      .then(() => {
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
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  const deletElement = () => {
    if (typeof data.multiple !== 'undefined') {
      for (const thisData of data.dataValues) {
        axios
          .delete(urlMapper(thisData), propertyMapper(thisData))
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
      let header = typeof data.name !== 'undefined' ? { headers: { authorization: `Bearer ${token}` } } : {};
      axios
        .delete(urlMapper(data), header)
        .then(() => {
          // delete tenant from graphql
          deleteTenantConfiguration(data.name);
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
          if (e.response.data)
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
          <Button
            onClick={typeof data.alarm_type !== 'undefined' ? deleteAlarm : deletElement}
            autoFocus
            color="secondary"
          >
            <Trans>common.deleteButton</Trans>
          </Button>
        </DialogActions>
      </DialogDiv>
    </DialogRounded>
  );
}
