import * as React from 'react';
import Grid from '@mui/material/Grid';
import PathFilter from '../shared/filters/pathFilter';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import SortButton from '../shared/sortButton';
export default function AlarmsFilters({ mapper, services, sortData, data }) {
  const [status, setstatus] = React.useState(null);
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

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
          marginBottom: '8px'
        }}
        zeroMinWidth
      >
        {status !== null ? (
          ''
        ) : (
          <SortButton
            data={data.map((obj) =>
              Object.fromEntries(Object.entries(obj).map(([key, val]) => [key, JSON.stringify(val)]))
            )}
            id={'id'}
            sortData={sortData}
          ></SortButton>
        )}
      </Grid>

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
    </Grid>
  );
}
