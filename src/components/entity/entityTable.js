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
import * as log from 'loglevel';
import DeleteDialog from '../shared/messages/cardDelete';
import EntityForm from './entityForm';
import * as tableApi from '../../componentsApi/tableApi';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import useNotification from '../shared/messages/alerts';
import PolicyTable from '../policy/policiesTable';
import PoliciesOnEntity from './policyDisplay';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

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

export default function EntityTable({
  data,
  env,
  token,
  language,
  getTheEntities,
  entityEndpoint,
  types,
  GeTenantData,
  services,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  entitiesLenght,
  thisTenant
}) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const [msg, sendNotification] = useNotification();
  console.log(msg);
  //POLICIES TABLE PART
  const [modalTitle, setModalTitle] = React.useState('');
  const [pagePolicies, setPagePolicies] = React.useState(0);
  const [policiesLength, setPoliciesLenght] = React.useState(0);
  const [rowsPerPagePolicies, setRowsPerPagePolicies] = React.useState(tableApi.getRowsPerPage(env));
  const pagePoliciesMaxNumber = tableApi.getTableMax(env);

  // DELETE
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  // EDIT
  const [openEdit, setOpenEdit] = React.useState(false);
  const [editData, setEditData] = React.useState({});

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleEdit = (data) => {
    setOpenEdit(true);
    setEditData(data);
  };

  // POLICIES
  const [openPoliciesView, setOpenPoliciesView] = React.useState(false);
  const [entityPolicies, setEntityPolicies] = React.useState([]);
  React.useEffect(() => {
    openPoliciesView === false ? setEntityPolicies([]) : '';
  }, [openPoliciesView]);

  const getPoliciesFiltered = (ID) => {
    const queryParameters =
      typeof ID === 'undefined'
        ? modalTitle !== null
          ? '&resource=' + modalTitle
          : ''
        : ID !== null
        ? '&resource=' + ID
        : '';
    for (const service of services) {
      axios
        .get(
          (typeof env !== 'undefined' ? env.ANUBIS_API_URL : '') +
            'v1/policies' +
            '/?skip=' +
            pagePolicies *
              (rowsPerPagePolicies === pagePoliciesMaxNumber ? pagePoliciesMaxNumber : rowsPerPagePolicies) +
            '&limit=' +
            rowsPerPagePolicies +
            queryParameters,
          {
            headers: {
              'fiware-service': GeTenantData('name'),
              'fiware-servicepath': service.path,
              authorization: `Bearer ${token}`
            }
          }
        )
        .then((response) => {
          setPoliciesLenght(response.headers['counter']);
          response.data.forEach((e) => (e.fiware_service = GeTenantData('name')));
          response.data.forEach((e) => (e.fiware_service_path = service.path));
          setEntityPolicies(response.data);
          setOpenPoliciesView(true);
        })
        .catch((e) => {
          e.response
            ? e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }))
            : sendNotification({ msg: e.message + ': cannot reach policy managenent api', variant: 'error' });
        });
    }
  };

  const handleClosePolicies = () => {
    setOpenPoliciesView(false);
  };

  const handlePolicies = (data) => {
    setModalTitle(data.id);
    getPoliciesFiltered(data.id);
  };

  const handlePropagation = (e) => {
    e.stopPropagation();
  };

  const [access_modes, setAccess_modes] = React.useState([]);

  React.useEffect(() => {
    if (!(thisTenant === null || typeof thisTenant === 'undefined')) {
      axios
        .get((typeof env !== 'undefined' ? env.ANUBIS_API_URL : '') + 'v1/policies/access-modes', {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        .then((response) => setAccess_modes(response.data))
        .catch((err) =>
          sendNotification({ msg: err.message + ': cannot reach policy managenent api', variant: 'error' })
        );
    }
  }, [thisTenant]);

  const [agentsTypes, setagentsTypes] = React.useState([]);

  React.useEffect(() => {
    if (!(thisTenant === null || typeof thisTenant === 'undefined')) {
      axios
        .get((typeof env !== 'undefined' ? env.ANUBIS_API_URL : '') + 'v1/policies/agent-types', {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        .then((response) => setagentsTypes(response.data))
        .catch((err) =>
          sendNotification({ msg: err.message + ': cannot reach policy managenent api', variant: 'error' })
        );
    }
  }, [thisTenant]);

  const addInteractions = (data) => {
    data.map(
      async (thisElement) =>
        (thisElement.action = (
          <>
            <IconButton
              aria-label="edit"
              color="secondary"
              key={'edit' + thisElement.id}
              onClick={() => handleEdit(thisElement)}
            >
              <EditIcon />
            </IconButton>
            <PoliciesOnEntity
              entityPolicies={entityPolicies}
              env={env}
              token={token}
              GeTenantData={GeTenantData}
              thisEntity={thisElement}
              handlePolicies={handlePolicies}
            />
          </>
        ))
    );
    return data;
  };

  const rows = addInteractions(data);

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
      label: <Trans>entity.table.type</Trans>
    },
    {
      id: 'modified',
      numeric: false,
      disablePadding: false,
      label: <Trans>entity.table.modified</Trans>
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: true,
      label: ''
    }
  ];

  const EntityTableHead = (props) => {
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

  EntityTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
  };

  const EntityTableToolbar = (props) => {
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
            i18nKey="common.table.totalPlural"
            values={{
              name: entitiesLenght
            }}
          />
        )}
      </Toolbar>
    );
  };

  EntityTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
  };

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('resource');
  const [selected, setSelected] = React.useState([]);

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

  const printDate = (date) => {
    try {
      const lang = typeof language === 'undefined' || language === '' ? 'en' : language;
      return dayjs(Date.parse(date)).locale(lang).format('llll');
    } catch (error) {
      return <Trans>common.invalidDate</Trans>;
    }
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const fromIdToText = (entititiesSelected) => {
    let textDisplay = '\n';
    let foundEntity;
    for (const id of entititiesSelected) {
      foundEntity = data.filter((e) => e.id === id);
      if (foundEntity.length > 0) {
        textDisplay = textDisplay + ' -- ' + foundEntity[0].id + '\n';
      }
    }
    return textDisplay;
  };

  const dataCreator = (entitiesIDs) => {
    const arrayOfData = [];
    for (const id of entitiesIDs) {
      const foundEntity = data.filter((e) => e.id === id);
      if (foundEntity.length > 0) {
        const thisEntity = foundEntity[0];
        arrayOfData.push({
          id: thisEntity.id,
          type: thisEntity.type,
          entityEndpoint: entityEndpoint,
          tenant: GeTenantData('name')
        });
      }
    }
    return arrayOfData;
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <DinamicPaper sx={{ width: '100%', mb: 2, overflow: 'hidden' }} elevation={1} square={false}>
          <EntityTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table aria-labelledby="tableTitle" sx={{ minWidth: 750 }} stickyHeader size={'small'}>
              <EntityTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows
                  .slice(0, page * rowsPerPage + rowsPerPage)
                  .sort(getComparator(order, orderBy))
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
                          {printDate(row.dateModified.value)}
                        </TableCell>

                        <TableCell padding="normal" align="left" onClick={handlePropagation}>
                          {row.action}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={tableApi.getTablePageOptions(env)}
            component="div"
            count={entitiesLenght}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </DinamicPaper>
      </Box>
      <DialogRounded
        open={openEdit}
        fullWidth={true}
        maxWidth={'xl'}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        onClose={handleCloseEdit}
        aria-labelledby="edit"
        aria-describedby="edit"
      >
        <EntityForm
          title={
            <Trans
              i18nKey="entity.form.edit"
              values={{
                name: editData.id
              }}
            />
          }
          close={handleCloseEdit}
          action={'modify'}
          token={token}
          env={env}
          data={editData}
          GeTenantData={GeTenantData}
          getTheEntities={getTheEntities}
          entityEndpoint={entityEndpoint}
          types={types}
          services={services}
        />
        <DialogActions></DialogActions>
      </DialogRounded>
      <DialogRounded
        open={openPoliciesView}
        fullWidth={true}
        maxWidth={'xl'}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
        onClose={handleClosePolicies}
        aria-labelledby="edit"
        aria-describedby="edit"
      >
        <CustomDialogTitle>
          <Toolbar>
            <IconButton edge="start" onClick={handleClosePolicies} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1, color: 'black' }} noWrap gutterBottom variant="h6" component="div">
              {modalTitle}
            </Typography>
          </Toolbar>
        </CustomDialogTitle>
        <DialogContent sx={{ minHeight: '400px' }}>
          <PolicyTable
            mode={'display'}
            page={pagePolicies}
            setPage={setPagePolicies}
            rowsPerPage={rowsPerPagePolicies}
            setRowsPerPage={setRowsPerPagePolicies}
            policiesLength={policiesLength}
            data={entityPolicies}
            getData={getPoliciesFiltered}
            tenantName={GeTenantData}
            token={token}
            env={env}
            services={services}
            access_modes={access_modes}
            agentsTypes={agentsTypes}
          />
        </DialogContent>
        <DialogActions></DialogActions>
      </DialogRounded>
      <DeleteDialog
        open={openDeleteDialog}
        env={env}
        token={token}
        onClose={handleCloseDeleteDialog}
        getData={getTheEntities}
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
