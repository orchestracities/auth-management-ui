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
import VanillaJSONEditor from '../shared/vanillaJsonEditor';
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import { Trans } from 'react-i18next';
import isJSON from 'validator/lib/isJSON';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';

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

const JSONEditButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 15,
  marginTop: 15,
  background: theme.palette.secondary.main,
  color: 'white',
  '&:hover': {
    background: theme.palette.secondary.main
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function JsonEdit({ attribute, attributesMap, setAttributesMap, index }) {
  const [open, setOpen] = React.useState(false);
  const [content, setContent] = React.useState(
    attribute.value !== ''
      ? {
          json: attribute.value,
          text: undefined
        }
      : {
          json: {},
          text: undefined
        }
  );
  React.useEffect(() => {
    const newArray = attributesMap;
    (typeof content.json !== 'undefined' || typeof content.text !== 'undefined') &&
    isJSON(typeof content.json !== 'undefined' ? JSON.stringify(content.json) : content.text)
      ? typeof content.json !== 'undefined'
        ? (newArray[Number(index)].value = content.json)
        : (newArray[Number(index)].value = JSON.parse(content.text))
      : '';
    setAttributesMap([...[], ...newArray]);
  }, [content]);
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
        <Tooltip
          title={
            <Trans
              i18nKey="entity.form.editJSON"
              values={{
                name: attribute.name
              }}
            />
          }
        >
          <JSONEditButton aria-label="EditMap" size="large" onClick={handleClickOpen}>
            <AutoFixNormalIcon fontSize="medium" />
          </JSONEditButton>
        </Tooltip>
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
          <VanillaJSONEditor content={content} readOnly={false} onChange={setContent} />
          {!isJSON(typeof content.json !== 'undefined' ? JSON.stringify(content.json) : content.text) ? (
            <Alert
              variant="filled"
              severity="info"
              sx={{
                bottom: '0px',
                width: '100%',
                padding: '0.5px 30px',
                fontSize: '0.75rem',
                zIndex: 1201
              }}
              icon={false}
            >
              <Trans>entity.form.JSONerror</Trans>
            </Alert>
          ) : (
            ''
          )}
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  );
}
