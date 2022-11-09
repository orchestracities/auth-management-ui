import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { lighten } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../shared/messages/alerts';
import EndpointsForm from './endpointsForm';

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const SecondaryColorRow = styled(TableRow)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: lighten(theme.palette.secondary.light, 0.7)
  },
  '&.Mui-selected:hover': {
    backgroundColor: lighten(theme.palette.secondary.light, 0.5)
  }
}));
export default function EndpointsTable({ token, resourceTypeName, env, getTheResources }) {
  const httpLink = createHttpLink({
    uri: typeof env !== 'undefined' ? env.CONFIGURATION_API_URL : ''
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  const [rows, setRows] = React.useState([]);
  const [msg, sendNotification] = useNotification();

  const getTheEndPoints = (resourceTypeName) => {
    client
      .query({
        query: gql`
          query getEndpoints($resourceTypeName: String!) {
            getEndpoints(resourceTypeName: $resourceTypeName) {
              name
              resourceTypeName
              nameAndID
            }
          }
        `,
        variables: { resourceTypeName: resourceTypeName }
      })
      .then((response) => setRows(response.data.getEndpoints))
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };
  React.useEffect(() => {
    getTheEndPoints(resourceTypeName);
    console.log(msg);
  }, []);



  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpen(false);
  };

  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  return rows.length > 0 ? (
    <>

      {rows.map((row) => {
        return (
          <>
            <TableCell component="th" align="left" scope="row" padding="none" >
              {row.name}
            </TableCell>
            <TableCell component="th" align="right" scope="row" padding="none" onClick={handlePropagation}>
              <Tooltip title="Modify the link">
                <IconButton>
                  <EditIcon onClick={() => setOpen(true)} color={"secondary"}/>
                </IconButton>
              </Tooltip>
            </TableCell>
          </>
        );
      })}
      <DialogRounded
       unmountonexit="true"
        open={open}
        fullWidth={true}
        maxWidth={'xl'}
        id="endpoint"
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="edit"
        aria-describedby="edit"
      >
        <EndpointsForm
          title={'Edit the endpoint of ' + resourceTypeName}
          data={rows}
          close={handleClose}
          action={'modify'}
          token={token}
          resourceTypeName={resourceTypeName}
          env={env}
          getTheResources={getTheResources}
        />
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  ) : (
    <></>
  );
}
