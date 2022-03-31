import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MultifunctionButton from './speedDial';
import Badge from '@mui/material/Badge';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ServiceChildren from '../service/serviceChildren';
import PoliciesChildren from '../policy/policiesChildren';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',   
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const RadiusDiv =styled('div')({
  borderRadius:"15px",
  background:"#8a93e140",
  maxWidth: 550, 
 });


export default function DashboardCard({pageType,data,getData,seTenant}) {

 const [subpathOpen, setSubpathOpen]= React.useState(false);
 const [status, setOpen] = React.useState(false);
 const props={close:setOpen};
 const layout = React.cloneElement(pageType, props);
 
 return (
    <RadiusDiv key={data.id}>
    <CardHeader
    avatar={
      <Avatar sx={{ bgcolor: "#8086ba" }} aria-label="recipe">
        {(layout.props.title==="New Sub-service")?data.path[1]:data.name[0]}
      </Avatar>
    }
    action={
      <MultifunctionButton  key={data.id} data={data} getData={getData} pageType={layout} setOpen={setOpen} status={status}></MultifunctionButton>
    }
    title=   {(layout.props.title==="New Sub-service")?data.path:data.name}
    subheader=  {data.id}
  />
    
     
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {(layout.props.title==="New Sub-service")? layout.props.tenantName_id[0].name:"description"}
        </Typography>
      </CardContent>
      <CardActions>
      {(layout.props.title==="New Sub-service")?"": <PoliciesChildren tenantId={data.id} tenantName={data.name} seTenant={seTenant}></PoliciesChildren>}
     
        <ServiceChildren setOpen={setSubpathOpen} status={subpathOpen} data={(layout.props.title==="Edit Tenant")?data.service_paths.slice(1):data.children} masterTitle={(layout.props.title==="Edit Tenant")?data.name:data.path} getData={getData}/>
    
       
      </CardActions>
      
   
    </RadiusDiv>
  );
}