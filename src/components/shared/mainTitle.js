import React from 'react';
import Typography from '@mui/material/Typography';


export class MainTitle extends React.Component {

      constructor(props) {
        super(props);
        console.log(props)
    }

  
    render() {
        return( <Typography variant="h2" component="div" sx={{ fontWeight: "bold" }} gutterBottom={true}>
           {this.props.mainTitle}
        </Typography>);
    }

}