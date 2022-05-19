import * as React from 'react'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import InputAdornment from '@mui/material/InputAdornment'

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
          .then((response) => {
            getServices()
            close(false)
          })
          .catch((e) => {
            console.error(e)
          })
        break
      case 'modify':
        axios
          .post(
            process.env.REACT_APP_ANUBIS_API_URL +
              'v1/tenants/' +
              tenantName_id[0].id +
              '/service_paths',
            {
              path: service.path + path
            }
          )
          .then((response) => {
            getServices()
            close(false)
          })
          .catch((e) => {
            console.error(e)
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
        break
      case path.indexOf(' ') >= 0:
        return 'The string should be without spaces'
        break
      case path[0] === '/' && typeof path[1] === 'undefined':
        return 'A value after / is mandatory'
        break
      case path[0] === '/' && typeof path[1] !== 'undefined':
        return ''
        break
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
              defaultValue={tenantName_id[0].name}
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
                action === 'modify'
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
