import * as React from 'react';
import MainTitle from '../components/shared/mainTitle';
import { Trans } from 'react-i18next';
import * as log from 'loglevel';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { Grow } from '@mui/material';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';

export default function NotAuthorizedPage({ env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const mainTitle = <Trans>common.notAuthorized</Trans>;

  return (
    <Box>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <Grid container spacing={2}>
        <Grow in={true} style={{ transformOrigin: '0 0 0' }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography align="center" sx={{ fontSize: '12rem', fontWeight: 'bold', color: '#8086ba' }}>
              403
            </Typography>
            <NavLink to="/">
              <Typography align="center" sx={{ fontSize: '2rem', fontWeight: 'bold', color: '#8086ba' }}>
                <Trans>common.goHomePage</Trans>
              </Typography>
            </NavLink>
          </Grid>
        </Grow>
      </Grid>
    </Box>
  );
}
