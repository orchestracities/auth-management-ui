import * as React from 'react'
import Grid from '@mui/material/Grid'
import ActorFilter from './filters/actorFilter'
import ActorTypeFilter from './filters/actorTypeFilter'
import PathFilter from './filters/pathFilter'
import ResourceTypeFilter from './filters/typeFilter'
import ModeFilter from './filters/modeFilter'

export default function PolicyFilters ({
  data,
  access_modes,
  agentsTypes,
  mapper
}) {
  const [status, setstatus] = React.useState(null)
  const getUniqueListBy = (arr, key) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()]
  }

  const getAllAgentsNames = () => {
    const agents = []
    for (const thisPolicy of data) {
      for (const thisAgent of thisPolicy.agent) {
        const thisAgentSplit = thisAgent.split(':').slice('2').join(':')
        if (thisAgentSplit !== '') {
          agents.push({ iri: thisAgent, name: thisAgentSplit })
        }
      }
    }
    return getUniqueListBy(agents, 'iri')
  }
  const getSpecificAgentsNames = (selectedAgentType) => {
    const agents = []
    for (const thisPolicy of data) {
      for (const thisAgent of thisPolicy.agent) {
        const thisAgentSplit = thisAgent.split(':').slice('2').join(':')
        const agentType = thisAgent.split(':', 2).join(':')
        if (thisAgentSplit !== '' && agentType === selectedAgentType) {
          agents.push({ iri: thisAgent, name: thisAgentSplit })
        }
      }
    }
    return getUniqueListBy(agents, 'iri')
  }

  const agentsNames = [
    ...agentsTypes,
    ...[
      { iri: 'acl:AuthenticatedAgent', name: 'authenticated agent' },
      { iri: 'foaf:Agent', name: 'anyone' },
      { iri: 'oc-acl:ResourceTenantAgent', name: 'resource tenant agent' }
    ]
  ]
  const fiware_service_path = getUniqueListBy(data, 'fiware_service_path')
  const resource_type = getUniqueListBy(data, 'resource_type')
  React.useEffect(() => {
    if (status === '') {
      setstatus(null)
    }
  }, [status])

  return (
    <Grid
      container
      direction="row"
      spacing={0.5}
      justifyContent="flex-start"
      alignItems="center"
    >
      <Grid
        item
        xs={status === 'PathFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'PathFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <PathFilter
          filterValue={mapper.policy}
          data={fiware_service_path}
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ModeFilter' ? 12 : 'auto'}
        sx={{
          display: status === null || status === 'ModeFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ModeFilter
          filterValue={mapper.mode}
          data={access_modes}
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ResourceTypeFilter' ? 12 : 'auto'}
        sx={{
          display:
            status === null || status === 'ResourceTypeFilter'
              ? 'flex'
              : 'none'
        }}
        zeroMinWidth
      >
        <ResourceTypeFilter
          filterValue={mapper.resourceType}
          data={resource_type}
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ActorFilter' ? 12 : 'auto'}
        sx={{
          display:
            status === null || status === 'ActorFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ActorFilter
          filterValue={mapper.agent}
          data={
            mapper.agentType.value === null
              ? getAllAgentsNames()
              : getSpecificAgentsNames(mapper.agentType.value.iri)
          }
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ActorTypeFilter' ? 12 : 'auto'}
        sx={{
          display:
            status === null || status === 'ActorTypeFilter' ? 'flex' : 'none'
        }}
        zeroMinWidth
      >
        <ActorTypeFilter
          filterValue={mapper.agentType}
          data={agentsNames}
          status={status}
          setstatus={setstatus}
        />
      </Grid>
      <Grid
        item
        xs={status === 'ActorTypeFilter' ? 12 : 'auto'}
        sx={{
          display:
            status === null || status === 'ActorTypeFilter' ? 'flex' : 'none'
        }}
      ></Grid>
    </Grid>
  )
}
