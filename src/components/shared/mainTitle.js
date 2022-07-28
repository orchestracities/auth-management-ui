import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

theme.typography.h3 = {
  [theme.breakpoints.up('xs')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.5rem'
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3.2rem'
  },
  [theme.breakpoints.up('lg')]: {
    fontSize: '3.8rem'
  },
  [theme.breakpoints.up('xl')]: {
    fontSize: '4.2rem'
  }
};

const CustomMainTitle = styled(Typography)({
  marginTop: '40px',
  marginBottom: '30px'
});

export default function MainTitle({ mainTitle }) {
  return (
    <ThemeProvider theme={theme}>
      <CustomMainTitle variant="h3" component="div" sx={{ fontWeight: 'bold' }} gutterBottom={true}>
        {mainTitle}
      </CustomMainTitle>
    </ThemeProvider>
  );
}
