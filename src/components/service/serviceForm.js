import * as React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import DialogContent from '@mui/material/DialogContent'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import InputAdornment from '@mui/material/InputAdornment'
import useNotification from '../shared/messages/alerts'
import { Trans } from 'react-i18next'

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
})

export default function ServiceForm ({
  title,
  close,
  action,
  service,
  tenantName_id,
  getServices
}) {
  const [msg, sendNotification] = useNotification();
  console.log(msg)

  const handleClose = () => {
    close(false)
  }

  const [path, setPath] = React.useState('/')

  const handleSave = () => {
    switch (action) {
      case 'create':
        axios
          .post(
            process.env.REACT_APP_ANUBIS_API_URL +
              'v1/tenants/' +
              tenantName_id[0].id +
              '/service_paths',
            {
              path
            }
          )
          .then(() => {
            getServices()
            close(false)
            sendNotification({msg:<Trans
              i18nKey="common.messages.sucessCreate"
              values={{
                data:
              "Service"
              }}
            />, variant: 'success'})
          })
          .catch((e) => {
           sendNotification({msg: e.response.data.detail, variant: 'error'})
          })
        break
      case "Sub-service-creation":
        axios
          .post(
            process.env.REACT_APP_ANUBIS_API_URL +
              'v1/tenants/' +
              tenantName_id.id +
              '/service_paths',
            {
              path: service.path + path
            }
          )
          .then(() => {
            getServices()
            close(false)
            sendNotification({msg:<Trans
              i18nKey="common.messages.sucessCreate"
              values={{
                data:
              "Sub-service"
              }}
            />, variant: 'success'})
          })
          .catch((e) => {
            sendNotification({msg: e.response.data.detail, variant: 'error'})
                    })
        break
      default:
        break
    }
  }

  const cases = () => {
    switch (true) {
      case path[0] !== '/':
        return '/ should be the first char'
      case path.indexOf(' ') >= 0:
        return 'The string should be without spaces'
      case path[0] === '/' && typeof path[1] === 'undefined':
        return 'A value after / is mandatory'
      case path[0] === '/' && typeof path[1] !== 'undefined':
        return ''
      default:
        break
    }
  }
  return (
    <div>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1, color: 'black' }}
            variant="h6"
            component="div"
          >
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="Tenant"
              label="Tenant"
              variant="outlined"
              defaultValue={tenantName_id.name}
              disabled
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="Path"
              label="Path"
              variant="outlined"
              defaultValue="/"
              sx={{
                width: '100%'
              }}
              onChange={(event) => {
                setPath(event.target.value)
              }}
              InputProps={
                action === 'Sub-service-creation'
                  ? {
                      startAdornment: (
                        <InputAdornment position="start">
                          {service.path}
                        </InputAdornment>
                      )
                    }
                  : ' '
              }
              helperText={cases()}
              error={
                path === '' ||
                (path[0] === '/' && typeof path[1] === 'undefined') ||
                path.indexOf(' ') >= 0
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
    </div>
  )
}
