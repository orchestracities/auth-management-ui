import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';

const bottomStyle = {
  position: 'fixed',
  bottom: '25px',
  right: '25px',
  zIndex: 15
};

const NewElement = styled(IconButton)(({ theme }) => ({
  borderRadius: 15,
  background: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    background: theme.palette.secondary.main
  }
}));

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function AddButton({ pageType, setOpen, status }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box boxShadow={5}>
      <Stack direction="row" sx={bottomStyle}>
        <NewElement aria-label="delete" size="large" onClick={handleClickOpen}>
          <AddIcon fontSize="medium" />
        </NewElement>
      </Stack>
      <DialogRounded
        TransitionComponent={Transition}
        open={status}
        fullScreen={fullScreen}
        maxWidth={'xl'}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-titlel"
        aria-describedby="alert-dialog-descriptionl"
      >
        {pageType}
        <DialogActions></DialogActions>
      </DialogRounded>
    </Box>
  );
}
