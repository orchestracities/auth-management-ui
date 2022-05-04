import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';
import ArchiveIcon from '@mui/icons-material/Archive';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';

const StyledMenu = styled((props) => (
  <Menu
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}

    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 900,
    top: "13rem !important",
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'none !important',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function PathFilter({ data, status, setstatus }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [target, setarget] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setarget(event.currentTarget);
    if(event.target.id !==""){
      setstatus(event.target.id);
    }
  };
  const handleClose = () => {
    setstatus(null)
  };

  React.useEffect(() => {
    if (status !== null && status==="PathFilter") {
      setAnchorEl(target);
    } else {
      setAnchorEl(null);
    }
  }, [status]);


  return (
    <div style={{ height: (status !== null) ? 67 : "" }}>
      <Grow
        in={!open}
        style={{ transformOrigin: '0 0 0' }}
        {...(!open ? { timeout: 500 } : {})}
      >
        <Button
          id="PathFilter"
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="outlined"
          onClick={handleClick}
        >
          PATH
        </Button>
      </Grow>
      <StyledMenu
        id="demo-customized-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        children={
          <Grid item xs={12}
            container
            direction="column"
            justifyContent="space-between"
            alignItems="left">
            <Grow
              in={open}
              style={{ transformOrigin: '0 0 0' }}
              {...(open ? { timeout: 500 } : {})}
            >
              <Autocomplete
                id="multiple-limit-tags"
                options={data}
                getOptionLabel={(option) => option.fiware_service_path}
                renderInput={(params) => (
                  <TextField {...params} label="Path" placeholder="Path" />
                )}
                sx={{ width: 500, marginTop: "10px" }}
              />
            </Grow>
          </Grid>
        }
      />


    </div>

  );
}