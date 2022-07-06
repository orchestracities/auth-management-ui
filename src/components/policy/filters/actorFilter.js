import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import { Trans } from 'react-i18next';

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
    top: '13rem !important',
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'none !important',
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

export default function ActorFilter({ data, status, setstatus, filterValue }) {
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
    if (status !== null && status === 'ActorFilter') {
      setAnchorEl(target);
    } else {
      setAnchorEl(null);
    }
  }, [status]);

  return (
    <div style={{ height: 75 }}>
      <Grow in={!open} style={{ transformOrigin: '0 0 0' }} {...(!open ? { timeout: 500 } : {})}>
        <Button
          id="ActorFilter"
          disabled={data.length <= 0}
          aria-controls={open ? 'demo-customized-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          variant="outlined"
          onClick={handleClick}
        >
          {
            <Trans
              i18nKey="policies.filters.actor"
              values={{
                name: filterValue.value !== null ? ': ' + filterValue.value.name : ''
              }}
            />
          }
        </Button>
      </Grow>
      <StyledMenu id="demo-customized-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Grid item xs={12} container direction="column" justifyContent="space-between" alignItems="left">
          <Grow in={open} style={{ transformOrigin: '0 0 0' }} {...(open ? { timeout: 500 } : {})}>
            <Autocomplete
              id="multiple-limit-tags"
              options={data}
              defaultValue={filterValue.value}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => <TextField {...params} label="Actor" placeholder="Actor" />}
              onChange={(event, value) => filterValue.set(value)}
              isOptionEqualToValue={(option, value) => option.iri === value.iri}
              sx={{ width: '100%', marginTop: '10px' }}
            />
          </Grow>
        </Grid>
      </StyledMenu>
    </div>
  );
}
