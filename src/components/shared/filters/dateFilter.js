import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InputAdornment from '@mui/material/InputAdornment';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import ClearIcon from '@mui/icons-material/Clear';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StyledMenu = styled((props) => (
  <Menu
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth:
      document.getElementById('filterContainer') === null
        ? 950
        : document.getElementById('filterContainer').clientWidth,
    top: '7rem !important',
    background: '#fff0f000',
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'none !important',
    '& .MuiMenu-list': {
      padding: '3% 0'
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

export default function DateFilter({ status, setstatus, filterValue }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [target, setarget] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setarget(event.currentTarget);
    if (event.target.id !== '') {
      setstatus(event.target.id);
    }
  };
  const handleClose = () => {
    setstatus(null);
  };

  React.useEffect(() => {
    if (status !== null && status === 'DateFilter') {
      setAnchorEl(target);
    } else {
      setAnchorEl(null);
    }
  }, [status]);
  const handlePropagation = (e) => {
    e.stopPropagation();
  };
  return (
    <div style={{ height: 75 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={Intl.NumberFormat().resolvedOptions().locale}>
        <Grow in={!open} style={{ transformOrigin: '0 0 0' }} {...(!open ? { timeout: 500 } : {})}>
          <Button
            id="DateFilter"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="outlined"
            onClick={handleClick}
          >
            <AccessTimeIcon onClick={() => handleClick} id="DateFilter" color="primary"></AccessTimeIcon>
            {filterValue.value !== null
              ? ' ' +
                dayjs(filterValue.value, 'MM-DD-YYYY', Intl.NumberFormat().resolvedOptions().locale).format(
                  'ddd DD MMM YYYY'
                )
              : ''}
          </Button>
        </Grow>
        <StyledMenu id="demo-customized-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <Grid item xs={12} container direction="column" justifyContent="space-between" alignItems="left">
            <Grow in={open} style={{ transformOrigin: '0 0 0' }} {...(open ? { timeout: 500 } : {})}>
              <MobileDatePicker
                id="dateInput"
                showToolbar={false}
                value={filterValue.value}
                onChange={(newValue) => {
                  filterValue.set(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start" onClick={handlePropagation}>
                          <ClearIcon
                            onClick={() => {
                              filterValue.set(null);
                            }}
                            sx={{ '&:hover': { cursor: 'pointer' } }}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                sx={{ width: '100%', marginTop: '2%' }}
              />
            </Grow>
          </Grid>
        </StyledMenu>
      </LocalizationProvider>
    </div>
  );
}
