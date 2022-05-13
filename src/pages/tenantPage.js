import * as React from 'react'
import { MainTitle } from '../components/shared/mainTitle'
import AddButton from '../components/shared/addButton'
import { Grid } from '@mui/material'
import SortButton from '../components/shared/sortButton'
import DashboardCard from '../components/shared/cards'
import TenantForm from '../components/tenant/tenantForm'
import Grow from '@mui/material/Grow'
import { Trans } from 'react-i18next'

export default function TenantPage ({ tenantValues, getTenants, seTenant, client, keycloakToken }) {
  const [createOpen, setCreateOpen] = React.useState(false)
  const [sortedTenants, sortTenants] = React.useState([])
  const [count, counter] = React.useState(1)
  React.useEffect(() => {
    sortTenants(tenantValues.reverse((a, b) => parseFloat(a.name) - parseFloat(b.name)))
  }, [tenantValues])
  const mainTitle = <Trans>tenant.titles.page</Trans>
  const rerOder = (newData) => {
    sortTenants(newData)
    counter(count + 1)
  }

  return (
    <div>
      <MainTitle mainTitle={mainTitle}></MainTitle>
      <AddButton
        pageType={
          <TenantForm
            client={client}
            title={<Trans>tenant.titles.new</Trans>}
            close={setCreateOpen}
            action={'create'}
            getTenants={getTenants}
          />
        }
        setOpen={setCreateOpen}
        status={createOpen}
      ></AddButton>
      <Grid container spacing={2} sx={{ marginLeft: '15px ' }}>
        <Grid item xs={12}>
        <SortButton data={sortedTenants} id={'name'} sortData={rerOder}></SortButton>
        </Grid>
        {tenantValues.map((tenant, index) => (
          <Grow
            in={true}
            style={{ transformOrigin: '0 0 0' }}
            {...(true ? { timeout: index * 600 } : {})}
          >
            <Grid item xs={4}>
              <DashboardCard
                pageType={
                  <TenantForm
                    keycloakToken={keycloakToken}
                    client={client}
                    title={
                      <Trans
                        i18nKey="tenant.titles.edit"
                        values={{ name: tenant.name }}
                      />
                    }
                    action={'modify'}
                    tenant={tenant}
                    getTenants={getTenants}
                  ></TenantForm>
                }
                data={tenant}
                getData={getTenants}
                seTenant={seTenant}
              ></DashboardCard>
            </Grid>
          </Grow>
        ))}
      </Grid>
    </div>
  )
}
