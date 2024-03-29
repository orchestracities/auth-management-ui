import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import { styled, alpha } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Badge from '@mui/material/Badge';
import FolderIcon from '@mui/icons-material/Folder';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';
import DeleteDialog from '../shared/messages/cardDelete';
import { Trans } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grow from '@mui/material/Grow';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ServiceForm from './serviceForm';
import Tooltip from '@mui/material/Tooltip';
import * as log from 'loglevel';
import * as tableApi from '../../componentsApi/tableApi';

const DialogRounded = styled(Dialog)(() => ({
  '& .MuiPaper-rounded': {
    borderRadius: 15
  }
}));

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function ServiceChildren({ masterTitle, setOpen, status, data, getData, color, tenantName_id, env }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);

  // DELETE
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // EDIT Paths
  const [editLevel, setEditLevel] = React.useState(false);
  const [editData, setEditData] = React.useState({});

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  const handleData = (data) => {
    setEditLevel(true);
    setEditData(data);
  };
  const closeHandleData = () => {
    setEditLevel(false);
    getData();
  };

  const addEdit = (data) => {
    data.map(
      (thisElement) =>
        (thisElement.action = (
          <Tooltip title={<Trans>service.tooltip.editIcon</Trans>}>
            <IconButton
              aria-label="subpath"
              color="secondary"
              key={thisElement.id}
              onClick={() => handleData(thisElement)}
            >
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        ))
    );
    return data;
  };

  const [rows, setRows] = React.useState(data);

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: false,
      label: 'ID'
    },
    {
      id: 'path',
      numeric: true,
      disablePadding: false,
      label: 'Path'
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false,
      label: ''
    }
  ];

  const EnhancedTableHead = (props) => {
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
          {headCells.map((headCell, index) => (
            <TableCell
              key={index}
              align={'left'}
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

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const EnhancedTableToolbar = (props) => {
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
            <Trans i18nKey="common.table.selected" values={{ data: numSelected }} />
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            {rows.length > 1 ? (
              <Trans i18nKey="common.table.counterPlural" values={{ data: rows.length }} />
            ) : (
              <Trans i18nKey="common.table.counterSingle" values={{ data: rows.length }} />
            )}
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title={<Trans>common.deleteTooltip</Trans>}>
            <IconButton onClick={handleClickOpenDeleteDialog}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          ''
        )}
      </Toolbar>
    );
  };

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(tableApi.getRowsPerPage(env));

  const fromIdToText = (servicesIDs) => {
    let textDisplay = '\n';
    let foundPath;
    for (const id of servicesIDs) {
      foundPath = data.filter((e) => e.id === id);
      if (foundPath.length > 0) {
        textDisplay = textDisplay + ' -- ' + foundPath[0].path + '\n';
      }
    }
    return textDisplay;
  };

  const dataCreator = (servicesIDs) => {
    const arrayOfData = [];
    for (const id of servicesIDs) {
      const foundPath = data.filter((e) => e.id === id);
      if (foundPath.length > 0) {
        arrayOfData.push({
          path: foundPath[0].path,
          tenant_id: foundPath[0].tenant_id,
          id: foundPath[0].id
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
      log.debug(newSelecteds);
      setSelected(newSelecteds);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const [pathSelected, setPathSelected] = React.useState(null);
  const getPaths = (thisPath) => {
    const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';
    thisPath === null
      ? setRows(addEdit(data))
      : axios.get(anubisURL + '/service_paths?name=' + thisPath.path).then((results) => {
          setRows(addEdit(results.data));
        });
  };

  React.useEffect(() => {
    data.length > 0 ? getPaths(pathSelected) : '';
  }, [pathSelected, data]);

  React.useEffect(() => {
    setRows(addEdit(data));
  }, [data]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <IconButton aria-label="path" onClick={handleClickOpen}>
        <Badge badgeContent={data.length} color="success">
          <FolderIcon
            sx={{
              color: color
            }}
            fontSize="large"
          />
        </Badge>
      </IconButton>
      <DialogRounded
        open={status}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        maxWidth={'xl'}
        fullWidth={true}
        onClose={handleClose}
        aria-labelledby="alert-dialog-titlel"
        aria-describedby="alert-dialog-descriptionl"
      >
        <CustomDialogTitle>
          <Toolbar>
            <IconButton edge="start" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
              <Trans i18nKey="common.subPath" values={{ name: masterTitle }} />
            </Typography>
          </Toolbar>
        </CustomDialogTitle>
        <DialogContent sx={{ minHeight: '400px' }}>
          <Grid container>
            <Grid item xs={12} sx={{ marginBottom: '25px' }}>
              <Autocomplete
                id="sub-path-display"
                sx={{ width: '100%' }}
                options={data}
                value={pathSelected}
                autoHighlight
                getOptionLabel={(option) => option.path}
                onChange={(event, value) => setPathSelected(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={<Trans>service.form.parentPath</Trans>}
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password'
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }} elevation={1} square={false}>
                  <EnhancedTableToolbar numSelected={selected.length} />
                  <TableContainer>
                    <Table sx={{ minWidth: 450 }} aria-labelledby="tableTitle" size={'small'}>
                      <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                      />
                      <TableBody>
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
                                <TableCell component="th" padding="normal" align="left" id={labelId} scope="row">
                                  {row.id}
                                </TableCell>
                                <TableCell padding="normal" align="left" scope="row">
                                  {row.path}
                                </TableCell>
                                <TableCell padding="normal" align="left" scope="row" onClick={handlePropagation}>
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
                    rowsPerPageOptions={tableApi.getTablePageOptions(env)}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
                <DialogRounded
                  open={editLevel}
                  fullWidth={true}
                  maxWidth={'xl'}
                  key={editData.id}
                  TransitionComponent={Transition}
                  fullScreen={fullScreen}
                  onClose={closeHandleData}
                  aria-labelledby="edit"
                  aria-describedby="edit"
                >
                  <ServiceForm
                    env={env}
                    title={<Trans>service.titles.edit</Trans>}
                    action={'Sub-service-creation'}
                    service={editData}
                    key={editData.id}
                    getServices={getData}
                    tenantName_id={tenantName_id}
                    close={closeHandleData}
                  />
                  <DialogActions></DialogActions>
                </DialogRounded>
                <DeleteDialog
                  env={env}
                  open={openDeleteDialog}
                  onClose={handleCloseDeleteDialog}
                  getData={getData}
                  data={{
                    dataValues: dataCreator(selected),
                    multiple: true,
                    selectedText: fromIdToText(selected),
                    setSelected
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
    </div>
  );
}
