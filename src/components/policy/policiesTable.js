import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DeleteDialog from '../shared/messages/cardDelete';
import PolicyForm from './policyForm';
import { Trans } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const DinamicPaper = styled(Paper)(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width:
      document.getElementById('filterContainer') === null ? 300 : document.getElementById('filterContainer').clientWidth
  },
  [theme.breakpoints.up('sm')]: {
    width:
      document.getElementById('filterContainer') === null ? 500 : document.getElementById('filterContainer').clientWidth
  },
  [theme.breakpoints.up('md')]: {
    width: '100%'
  },
  [theme.breakpoints.up('lg')]: {
    width: '100%'
  },
  [theme.breakpoints.up('xl')]: {
    width: '100%'
  }
}));

export default function PoliciesTable({ data, getData, access_modes, tenantName, agentsTypes, services, token, env }) {
  // DELETE
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  // EDIT
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({});

  const handleClose = () => {
    setOpen(false);
  };

  const agentToString = (agents) => {
    const agentsNames = [
      ...agentsTypes,
      ...[
        { iri: 'acl:AuthenticatedAgent', name: 'authenticated agent' },
        { iri: 'foaf:Agent', name: 'anyone' },
        { iri: 'oc-acl:ResourceTenantAgent', name: 'resource tenant agent' }
      ]
    ];
    let agentString = '';
    for (const thisAgent of agents) {
      const thisAgentSplit = thisAgent.split(':').slice('2').join(':');
      const foundAgent =
        thisAgentSplit === ''
          ? agentsNames.filter((e) => e.iri === thisAgent)
          : agentsNames.filter((e) => e.iri === thisAgent.replace(':' + thisAgentSplit, ''));
      agentString = agentString + foundAgent[0].name + (thisAgentSplit === '' ? ' ' : ' : ') + thisAgentSplit + '  ';
    }
    return agentString;
  };

  const modeToString = (modes) => {
    let modeString = '';
    for (const mode of modes) {
      const foundMode = access_modes.filter((e) => e.iri === mode);
      modeString = modeString + foundMode[0].name + ' ';
    }
    return modeString;
  };
  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  const handleData = (data) => {
    setOpen(true);
    setEditData(data);
  };
  const addEdit = (data) => {
    data.map(
      (thisElement) =>
        (thisElement.action = (
          <IconButton aria-label="edit" color="secondary" key={thisElement.id} onClick={() => handleData(thisElement)}>
            <EditIcon />
          </IconButton>
        ))
    );
    return data;
  };
  const rows = addEdit(data);

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
      id: 'id',
      numeric: false,
      disablePadding: true,
      label: 'ID'
    },
    {
      id: 'access_to',
      numeric: false,
      disablePadding: false,
      label: <Trans>policies.table.access</Trans>
    },
    {
      id: 'fiware_service_path',
      numeric: false,
      disablePadding: false,
      label: <Trans>policies.table.path</Trans>
    },
    {
      id: 'resource_type',
      numeric: false,
      disablePadding: false,
      label: <Trans>policies.table.resource_type</Trans>
    },
    {
      id: 'agent',
      numeric: false,
      disablePadding: false,
      label: <Trans>policies.table.actor</Trans>
    },
    {
      id: 'mode',
      numeric: false,
      disablePadding: false,
      label: <Trans>policies.table.mode</Trans>
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: ''
    }
  ];

  const PoliciesTableHead = (props) => {
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
  };

  PoliciesTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const PoliciesTableToolbar = (props) => {
    const { numSelected } = props;

    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity)
          })
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
          <Tooltip title={<Trans>common.deleteTooltip</Trans>}>
            <IconButton onClick={handleClickOpenDeleteDialog}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Trans
            i18nKey="policies.table.total_plur"
            values={{
              name: stableSort(rows, getComparator(order, orderBy)).length
            }}
          />
        )}
      </Toolbar>
    );
  };

  PoliciesTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('resource');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const fromIdToText = (policyIDs) => {
    let textDisplay = '\n';
    let foundPolicy;
    for (const id of policyIDs) {
      foundPolicy = data.filter((e) => e.id === id);
      if (foundPolicy.length > 0) {
        textDisplay = textDisplay + ' -- ' + foundPolicy[0].id + '\n';
      }
    }
    return textDisplay;
  };

  const dataCreator = (policyIDs) => {
    const arrayOfData = [];
    for (const id of policyIDs) {
      const foundPolicy = data.filter((e) => e.id === id);
      if (foundPolicy.length > 0) {
        const thisPolicy = foundPolicy[0];
        arrayOfData.push({
          id: thisPolicy.id,
          access_to: thisPolicy.access_to,
          fiware_service: thisPolicy.fiware_service,
          fiware_service_path: thisPolicy.fiware_service_path
        });
      }
    }
    return arrayOfData;
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Box sx={{ width: '100%' }}>
        <DinamicPaper sx={{ width: '100%', mb: 2, overflow: 'hidden' }} elevation={1} square={false}>
          <PoliciesTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table aria-labelledby="tableTitle" sx={{ minWidth: 750 }} stickyHeader size={'small'}>
              <PoliciesTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId
                            }}
                          />
                        </TableCell>
                        <TableCell padding="normal" id={labelId} align="left">
                          {row.id}
                        </TableCell>
                        <TableCell padding="normal" align="left">
                          {row.access_to}
                        </TableCell>
                        <TableCell padding="normal" align="left">
                          {row.fiware_service_path}
                        </TableCell>
                        <TableCell padding="normal" align="left">
                          {row.resource_type}
                        </TableCell>
                        <TableCell padding="normal" align="left">
                          <Typography noWrap gutterBottom sx={{ maxWidth: '70%' }}>
                            {agentToString(row.agent)}
                          </Typography>
                        </TableCell>
                        <TableCell padding="normal" align="left">
                          {modeToString(row.mode)}
                        </TableCell>
                        <TableCell padding="normal" align="left" onClick={handlePropagation}>
                          {row.action}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </DinamicPaper>
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
        <PolicyForm
          env={env}
          tenantName={tenantName}
          action="modify"
          agentsTypes={agentsTypes}
          services={services}
          data={editData}
          getServices={getData}
          access_modes={access_modes}
          title={<Trans i18nKey="policies.titles.edit" values={{ name: editData.id }} />}
          close={handleClose}
          token={token}
        ></PolicyForm>
        <DialogActions></DialogActions>
      </DialogRounded>
      <DeleteDialog
        open={openDeleteDialog}
        env={env}
        token={token}
        onClose={handleCloseDeleteDialog}
        getData={getData}
        data={{
          dataValues: dataCreator(selected),
          multiple: true,
          selectedText: fromIdToText(selected),
          setSelected
        }}
      />
    </>
  );
}
