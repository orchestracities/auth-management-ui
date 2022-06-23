import * as React from 'react'
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteDialog from './messages/cardDelete'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import { styled } from '@mui/material/styles'
import { Trans } from 'react-i18next'

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}))

const fabProps = {
  sx: {
    background: '#8a93e100',
    color: '#555555e3',
    boxShadow: 'none',
    '&:hover': {
      background: '#8a93e140'
    }
  }
}
export default function MultifunctionButton ({
  pageType,
  setOpen,
  status,
  data,
  getData
}) {
  // DELETE
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const actions = [
    {
      icon: <EditIcon />,
      name:
        pageType.props.action === 'modify'
          ? (
          <Trans>tenant.tooltip.editIcon</Trans>
            )
          : (
          <Trans>service.tooltip.editIcon</Trans>
            ),
      click: handleClickOpen
    },
    {
      icon: <DeleteIcon color="error" />,
      name: <Trans>common.deleteTooltip</Trans>,
      click: handleClickOpenDeleteDialog
    }
  ]
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
        {actions.map((action,index) => (
          <SpeedDialAction
            onClick={action.click}
            key={index}
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
      />
      <DialogRounded
        open={status}
        fullWidth={true}
        maxWidth={'xl'}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {pageType}
        <DialogActions></DialogActions>
      </DialogRounded>
    </Box>
  )
}
