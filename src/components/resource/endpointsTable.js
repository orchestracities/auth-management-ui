import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { lighten } from '@mui/material';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../shared/messages/alerts';
import EndpointsForm from './endpointsForm';
const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const SecondaryColorRow = styled(TableRow)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: lighten(theme.palette.secondary.light, 0.7)
  },
  '&.Mui-selected:hover': {
    backgroundColor: lighten(theme.palette.secondary.light, 0.5)
  }
}));
export default function EndpointsTable({ token, resourceTypeName, env, getTheResources }) {
  const httpLink = createHttpLink({
    uri: typeof env !== 'undefined' ? env.CONFIGURATION_API_URL : ''
  });
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });
  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
  const [rows, setRows] = React.useState([]);
  const [msg, sendNotification] = useNotification();

  const getTheEndPoints = (resourceTypeName) => {
    client
      .query({
        query: gql`
          query getEndpoints($resourceTypeName: String!) {
            getEndpoints(resourceTypeName: $resourceTypeName) {
              name
              resourceTypeName
              nameAndID
            }
          }
        `,
        variables: { resourceTypeName: resourceTypeName }
      })
      .then((response) => setRows(response.data.getEndpoints))
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };
  React.useEffect(() => {
    getTheEndPoints(resourceTypeName);
  }, []);

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: 'name',
      numeric: false,
      disablePadding: true,
      label: 'Name'
    },
    {
      id: 'nameAndID',
      numeric: false,
      disablePadding: true,
      label: 'ID'
    }
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <SecondaryColorRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="secondary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all endpoints'
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </SecondaryColorRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {})
        }}
      >
        {numSelected > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            {resourceTypeName}
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon onClick={() => deleteResourceTypes()} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Add new endpoint">
            <IconButton>
              <AddIcon onClick={() => setOpen(true)} />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpen(false);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const deleteResourceTypes = () => {
    client
      .mutate({
        mutation: gql`
          mutation deleteThisEndpoint($name: [String]!) {
            deleteThisEndpoint(name: $name) {
              name
              resourceTypeName
              nameAndID
            }
          }
        `,
        variables: { name: selected }
      })
      .then(() => {
        getTheResources();
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  return rows.length > 0 ? (
    <>
      <Box sx={{ width: '100%' }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby={resourceTypeName} size={'small'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <SecondaryColorRow
                    hover={true}
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="secondary"
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" align="left" scope="row" padding="none">
                      {row.name}
                    </TableCell>
                    <TableCell component="th" align="left" scope="row" padding="none">
                      {row.nameAndID}
                    </TableCell>
                  </SecondaryColorRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <DialogRounded
        open={open}
        fullWidth={true}
        maxWidth={'xl'}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="edit"
        aria-describedby="edit"
      >
        <EndpointsForm
          title={'new Endpoint'}
          close={handleClose}
          action={'create'}
          token={token}
          resourceTypeName={resourceTypeName}
          env={env}
          getTheResources={getTheResources}
        />
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  ) : (
    <>
      <Box sx={{ width: '100%' }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <Typography variant="body2" id="tableTitle" component="div">
          No data
        </Typography>
      </Box>
      <DialogRounded
        msg={msg}
        open={open}
        fullWidth={true}
        maxWidth={'xl'}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        onClose={handleClose}
        aria-labelledby="edit"
        aria-describedby="edit"
      >
        <EndpointsForm
          title={'new Endpoint'}
          close={handleClose}
          action={'create'}
          token={token}
          resourceTypeName={resourceTypeName}
          env={env}
          getTheResources={getTheResources}
        />
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  );
}
