import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 120,
    background: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}));

export default function SortButton({ data, id, sortData }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [mode, setMode] = React.useState('Title (ASC)');
  const handleClose = (event) => {
    if (event.target.innerText) {
      setMode(event.target.innerText);
    }
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const sortedData =
      mode === 'Title (ASC)'
        ? data.sort((a, b) => (a[id] > b[id] ? 1 : b[id] > a[id] ? -1 : 0))
        : data
            .sort((a, b) => (a[id] > b[id] ? 1 : b[id] > a[id] ? -1 : 0))
            .reverse((a, b) => parseFloat(a[id]) - parseFloat(b[id]));
    sortData(sortedData);
  }, [mode, data]);

  return (
    <div>
      <Button
        sx={{ marginBottom: '30px' }}
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="outlined"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {'' + mode}
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disabled={mode === 'Title (ASC)'} disableRipple>
          Title (ASC)
        </MenuItem>
        <MenuItem onClick={handleClose} disabled={mode === 'Title (DES)'} disableRipple>
          Title (DES)
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
