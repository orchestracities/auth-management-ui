import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import { Trans } from 'react-i18next';
import * as log from 'loglevel';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import { Grid } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { AuthorizedElement } from '../loginComponents/checkRoles';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { menu } from '../menu';

const HomePageItem = ({ item, tokenData, color }) => {
  return <LevelZero item={item} tokenData={tokenData} color={color} />;
};

const LevelOne = ({ item, tokenData }) => {
  const { t } = useTranslation();
  return item.withPermissions === false ? (
    <NavLink to={item.route}>
      <ListItem button>
        <ListItemText primary={t(item.title)} />
      </ListItem>
    </NavLink>
  ) : (
    <AuthorizedElement tokenDecoded={tokenData} iSuperAdmin={true}>
      <NavLink to={item.route}>
        <ListItem button>
          <ListItemText primary={t(item.title)} />
        </ListItem>
      </NavLink>
    </AuthorizedElement>
  );
};

const LevelZero = ({ item, tokenData, color }) => {
  const { t } = useTranslation();
  const { items: children } = item;

  return item.withPermissions === false ? (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <CardHeader avatar={<Avatar sx={{ bgcolor: color }}>{item.icon}</Avatar>} title={t(item.title)} />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {t(item.description)}
        </Typography>
        <List component="div" disablePadding>
          {children.map((child, key) => (
            <LevelOne key={key} item={child} tokenData={tokenData} />
          ))}
        </List>
      </CardContent>
    </Card>
  ) : (
    <AuthorizedElement tokenDecoded={tokenData} iSuperAdmin={true}>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <CardHeader avatar={<Avatar sx={{ bgcolor: color }}>{item.icon}</Avatar>} title={t(item.title)} />
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {t(item.description)}
          </Typography>
          <List component="div" disablePadding>
            {children.map((child, key) => (
              <LevelOne key={key} item={child} tokenData={tokenData} />
            ))}
          </List>
        </CardContent>
      </Card>
    </AuthorizedElement>
  );
};

export default function HomePage({ tokenData, thisTenant, tenantValues, env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const mainTitle = <Trans>menu.home.page_title</Trans>;
  const tenantFiltered = tenantValues.filter((e) => e.id === thisTenant);
  const tenantData = tenantFiltered[0];
  const color = tenantData && tenantData.props && tenantData.props.primaryColor ? tenantData.props.primaryColor : '';

  return (
    <Box sx={{ marginBottom: 15 }}>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <Grid container spacing={2}>
        {menu.map((item, key) => {
          return item.title !== 'menu.home.title' ? (
            <Grow
              key={key}
              in={true}
              style={{ transformOrigin: '0 0 0' }}
              {...(key === key ? { timeout: key * 600 } : {})}
            >
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <HomePageItem key={key} item={item} tokenData={tokenData} color={color} />
              </Grid>
            </Grow>
          ) : (
            ''
          );
        })}
      </Grid>
    </Box>
  );
}
