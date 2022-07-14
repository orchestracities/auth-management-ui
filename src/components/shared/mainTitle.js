import React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const CustomMainTitle = styled(Typography)({
  marginTop: '40px',
  marginBottom: '30px'
});

export class MainTitle extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    return (
      <CustomMainTitle variant="h3" component="div" sx={{ fontWeight: 'bold' }} gutterBottom={true}>
        {this.props.mainTitle}
      </CustomMainTitle>
    );
  }
}
