import PropTypes from 'prop-types';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';

/**
 * Primary UI component for user interaction
 */

const bottomStyle = {
  position: 'fixed',
  bottom: '50px',
  right: '20px'
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

export const AddButton = ({ status, pageType, setOpen }) => {
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
};

AddButton.propTypes = {
  /**
   * is the hook value that decide if the modal is open or not
   */
  status: PropTypes.bool,
  /**
   * is the element that will be rendered inside the modal, a form is recommended
   */
  pageType: PropTypes.any,
  /**
   * is the hook function that is changing the hook value
   */
  setOpen: PropTypes.func,
  /**
   * check if graphql is offline and change the height of the element inside the page
   */
  graphqlErrors: PropTypes.any
};

AddButton.defaultProps = {
  status: false,
  pageType: undefined,
  setOpen: undefined,
  graphqlErrors: false
};
