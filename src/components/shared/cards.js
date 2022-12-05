import * as React from 'react';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import MultifunctionButton from './speedDial';
import ServiceChildren from '../service/serviceChildren';
import PoliciesChildren from '../policy/policiesChildren';
import IconList from '../tenant/iconList';
import axios from 'axios';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

const RadiusDiv = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  background: theme.palette.primary.light.replace(')', ' / 70% )').replace(/,/g, ''),
  color: theme.palette.primary.contrastText,
  maxWidth: 550
}));

export default function DashboardCard({ pageType, data, getData, seTenant, colors, tenantName_id, env, token }) {
  const [subpathOpen, setSubpathOpen] = React.useState(false);
  const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';

  const [status, setOpen] = React.useState(false);
  const props = { close: setOpen };
  const listOfIcons = IconList();
  const iconMapper = (iconName) => {
    const thisIcon = listOfIcons.filter((e) => e.name === iconName);
    return thisIcon[0].name !== 'none' ? thisIcon[0].icon : data.name[0];
  };
  const layout = React.cloneElement(pageType, props);

  const cardColor = typeof colors !== 'undefined' ? colors.primaryColor : data.props.primaryColor;

  const avatarColor = layout.props.action === 'Sub-service-creation' ? colors.secondaryColor : data.props.primaryColor;

  const [allPaths, setAllPaths] = React.useState([]);
  const getPaths = () => {
    axios
      .get(anubisURL + 'v1/tenants/' + layout.props.tenantName_id.name + '/service_paths?name=' + data.path)
      .then((results) => {
        setAllPaths(results.data);
      });
  };

  React.useEffect(() => {
    layout.props.action === 'Sub-service-creation' ? getPaths() : '';
  }, [data]);

  return (
    <RadiusDiv
      boxShadow={5}
      sx={{
        background: layout.props.action === 'Sub-service-creation' ? cardColor : '#8086bab8'
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: avatarColor
            }}
            aria-label="recipe"
            src={typeof data.props !== 'undefined' && data.props.icon === 'custom' ? data.props.customImage : ''}
          >
            {layout.props.action === 'Sub-service-creation' ? data.path[1] : iconMapper(data.props.icon)}
          </Avatar>
        }
        action={
          <MultifunctionButton
            id={'multifucntionButton' + tenantName_id}
            token={token}
            data={data}
            env={env}
            getData={getData}
            pageType={layout}
            setOpen={setOpen}
            status={status}
          ></MultifunctionButton>
        }
        title={layout.props.action === 'Sub-service-creation' ? data.path : data.name}
        subheader={
          <Tooltip title={data.id} arrow>
            <Typography variant="body2" noWrap gutterBottom sx={{ maxWidth: '70%', color: 'white' }}>
              {data.id}
            </Typography>
          </Tooltip>
        }
      />
      <CardContent>
        <Typography variant="body2">
          {layout.props.action === 'Sub-service-creation' ? layout.props.tenantName_id.name : ''}
        </Typography>
      </CardContent>
      <CardActions>
        <ServiceChildren
          env={env}
          setOpen={setSubpathOpen}
          tenantName_id={tenantName_id}
          status={subpathOpen}
          data={layout.props.action !== 'Sub-service-creation' ? data.service_paths : allPaths}
          masterTitle={layout.props.action !== 'Sub-service-creation' ? data.name : data.path}
          color={avatarColor}
          getData={layout.props.action !== 'Sub-service-creation' ? getData : getPaths}
        />
        {layout.props.action === 'Sub-service-creation' ? (
          ''
        ) : (
          <PoliciesChildren
            env={env}
            color={avatarColor}
            tenantId={data.id}
            tenantName={data.name}
            seTenant={seTenant}
          ></PoliciesChildren>
        )}
      </CardActions>
    </RadiusDiv>
  );
}
