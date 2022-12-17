import * as React from 'react';
import Grid from '@mui/material/Grid';
import PathFilter from '../shared/filters/pathFilter';
import DateFilter from '../shared/filters/dateFilter';
import TypeFilter from './filters/typeFilter';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function EntityFilters({ mapper, services, types }) {
  const [status, setstatus] = React.useState(null);
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  const type = getUniqueListBy(types, 'type');
  type.map((thisElement) => delete thisElement.action);
  const fiware_service_path = getUniqueListBy(services, 'path');
  React.useEffect(() => {
    if (status === '') {
      setstatus(null);
    }
  }, [status]);

  const theme = useTheme();
  const isResponsive = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid
      container
      direction="row"
      spacing={0.5}
      justifyContent="flex-start"
      alignItems="center"
      sx={isResponsive ? { minWidth: 1100 } : ''}
    >
      <Grid
        item
        xs={status === 'PathFilter' ? 12 : 'auto'}
        sm={status === 'PathFilter' ? 12 : 'auto'}
        md={status === 'PathFilter' ? 12 : 'auto'}
        lg={status === 'PathFilter' ? 12 : 'auto'}
        xl={status === 'PathFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'PathFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <PathFilter filterValue={mapper.servicePath} data={fiware_service_path} status={status} setstatus={setstatus} />
      </Grid>
      <Grid
        item
        xs={status === 'TypeFilter' ? 12 : 'auto'}
        sm={status === 'TypeFilter' ? 12 : 'auto'}
        md={status === 'TypeFilter' ? 12 : 'auto'}
        lg={status === 'TypeFilter' ? 12 : 'auto'}
        xl={status === 'TypeFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'TypeFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <TypeFilter filterValue={mapper.type} data={type} status={status} setstatus={setstatus} />
      </Grid>
      <Grid
        item
        xs={status === 'DateFilter' ? 12 : 'auto'}
        sm={status === 'DateFilter' ? 12 : 'auto'}
        md={status === 'DateFilter' ? 12 : 'auto'}
        lg={status === 'DateFilter' ? 12 : 'auto'}
        xl={status === 'DateFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'DateFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <DateFilter filterValue={mapper.date} status={status} setstatus={setstatus} />
      </Grid>
    </Grid>
  );
}
