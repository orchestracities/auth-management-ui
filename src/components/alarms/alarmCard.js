import * as React from 'react';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import AddIcon from '@mui/icons-material/Add';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import DeleteDialog from '../shared/messages/cardDelete';
const RadiusDiv = styled(Box)(({ theme }) => ({
    borderRadius: '15px',
    background: theme.palette.primary.light.replace(')', ' / 70% )').replace(/,/g, ''),
    color: theme.palette.primary.contrastText,
    maxWidth: 550
}));


const CustomList = styled(List)(({ theme }) => ({
    width: '100%',
    padding: "0 !important",
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
 const MultifunctionButton= ({ pageType, setOpen, status, data, getData, env, token }) =>{
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
        name:
            <Trans>tenant.tooltip.editIcon</Trans>
,
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
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'absolute', bottom: 0, right: 5 }}
          icon={<MoreVertIcon />}
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
  }

export default function AlarmCard({ pageType, data, getData, seTenant, colors, tenantName_id, env, token }) {
    const theme = useTheme();
    const [subpathOpen, setSubpathOpen] = React.useState(false);
    const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [status, setOpen] = React.useState(false);
    const props = { close: setOpen };

    const layout = React.cloneElement(pageType, props);

    const cardColor = colors.primaryColor;

    const avatarColor = colors.secondaryColor;

    React.useEffect(() => { }, [data]);

    return (
        <RadiusDiv
            boxShadow={5}
            sx={{
                background: layout.props.action === 'Sub-service-creation' ? cardColor : '#8086bab8'
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
                title={data.id}
                subheader={
                    <Tooltip title={data.entity_id} arrow>
                        <Typography variant="body2" noWrap gutterBottom sx={{ maxWidth: '70%', color: theme.palette.getContrastText(theme.palette.primary.main) }}>
                            {data.entity_id}
                        </Typography>
                    </Tooltip>
                }
            />

            <CardContent onClick={handleExpandClick}>
                <CustomList >
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
                            primary="Brunch this weekend?"
                            secondary={
                                <React.Fragment>
                                    <ListTypo
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Ali Connors
                                    </ListTypo>

                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
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
                            primary="Brunch this weekend?"
                            secondary={
                                <React.Fragment>
                                    <ListTypo
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        Ali Connors
                                    </ListTypo>

                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
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
                                    <AccessAlarmsIcon></AccessAlarmsIcon>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary="Brunch this weekend?"
                                secondary={
                                    <React.Fragment>
                                        <ListTypo
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Ali Connors
                                        </ListTypo>

                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
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
                                primary="Brunch this weekend?"
                                secondary={
                                    <React.Fragment>
                                        <ListTypo
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Ali Connors
                                        </ListTypo>

                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </CustomList>
                </CardContent>
            </Collapse>
        </RadiusDiv>
    );
}
