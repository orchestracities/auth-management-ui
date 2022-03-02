import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TenantForm from '../tenant/tenantForm'
import DeleteDialog from '../shared/messages/cardDelete'

export default function PoliciesTable() {
    //DELETE
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = (value) => {
        setOpenDeleteDialog(false);
    };
    //EDIT
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


function createData(access, path, resource, resourceType, actor, actorType, action) {
    return {
        access,
        path,
        resource,
        resourceType,
        actor,
        actorType,
        action
    };
}

const rows = [
    createData('Data1', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data2', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data3', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data4', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data5', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data6', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data7', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data8', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data9', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data10', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data11', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data12', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data13', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data14', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),
    createData('Data15', 'Data', 'Data', 'Data', 'Data', 'Sata', EditButton("")),

];

function EditButton(data) {
    return (<Tooltip title="Edit">
        <IconButton onClick={handleClickOpen}>
            <EditIcon />
        </IconButton>
    </Tooltip>)
}

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
        id: 'access',
        numeric: false,
        disablePadding: false,
        label: 'Access To',
    },
    {
        id: 'path',
        numeric: false,
        disablePadding: false,
        label: 'Path',
    },
    {
        id: 'resource',
        numeric: false,
        disablePadding: false,
        label: 'Resource',
    },
    {
        id: 'resourceType',
        numeric: false,
        disablePadding: false,
        label: 'Resource Type',
    },
    {
        id: 'actor',
        numeric: false,
        disablePadding: false,
        label: 'Actor',
    },
    {
        id: 'actorType',
        numeric: false,
        disablePadding: false,
        label: 'Actor Type',
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: true,
        label: '',
    },
];

function PoliciesTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
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
                            'aria-label': 'select all desserts',
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

PoliciesTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const PoliciesTableToolbar = (props) => {
    const { numSelected } = props;

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} selected
                </Typography>
            ) : (
                ""
            )}

            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton onClick={handleClickOpenDeleteDialog}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                ""
            )}
        </Toolbar>
    );
};

PoliciesTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
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
            const newSelecteds = rows.map((n) => n.access);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, access) => {
        const selectedIndex = selected.indexOf(access);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, access);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
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



    const isSelected = (access) => selected.indexOf(access) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <PoliciesTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={'medium'}
                    >
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
                                    const isItemSelected = isSelected(row.access);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.access)}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.access}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                align="left"
                                                padding="none"
                                            >
                                                {row.access}
                                            </TableCell>
                                            <TableCell align="left">{row.path}</TableCell>
                                            <TableCell align="left">{row.resource}</TableCell>
                                            <TableCell align="left">{row.resourceType}</TableCell>
                                            <TableCell align="left">{row.actor}</TableCell>
                                            <TableCell align="left">{row.actorType}</TableCell>
                                            <TableCell align="left">{row.action}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: (53) * emptyRows,
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
            </Paper>
  <DeleteDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog} 
            />
              <Dialog
                open={open}
                fullWidth={true}
                maxWidth={"xl"}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                
               <TenantForm title={"Edit Tenant"} close={setOpen}></TenantForm>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </Box>
    );
}