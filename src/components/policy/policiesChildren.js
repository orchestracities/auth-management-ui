import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import axios from "axios"



export default function PoliciesChildren({tenantId,tenantName})  {
 //services
 const [services, setServices] = React.useState([{ children: [] }]);
 const getServices = () => {
   axios.get(process.env.REACT_APP_API_LOCATION + 'v1/tenants/' + tenantId + "/service_paths")
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
     axios.get(process.env.REACT_APP_API_LOCATION + 'v1/policies', {
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


 React.useEffect(() => {
    getServices();  
  }, [tenantId]);


  return (
    <IconButton aria-label="service">
    <Badge badgeContent={policies.length} color="secondary">
    <ContentCopyIcon sx={{color:"#536BBF"}}  fontSize="large"/>
  </Badge>
    </IconButton>
  )

}