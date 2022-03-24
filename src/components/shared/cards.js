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


export default function DashboardCard({pageType,setOpen,status,data,getData}) {

 const [subpathOpen, setSubpathOpen]= React.useState(false);

  return (
    <RadiusDiv>
    <CardHeader
    avatar={
      <Avatar sx={{ bgcolor: "#8086ba" }} aria-label="recipe">
        {(pageType.props.title==="Edit Service")?data.path[1]:data.name[0]}
      </Avatar>
    }
    action={
      <MultifunctionButton data={data} getData={getData} pageType={pageType} setOpen={setOpen} status={status}></MultifunctionButton>
    }
    title=   {(pageType.props.title==="Edit Service")?data.path:data.name}
    subheader=  {data.id}
  />
    
     
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        {(pageType.props.title==="Edit Service")? pageType.props.tenantName_id[0].name:"description"}
        </Typography>
      </CardContent>
      <CardActions>
      {(pageType.props.title==="Edit Service")?"":   <IconButton aria-label="service">
        <Badge badgeContent={4} color="secondary">
        <ContentCopyIcon sx={{color:"#536BBF"}}  fontSize="large"/>
      </Badge>
        </IconButton>}
     
        <ServiceChildren setOpen={setSubpathOpen} status={subpathOpen} data={(pageType.props.title==="Edit Tenant")?data.service_paths.slice(1):data.children} masterTitle={(pageType.props.title==="Edit Tenant")?data.name:data.path} getData={getData}/>
    
       
      </CardActions>
      
   
    </RadiusDiv>
  );
}