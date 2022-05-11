import * as React from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import DialogContent from '@mui/material/DialogContent'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { InputLabel } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import axios from 'axios'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
})

export default function PolicyForm({ title, close, action, tenantName, services, access_modes, agentsTypes, getServices }) {
  const handleClose = () => {
    close(false)
  }

  // SERVICE PATH
  const [path, setPath] = React.useState()

  const handlePath = (event) => {
    setPath(event.target.value)
  }

  // ACCESS
  const [access, setAccess] = React.useState('')

  const handleAccess = (event) => {
    setAccess(event.target.value)
  }

  // RESOURCE
  const [resource, setResource] = React.useState('')

  const handleResource = (event) => {
    setResource(event.target.value)
  }

  // MODE
  const [mode, setMode] = React.useState([])

  const handleMode = (event) => {
    setMode(event.target.value)
  }

  // AGENT-TYPE
  const [agentType, setAgentType] = React.useState('')

  const handleAgentType = (event) => {
    setAgentType(event.target.value)
  }



  // FORM- tyoe
  const [formType, setFormType] = React.useState("")

  const handleFormType = (event) => {
    setFormType(event.target.value)
  }




  // AGENT
  const [agent, setAgent] = React.useState([])

  const handleAgent = (event) => {
    setAgent(event.target.value)
  }

  // AGENT
  const [agentOthers, setAgentOthers] = React.useState([])

  const handleAgentOthers = (event) => {
    setAgentOthers(event.target.value)
  }

  // AGENT NAME
  const [agentName, setAgentName] = React.useState([])
  // CLASS NAME
  const [className, setClassName] = React.useState([])
  // GROUP NAME
  const [groupName, setGroupName] = React.useState([])

  const agentMapper = () => {
    let agentMapped = [];
    if (formType === 'specific') {
      for (let thisAgent of agent) {
        let appList = [];
        switch (thisAgent) {
          case 'acl:agent':
            agentName.map((name) => (appList.push("acl:agent:" + name)));
            agentMapped = [...agentMapped, ...appList];
            break;
          case 'acl:agentGroup':
            groupName.map((name) => (appList.push("acl:agentGroup:" + name)));
            agentMapped = [...agentMapped, ...appList];
            break;
          case 'acl:agentClass':
            className.map((name) => (appList.push("acl:agentClass:" + name)));
            agentMapped = [...agentMapped, ...appList];
            break;
          default:
            break;
        }
      }
      return agentMapped;
    } else {
      return agentOthers
    }
  }

  const handleSave = () => {
    switch (action) {
      case 'create':
        axios.post(process.env.REACT_APP_ANUBIS_API_URL + 'v1/policies/', {
          access_to: access,
          resource_type: resource,
          mode: mode,
          agent:agentMapper()
        }, {
          headers: {
            'fiware-service': tenantName(),
            'fiware-servicepath': path
          }
        })
          .then((response) => {
            getServices()
            close(false)
          })
          .catch((e) => {
            console.error(e)
          })
        break
      case 'modify':

        break
      default:
        break
    }
  }

  return (
    <div>
      <CustomDialogTitle >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            save
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container
          spacing={3}
        >

          <Grid item xs={12}>
            <TextField id="Service" label="Service" variant="outlined" defaultValue={tenantName()} disabled sx={{
              width: '100%'
            }} />

          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="path">Service Path</InputLabel>
              <Select
                labelId="path"
                id="path"
                variant="outlined"
                value={path}
                label="Service Path"
                onChange={handlePath}
              >
                {services.slice(1).map((service) => (
                  <MenuItem value={service.path}>{service.path}</MenuItem>
                ))}

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="access"
              variant="outlined"
              value={access}
              label="Access To"
              onChange={handleAccess}
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="resource"
              variant="outlined"
              value={resource}
              label="Resource Type"
              onChange={handleResource}
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="mode">Mode</InputLabel>

              <Select
                labelId="mode"
                id="mode"
                variant="outlined"
                value={mode}
                label="Mode"
                multiple
                input={<OutlinedInput label="Mode" />}
                onChange={handleMode}
              >
                {access_modes.map((service) => (
                  <MenuItem value={service.iri}>{service.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="FormType">User-Type</InputLabel>
              <Select
                labelId="FormType"
                id="FormType"
                variant="outlined"
                value={formType}
                label="FormType"
                onChange={handleFormType}
              >
                <MenuItem value={'specific'}>Specific</MenuItem>
                <MenuItem value={'others'}>Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ display: (formType !== "" && formType === 'specific') ? 'block' : 'none' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="Actor">Actor</InputLabel>
                  <Select
                    labelId="Actor"
                    id="Actor"
                    variant="outlined"
                    value={agent}
                    label="Actor"
                    multiple
                    input={<OutlinedInput label="Mode" />}
                    onChange={handleAgent}
                  >
                    {agentsTypes.map((agents) => (
                      <MenuItem value={agents.iri}>{agents.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: (agent !== "" && agent.includes("acl:agent")) ? 'block' : 'none' }}>
                <FormControl fullWidth>
                  <Autocomplete
                    limitTags={2}
                    multiple
                    id="Agent"
                    options={agentName}
                    defaultValue={agentName}
                    freeSolo
                    onChange={(event, newValue) => {
                      setAgentName(newValue);
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" color="secondary" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Agent"
                        placeholder="Agent"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: (agent !== "" && agent.includes("acl:agentGroup")) ? 'block' : 'none' }}>
                <FormControl fullWidth>
                  <Autocomplete
                    limitTags={2}
                    multiple
                    id="Group"
                    options={groupName}
                    onChange={(event, newValue) => {
                      setGroupName(newValue);
                    }}
                    defaultValue={groupName}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" color="secondary" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Group"
                        placeholder="Group"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ display: (agent !== "" && agent.includes("acl:agentClass")) ? 'block' : 'none' }}>
                <FormControl fullWidth>
                  <Autocomplete
                    limitTags={2}
                    multiple
                    id="Class"
                    options={className}
                    defaultValue={className}
                    onChange={(event, newValue) => {
                      setClassName(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" color="secondary" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Class"
                        placeholder="Class"
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ display: (formType !== "" && formType === 'others') ? 'block' : 'none' }}>
            <Grid item xs={12}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="ActorOthers">Actor</InputLabel>
                  <Select
                    labelId="Actor"
                    id="ActorOthers"
                    variant="outlined"
                    value={agentOthers}
                    label="Actor"
                    multiple
                    input={<OutlinedInput label="Mode" />}
                    onChange={handleAgentOthers}
                  >
                    <MenuItem value={'acl:AuthenticatedAgent'}>Authenticated Actor</MenuItem>
                    <MenuItem value={'foaf:Agent'}>Anyone</MenuItem>
                    <MenuItem value={'oc-alc:ResourceTenantAgent'}>Resource Tenant Agent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </div >
  )
}
