import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import PolicyIcon from '@mui/icons-material/Policy';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import useNotification from '../shared/messages/alerts';
import * as log from 'loglevel';

export default function PoliciesChildren({ tenantId, tenantName, seTenant, color, env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';
  // services
  const [msg, sendNotification] = useNotification();
  log.debug(msg);
  const getServices = () => {
    axios
      .get(anubisURL + 'v1/tenants/' + tenantId + '/service_paths')
      .then((response) => {
        getPolicies(response.data);
      })
      .catch((e) => {
        if (e.response) {
          e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
        } else {
          sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
        }
      });
  };
  // policies
  const [policies, setPolicies] = React.useState([{ children: [] }]);
  const getPolicies = (servicesResponse) => {
    let datAccumulator = [];
    for (const service of servicesResponse) {
      axios
        .get(anubisURL + 'v1/policies', {
          headers: {
            'fiware-service': tenantName,
            'fiware-servicepath': service.path
          }
        })
        .then((response) => {
          response.data.forEach((e) => (e.fiware_service = tenantId));
          response.data.forEach((e) => (e.fiware_service_path = service.path));
          datAccumulator = [...datAccumulator, ...response.data];
          setPolicies(datAccumulator);
        })
        .catch((e) => {
          if (e.response) {
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          } else {
            sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
          }
        });
    }
  };

  const reiderect = () => {
    seTenant(tenantId);
  };

  React.useEffect(() => {
    getServices();
  }, [tenantId]);

  return (
    <NavLink to={'/Policy'}>
      <IconButton aria-label="service" onClick={reiderect}>
        <Badge badgeContent={policies.length} color="primary">
          <PolicyIcon
            sx={{
              color: color
            }}
            fontSize="large"
          />
        </Badge>
      </IconButton>
    </NavLink>
  );
}
