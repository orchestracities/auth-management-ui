import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

const bottomStyle = {
  position: 'fixed',
  bottom: '25px',
  right: '25px'
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

export default function AddButton({ pageType, setOpen, status }) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Stack direction="row" sx={bottomStyle}>
        <NewElement aria-label="delete" size="large" onClick={handleClickOpen}>
          <AddIcon fontSize="medium" />
        </NewElement>
      </Stack>
      <DialogRounded
        open={status}
        fullWidth={true}
        maxWidth={'xl'}
        onClose={handleClose}
        aria-labelledby="alert-dialog-titlel"
        aria-describedby="alert-dialog-descriptionl"
      >
        {pageType}
        <DialogActions></DialogActions>
      </DialogRounded>
    </div>
  );
}
