import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import EndpointsTable from './endpointsTable';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import useNotification from '../shared/messages/alerts';
import { Trans } from 'react-i18next';

export default function ResourceTable({ token, tokenData, env, resources, getTheResources, GeTenantData }) {
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

  const [msg, sendNotification] = useNotification();

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [rows, setRows] = React.useState(resources);

  React.useEffect(() => {
    setRows(resources);
  }, [resources]);

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

  const handleClick = (name) => {
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const DinamicPaper = styled(Paper)(({ theme }) => ({
    [theme.breakpoints.up('xs')]: {
      width:
        document.getElementById('filterContainer') === null
          ? 300
          : document.getElementById('filterContainer').clientWidth
    },
    [theme.breakpoints.up('sm')]: {
      width:
        document.getElementById('filterContainer') === null
          ? 500
          : document.getElementById('filterContainer').clientWidth
    },
    [theme.breakpoints.up('md')]: {
      width: '100%'
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%'
    },
    [theme.breakpoints.up('xl')]: {
      width: '100%'
    },
    borderRadius: 10
  }));

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
      disablePadding: false,
      label: <Trans>resourceType.table.name</Trans>
    },
    {
      id: 'author',
      numeric: false,
      disablePadding: false,
      label: <Trans>resourceType.table.author</Trans>
    },
    {
      id: 'endpoint',
      numeric: false,
      disablePadding: true,
      label: <Trans>resourceType.table.endpoint</Trans>
    },
    {
      id: 'modify',
      numeric: false,
      disablePadding: false,
      label: ''
    }
  ];

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts'
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
        </TableRow>
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
            <Trans i18nKey="policies.table.selected" values={{ name: numSelected }} />
          </Typography>
        ) : (
          ''
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon onClick={() => deleteResourceTypes()} />
            </IconButton>
          </Tooltip>
        ) : (
          ''
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const deleteResourceTypes = () => {
    let resourceIDs = [];
    selected.map((e) => resourceIDs.push(GeTenantData('name') + '/' + e));
    client
      .mutate({
        mutation: gql`
          mutation deleteResourceType($resourceID: [String]!) {
            deleteResourceType(resourceID: $resourceID) {
              name
              userID
              tenantName
              resourceID
              endpointUrl
            }
          }
        `,
        variables: { resourceID: resourceIDs }
      })
      .then(() => {
        getTheResources();
      })
      .catch((e) => {
        sendNotification({ msg: e.message + ' the config', variant: 'error' });
      });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DinamicPaper sx={{ width: '100%', mb: 2, overflow: 'hidden' }} elevation={1} square={false}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.sort(getComparator(order, orderBy)).slice() */}
              {stableSort(rows, getComparator(order, orderBy)).map((row, index) => (
                <EnhancedRows
                  row={row}
                  key={index}
                  msg={msg}
                  isItemSelected={isSelected(row.name)}
                  handleClick={handleClick}
                  token={token}
                  tokenData={tokenData}
                  env={env}
                  getTheResources={getTheResources}
                ></EnhancedRows>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DinamicPaper>
    </Box>
  );
}

function EnhancedRows({ row, isItemSelected, token, handleClick, tokenData, env, getTheResources }) {
  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={''}
        selected={isItemSelected}
        onClick={(event) =>
          event.target.parentElement.id === 'Endpoint' || event.target.id === 'Endpoint' ? '' : handleClick(row.name)
        }
        sx={{ '& > *': { borderBottom: 'unset' } }}
      >
        <TableCell padding="checkbox"></TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.userID}</TableCell>
        <EndpointsTable
          token={token}
          tokenData={tokenData}
          env={env}
          resourceTypeData={row}
          getTheResources={getTheResources}
        ></EndpointsTable>
      </TableRow>
    </React.Fragment>
  );
}
