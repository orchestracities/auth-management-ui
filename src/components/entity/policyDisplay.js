import * as React from 'react';
import * as log from 'loglevel';
import PolicyIcon from '@mui/icons-material/Policy';
import axios from 'axios';
import useNotification from '../shared/messages/alerts';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

export default function PoliciesOnEntity({ env, token, GeTenantData, thisEntity, entityPolicies, handlePolicies }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const [msg, sendNotification] = useNotification();
  console.log(msg);
  const [policiesCounter, setPoliciesCounter] = React.useState(0);

  const getPoliciesCounter = (ID) => {
    const queryParameters = ID !== null ? '&resource=' + ID : '';
    axios
      .get(
        (typeof env !== 'undefined' ? env.ANUBIS_API_URL : '') + 'v1/policies' + '/?skip=0&limit=1' + queryParameters,
        {
          headers: {
            'fiware-service': GeTenantData('name'),
            authorization: `Bearer ${token}`
          }
        }
      )
      .then((response) => setPoliciesCounter(response.headers['counter']))
      .catch((e) => {
        e.response
          ? e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }))
          : sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
      });
  };
  React.useEffect(() => {
    getPoliciesCounter(thisEntity.id);
  }, []);
  React.useEffect(() => {
    getPoliciesCounter(thisEntity.id);
  }, [entityPolicies]);

  return (
    <IconButton
      aria-label="seePolicies"
      color="secondary"
      key={'policies' + thisEntity.id}
      onClick={() => handlePolicies(thisEntity)}
      disabled={policiesCounter <= 0 ? true : false}
    >
      <Badge badgeContent={policiesCounter} color="secondary">
        <PolicyIcon />
      </Badge>
    </IconButton>
  );
}
