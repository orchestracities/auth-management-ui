import * as React from 'react';
import ContentCopy from '@mui/icons-material/ContentCopy';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import AddModeratorIcon from '@mui/icons-material/AddModerator';

export default function IconList() {
  return [
    { name: 'none', icon: '' },
    { name: 'custom', icon: '' },
    { name: 'copy', icon: <ContentCopy fontSize="small" /> },
    { name: 'accessibility', icon: <AccessibilityIcon fontSize="small" /> },
    { name: 'shield', icon: <AddModeratorIcon fontSize="small" /> }
  ];
}
