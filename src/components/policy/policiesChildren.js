import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from "axios"
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink
} from "react-router-dom";


export default function PoliciesChildren({ tenantId, tenantName, seTenant }) {
  //services
  const [services, setServices] = React.useState([{ children: [] }]);
  const getServices = () => {
    axios.get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/tenants/' + tenantId + "/service_paths")
      .then((response) => {
        getPolicies(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  }
  //policies
  const [policies, setPolicies] = React.useState([{ children: [] }]);
  const getPolicies = (servicesResponse) => {
    let datAccumulator = [];
    for (let service of servicesResponse) {
      axios.get(process.env.REACT_APP_ANUBIS_API_URL + 'v1/policies', {
        headers: {
          "fiware_service": tenantName,
          "fiware_service_path": service.path
        }
      })
        .then((response) => {
          response.data.forEach(e => e.fiware_service = tenantId);
          response.data.forEach(e => e.fiware_service_path = service.path);
          datAccumulator = [...datAccumulator, ...response.data];
          setPolicies(datAccumulator);
        })
        .catch((e) => {
          console.error(e);
        });
    }
    console.log(policies);
  }

  const reiderect = () => {
    seTenant(tenantId)
  }

  React.useEffect(() => {
    getServices();
  }, [tenantId]);


  return (
    <NavLink to={"/Policy"}>
      <IconButton aria-label="service" onClick={reiderect}>
        <Badge badgeContent={policies.length} color="secondary">
          <ContentCopyIcon color="primary" fontSize="large" />
        </Badge>
      </IconButton>
    </NavLink>
  )

}