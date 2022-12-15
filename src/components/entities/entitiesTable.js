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
import { Trans } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import dayjs from 'dayjs';

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
  },
  borderRadius: 10
}));

export default function EntitiesTable({ data }) {
  // DELETE
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  console.log(openDeleteDialog);

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  console.log(handleCloseDeleteDialog);
  // EDIT
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({});
  console.log(editData);
  const handleClose = () => {
    setOpen(false);
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
      id: 'type',
      numeric: false,
      disablePadding: false,
      label: <Trans>entities.table.type</Trans>
    },
    {
      id: 'modified',
      numeric: false,
      disablePadding: false,
      label: <Trans>entities.table.modified</Trans>
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: ''
    }
  ];

  const EntitiesTableHead = (props) => {
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

  EntitiesTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const EntitiesTableToolbar = (props) => {
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
            <Trans i18nKey="common.table.selected" values={{ name: numSelected }} />
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
            i18nKey="common.table.total_plur"
            values={{
              name: stableSort(rows, getComparator(order, orderBy)).length
            }}
          />
        )}
      </Toolbar>
    );
  };

  EntitiesTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('resource');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
          <EntitiesTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table aria-labelledby="tableTitle" sx={{ minWidth: 750 }} stickyHeader size={'small'}>
              <EntitiesTableHead
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
                            color="secondary"
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
                          {row.type}
                        </TableCell>
                        <TableCell padding="normal" align="left">
                          {dayjs(Date(row.dateModified.value))
                            .locale(Intl.NumberFormat().resolvedOptions().locale)
                            .format('ddd DD MMM YYYY')}
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
        <DialogActions></DialogActions>
      </DialogRounded>
    </>
  );
}
