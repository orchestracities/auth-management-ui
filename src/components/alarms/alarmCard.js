import * as React from 'react';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import Collapse from '@mui/material/Collapse';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { Trans } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import DeleteDialog from '../shared/messages/cardDelete';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import RouteIcon from '@mui/icons-material/Route';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const RadiusDiv = styled(Box)(({ theme }) => ({
  borderRadius: '15px',
  background: theme.palette.primary.light.replace(')', ' / 70% )').replace(/,/g, ''),
  color: theme.palette.primary.contrastText,
  maxWidth: 550
}));

const CustomList = styled(List)(() => ({
  width: '100%',
  padding: '0 !important',
  marginLeft: 16,
  marginRight: 16,
  cursor: 'pointer'
}));

const ListTypo = styled(Typography)(({ theme }) => ({
  display: 'inline',
  color: theme.palette.getContrastText(theme.palette.primary.main)
}));

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const CustomDivider = styled(Divider)(({ theme }) => ({
  borderColor: theme.palette.getContrastText(theme.palette.primary.main),
  marginRight: '36px'
}));

const fabProps = {
  sx: {
    background: '#8a93e100',
    color: '#555555e3',
    boxShadow: 'none',
    '&:hover': {
      background: '#8a93e140'
    }
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});
const MultifunctionButton = ({ pageType, setOpen, status, data, getData, env, token }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // DELETE
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const actions = [
    {
      icon: <EditIcon />,
      id: 'multifunctional',
      name: <Trans>tenant.card.tooltip.editIcon</Trans>,
      click: handleClickOpen
    },
    {
      icon: <DeleteIcon color="error" />,
      id: 'delete',
      name: <Trans>common.deleteTooltip</Trans>,
      click: handleClickOpenDeleteDialog
    }
  ];
  return (
    <Box
      sx={{
        height: 60,
        transform: 'translateZ(0px)',
        flexGrow: 1,
        zIndex: 100,
        background: '#8a93e140'
      }}
    >
      <SpeedDial
        FabProps={fabProps}
        ariaLabel="alarmDial"
        sx={{ position: 'absolute', bottom: 0, right: 5 }}
        icon={<MoreVertIcon sx={{ color: theme.palette.getContrastText(theme.palette.primary.main) }} />}
      >
        {actions.map((action, index) => (
          <SpeedDialAction
            onClick={action.click}
            key={index}
            id={action.id + index}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
      <DeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        getData={getData}
        data={data}
        env={env}
        token={token}
      />
      <DialogRounded
        open={status}
        fullWidth={true}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        maxWidth={'xl'}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {pageType}
        <DialogActions></DialogActions>
      </DialogRounded>
    </Box>
  );
};

export default function AlarmCard({ pageType, data, getData, colors, env, token, language }) {
  const theme = useTheme();

  const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';
  console.log(anubisURL);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [status, setOpen] = React.useState(false);
  const props = { close: setOpen };

  const layout = React.cloneElement(pageType, props);

  const cardColor = colors.primaryColor;

  const avatarColor = colors.secondaryColor;

  const translator = (data) => {
    switch (true) {
      case data === 'd':
        return <Trans>alarms.card.time.day</Trans>;
      case data === 'h':
        return <Trans>alarms.card.time.hours</Trans>;
      case data === 'm':
        return <Trans>alarms.card.time.minutes</Trans>;
      case data === 's':
        return <Trans>alarms.card.time.seconds</Trans>;
      case data === 'ms':
        return <Trans>alarms.card.time.milliseconds</Trans>;
      default:
        return false;
    }
  };
  const printDate = (date) => {
    try {
      const lang = typeof language === 'undefined' || language === '' ? 'en' : language;
      return dayjs(Date.parse(date)).locale(lang).format('llll');
    } catch (error) {
      return <Trans>common.invalidDate</Trans>;
    }
  };

  React.useEffect(() => {}, [data]);

  return (
    <RadiusDiv
      boxShadow={5}
      sx={{
        background: cardColor
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: avatarColor
            }}
            aria-label="recipe"
          >
            <AccessAlarmsIcon></AccessAlarmsIcon>
          </Avatar>
        }
        action={
          <MultifunctionButton
            id={'multifucntionButton' + data.id}
            token={token}
            data={data}
            env={env}
            getData={getData}
            pageType={layout}
            setOpen={setOpen}
            status={status}
          ></MultifunctionButton>
        }
        title={data.alarm_type}
        subheader={
          <Tooltip title={data.id} arrow>
            <Typography
              variant="body2"
              noWrap
              gutterBottom
              sx={{ maxWidth: '70%', color: theme.palette.getContrastText(theme.palette.primary.main) }}
            >
              {data.entity_id}
            </Typography>
          </Tooltip>
        }
      />

      <CardContent onClick={handleExpandClick}>
        <CustomList>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: avatarColor
                }}
                aria-label="recipe"
              >
                <AdminPanelSettingsIcon></AdminPanelSettingsIcon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Trans>alarms.card.tenant</Trans>}
              secondary={
                <React.Fragment>
                  <ListTypo component="span" variant="body2" color="text.primary">
                    {data.tenant}
                  </ListTypo>
                </React.Fragment>
              }
            />
          </ListItem>
          <CustomDivider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: avatarColor
                }}
                aria-label="recipe"
              >
                <RouteIcon></RouteIcon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Trans>alarms.card.servicePath</Trans>}
              secondary={
                <React.Fragment>
                  <ListTypo component="span" variant="body2" color="text.primary">
                    {data.servicepath}
                  </ListTypo>
                </React.Fragment>
              }
            />
          </ListItem>
          <CustomDivider variant="inset" component="li" />
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: avatarColor
                }}
                aria-label="recipe"
              >
                <MailOutlineIcon></MailOutlineIcon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={<Trans>alarms.card.email</Trans>}
              secondary={data.channel_destination.map((mail, index) => (
                <React.Fragment key={mail + index}>
                  <ListTypo component="span" variant="body2" color="text.primary">
                    {mail}
                  </ListTypo>
                </React.Fragment>
              ))}
            />
          </ListItem>
        </CustomList>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CustomList sx={{ width: '100%' }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: avatarColor
                  }}
                  aria-label="recipe"
                >
                  <CalendarTodayIcon></CalendarTodayIcon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Trans>alarms.card.frequency</Trans>}
                secondary={
                  <React.Fragment>
                    <ListTypo component="span" variant="body2" color="text.primary">
                      {data.alarm_frequency_time + ' '} {translator(data.alarm_frequency_time_unit)}
                    </ListTypo>
                  </React.Fragment>
                }
              />
            </ListItem>
            <CustomDivider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: avatarColor
                  }}
                  aria-label="recipe"
                >
                  <AccessAlarmsIcon></AccessAlarmsIcon>
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Trans>alarms.card.last</Trans>}
                secondary={
                  <React.Fragment>
                    <ListTypo component="span" variant="body2" color="text.primary">
                      {printDate(data.time_of_last_alarm)}
                    </ListTypo>
                  </React.Fragment>
                }
              />
            </ListItem>
            <CustomDivider variant="inset" component="li" />
          </CustomList>
        </CardContent>
      </Collapse>
    </RadiusDiv>
  );
}
