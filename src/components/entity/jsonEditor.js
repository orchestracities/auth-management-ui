import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import { JsonEditor } from 'jsoneditor-react';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));
const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function JsonEdit({ attribute, attributesMap, setAttributesMap, index }) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<AutoFixNormalIcon />}
          onClick={() => {
            handleClickOpen();
          }}
        >
          {'Edit JSON of: ' + attribute.name}
        </Button>
      </Grid>
      <DialogRounded
        TransitionComponent={Transition}
        open={open}
        fullScreen={fullScreen}
        maxWidth={'xl'}
        fullWidth={true}
        onClose={handleClose}
      >
        <CustomDialogTitle>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </CustomDialogTitle>
        <DialogContent sx={{ minHeight: '400px' }}>
          <JsonEditor
            key={index}
            value={attribute.value}
            onChange={(value) => {
              const newArray = attributesMap;
              newArray[Number(index)].value = value;
              setAttributesMap([...[], ...newArray]);
            }}
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  );
}
