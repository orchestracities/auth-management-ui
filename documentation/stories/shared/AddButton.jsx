import React from 'react';
import PropTypes from 'prop-types';
import * as React from "react";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
/**
 * Primary UI component for user interaction
 */

 const bottomStyle = {
  position: "fixed",
  bottom: "50px",
  right: "20px",
};

const NewElement = styled(IconButton)(({ theme }) => ({
  borderRadius: 15,
  background: theme.palette.secondary.main,
  color: "white",
  "&:hover": {
    background: theme.palette.secondary.main,
  },
}));

const DialogRounded = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-rounded": {
    borderRadius: 15,
  },
}));

export const AddButton = ({ primary, backgroundColor, size, label, ...props }) => {
  const mode = primary ? 'storybook-button--primary' : 'storybook-button--secondary';
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(' ')}
      style={backgroundColor && { backgroundColor }}
      {...props}
    >
      {label}
    </button>
  );
};

AddButton.propTypes = {
  /**
   * Is this the principal call to action on the page?
   */
   status: PropTypes.bool,
  /**
   * What background color to use
   */
  backgroundColor: PropTypes.string,
  /**
   * How large should the button be?
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * Button contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
   setOpen: PropTypes.func,
};

AddButton.defaultProps = {
  backgroundColor: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
};
