import * as React from 'react';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import EndpointsForm from './endpointsForm';

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function EndpointsTable({ token, resourceTypeData, env, getTheResources }) {
  const rows = [resourceTypeData];
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
            <TableCell component="th" align="left" scope="row" padding="none">
              {row.endpointUrl}
            </TableCell>
            <TableCell component="th" align="right" scope="row" padding="none" onClick={handlePropagation}>
              <Tooltip title="Modify the link">
                <IconButton>
                  <EditIcon onClick={() => setOpen(true)} color={'secondary'} />
                </IconButton>
              </Tooltip>
            </TableCell>
          </>
        );
      })}
      <DialogRounded
        onClick={(e) => handlePropagation(e)}
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
          title={'Edit the endpoint of ' + resourceTypeData.name}
          data={rows}
          close={handleClose}
          action={'modify'}
          token={token}
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
