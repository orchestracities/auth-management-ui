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
const RadiusDiv =styled('div')(({ theme }) => ({
  borderRadius:"15px",
  background:(theme.palette.primary.light.replace(")"," / 70% )")).replace(/,/g,""),
  color:theme.palette.primary.contrastText,
  maxWidth: 550, 
 }));


export default function DashboardCard({pageType,data,getData,seTenant}) {

 const [subpathOpen, setSubpathOpen]= React.useState(false);
 const [status, setOpen] = React.useState(false);
 const props={close:setOpen};
 const layout = React.cloneElement(pageType, props);
 const incrementColor = (color, step)=>{
  let colorToInt = parseInt(color.substr(1), 16),                   
      nstep = parseInt(step);                                        
  if(!isNaN(colorToInt) && !isNaN(nstep)){                          
      colorToInt += nstep;                                           
      let ncolor = colorToInt.toString(16);                         
      ncolor = '#' + (new Array(7-ncolor.length).join(0)) + ncolor;   
      if(/^#[0-9a-f]{6}$/i.test(ncolor)){                            
          return ncolor;
      }
  }
  return color;
};
 return (
    <RadiusDiv key={data.id} sx={{ background: (layout.props.title==="New Sub-service")?"":"#8086bab8" }}>
    <CardHeader
    avatar={
      <Avatar sx={{ bgcolor: (layout.props.title==="New Sub-service")?incrementColor(layout.props.tenantName_id[0].props.primaryColor, Math.floor(Math.random() * 500)-20): data.props.primaryColor}} aria-label="recipe">
        {(layout.props.title==="New Sub-service")?data.path[1]:data.name[0]}
      </Avatar>
    }
    action={
      <MultifunctionButton  key={data.id} data={data} getData={getData} pageType={layout} setOpen={setOpen} status={status}></MultifunctionButton>
    }
    title=   {(layout.props.title==="New Sub-service")?data.path:data.name}
    subheader=  { <Typography variant="body2" >{data.id}</Typography>}
  />
    
     
      <CardContent>
        <Typography variant="body2" >
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