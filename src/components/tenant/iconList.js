import * as React from 'react'
import PropTypes from 'prop-types'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import AccessibilityIcon from '@mui/icons-material/Accessibility'
import AddModeratorIcon from '@mui/icons-material/AddModerator'

export default function IconList () {
  return [
    { name: 'none', icon: '' },
    { name: 'copy', icon: <ContentCopy fontSize="small" /> },
    { name: 'accessibility', icon: <AccessibilityIcon fontSize="small" /> },
    { name: 'shield', icon: <AddModeratorIcon fontSize="small" /> }
  ]
}
