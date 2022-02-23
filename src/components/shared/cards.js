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


export default function DashboardCard(data) {
 
  return (
    <RadiusDiv>
    <CardHeader
    avatar={
      <Avatar sx={{ bgcolor: "#8086ba" }} aria-label="recipe">
        T
      </Avatar>
    }
    action={
      <MultifunctionButton></MultifunctionButton>
    }
    title="Tenant Name"
    subheader="Tenant ID"
  />
    
     
      <CardContent>
        <Typography variant="body2" color="text.secondary">
        Description
        </Typography>
      </CardContent>
      <CardActions>
     
        <IconButton aria-label="service">
        <Badge badgeContent={4} color="secondary">
        <ContentCopyIcon sx={{color:"#536BBF"}}  fontSize="large"/>
      </Badge>
        </IconButton>
        <IconButton aria-label="path">
        <Badge badgeContent={6} color="success">
        <SecurityIcon sx={{color:"#536BBF"}}  fontSize="large"/>
      </Badge>
        </IconButton>
       
      </CardActions>
      
   
    </RadiusDiv>
  );
}