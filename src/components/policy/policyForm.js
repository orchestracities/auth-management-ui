import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import { Trans } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Grow from '@mui/material/Grow';
import Zoom from '@mui/material/Zoom';
import FormHelperText from '@mui/material/FormHelperText';
import useNotification from '../shared/messages/alerts';
import { getEnv } from '../../env';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as log from 'loglevel';

const env = getEnv();

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function PolicyForm({
  title,
  close,
  action,
  tenantName,
  services,
  access_modes,
  agentsTypes,
  getServices,
  data,
  token
}) {
  const [msg, sendNotification] = useNotification();
  typeof env.CONSOLE === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.CONSOLE);

  log.debug(msg);
  const handleClose = () => {
    close(false);
  };

  //errorLog
  const [error, setError] = React.useState(null);

  // SERVICE PATH
  const [path, setPath] = React.useState(action === 'create' ? '' : data.fiware_service_path);

  const handlePath = (event) => {
    setPath(event.target.value);
  };

  // ACCESS
  const [access, setAccess] = React.useState(action === 'create' ? '' : data.access_to);

  const handleAccess = (event) => {
    setAccess(event.target.value);
  };

  // RESOURCE
  const [resource, setResource] = React.useState(action === 'create' ? '' : data.resource_type);

  const handleResource = (event) => {
    setResource(event.target.value);
  };

  // MODE
  const [mode, setMode] = React.useState(action === 'create' ? [] : data.mode);

  const handleMode = (event) => {
    setMode(event.target.value);
  };
  const checkAgenTypes = (arr, values) => {
    return values.every((value) => {
      return arr.includes(value);
    });
  };

  const specificAgenTypes = ['acl:AuthenticatedAgent', 'foaf:Agent', 'oc-acl:ResourceTenantAgent'];
  const [formType, setFormType] = React.useState(
    action === 'create' ? '' : checkAgenTypes(specificAgenTypes, data.agent) ? 'others' : 'specific'
  );

  const handleFormType = (event) => {
    setFormType(event.target.value);
  };

  // AGENT
  const [agentOthers, setAgentOthers] = React.useState(action === 'create' ? [] : data.agent);

  const handleAgentOthers = (event) => {
    setAgentOthers(event.target.value);
  };
  const createAgentMap = (agents) => {
    let newMap = [];
    for (let agent of agents) {
      const agentName = agent.split(':').slice('2').join(':');
      const agenType = agent.replace(':' + agentName, '');
      newMap.push({ type: agenType, name: agentName });
    }
    return newMap;
  };
  const [agentsMap, setAgentsMap] = React.useState(action === 'create' ? [] : createAgentMap(data.agent));

  // AGENT

  React.useEffect(() => {
    setAgentsMap(agentsMap);
  }, [agentsMap]);

  const handleAgentsName = (event) => {
    const newArray = agentsMap;
    agentsMap[Number(event.target.id)].name = event.target.value;
    setAgentsMap([...[], ...newArray]);
  };
  const handleAgentsType = (event) => {
    const newArray = agentsMap;
    newArray[Number(event.target.name)].type = event.target.value;
    setAgentsMap([...[], ...newArray]);
  };
  const addAgents = () => {
    setAgentsMap([...agentsMap, { type: null, name: '' }]);
  };
  const removeAgents = (index) => {
    const newArray = agentsMap;
    newArray.splice(index, 1);
    setAgentsMap([...[], ...newArray]);
  };

  const agentMapper = () => {
    const agentMapped = [];
    if (formType === 'specific') {
      for (const thisAgent of agentsMap) {
        agentMapped.push(thisAgent.type + ':' + thisAgent.name);
      }
      return agentMapped;
    } else {
      return agentOthers;
    }
  };

  const handleSave = () => {
    switch (action) {
      case 'create':
        axios
          .post(
            env.ANUBIS_API_URL + 'v1/policies/',
            {
              access_to: access,
              resource_type: resource,
              mode,
              agent: agentMapper()
            },
            {
              headers: {
                'fiware-service': tenantName(),
                'fiware-servicepath': path,
                authorization: `Bearer ${token}`
              }
            }
          )
          .then(() => {
            getServices();
            close(false);
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessCreate"
                  values={{
                    data: 'Policy'
                  }}
                />
              ),
              variant: 'success'
            });
          })
          .catch((e) => {
            getServices();
            setError(e);
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          });
        break;
      case 'modify':
        axios
          .put(
            env.ANUBIS_API_URL + 'v1/policies/' + data.id,
            {
              access_to: access,
              resource_type: resource,
              mode,
              agent: agentMapper()
            },
            {
              headers: {
                policy_id: data.id,
                'fiware-service': tenantName(),
                'fiware-servicepath': path,
                authorization: `Bearer ${token}`
              }
            }
          )
          .then(() => {
            getServices();
            close(false);
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessUpdate"
                  values={{
                    data: data.id
                  }}
                />
              ),
              variant: 'success'
            });
          })
          .catch((e) => {
            getServices();
            setError(e);
            e.response.data.detail.map((thisError) => sendNotification({ msg: thisError.msg, variant: 'error' }));
          });
        break;
      default:
        break;
    }
  };
  const getLabelName = (name) => {
    switch (name) {
      case 'acl:agent':
        return <Trans>policies.form.agent</Trans>;
      case 'acl:agentGroup':
        return <Trans>policies.form.agentGroup</Trans>;
      case 'acl:agentClass':
        return <Trans>policies.form.agentClass</Trans>;
      default:
        break;
    }
  };

  const errorCases = (value) => {
    if (error !== null) {
      switch (true) {
        case value === '' || typeof value === 'undefined' || value === null:
          return true;
        case value.length === 0:
          return true;
        case value === 'specific' && (agentsMap.length === 0 || agentsMap[0].type === null || agentsMap[0].name === ''):
          return true;
        default:
          return false;
      }
    } else {
      return false;
    }
  };
  const errorText = (value) => {
    if (error !== null) {
      switch (true) {
        case value === '' || typeof value === 'undefined' || value === null:
          return <Trans>common.errors.mandatory</Trans>;
        case value.length === 0:
          return <Trans>common.errors.mandatory</Trans>;
        case value === 'specific' && (agentsMap.length === 0 || agentsMap[0].type === null || agentsMap[0].name === ''):
          return <Trans>common.errors.userMap</Trans>;
        default:
          return false;
      }
    } else {
      return false;
    }
  };

  const theme = useTheme();
  const isResponsive = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ maxWidth: '70%', ml: 2, flex: 1, color: 'black' }}
            noWrap
            gutterBottom
            variant="h6"
            component="div"
          >
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            <Trans>common.saveButton</Trans>
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '400px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="Service"
              label="Service"
              variant="outlined"
              defaultValue={tenantName()}
              disabled
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom component="div" color="primary">
              <Trans>policies.form.mainTitle</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="path" error={errorCases(path)}>
                {' '}
                <Trans>policies.form.servicePath</Trans>
              </InputLabel>
              <Select
                labelId="path"
                id="path"
                variant="outlined"
                value={path}
                label={<Trans>policies.form.servicePath</Trans>}
                onChange={handlePath}
                error={errorCases(path)}
              >
                {services.map((service, index) => (
                  <MenuItem key={index} value={service.path}>
                    {service.path}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={errorCases(path)}>{errorText(path)}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="access"
              variant="outlined"
              value={access}
              label={<Trans>policies.form.resource</Trans>}
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
              label={<Trans>policies.form.resourceType</Trans>}
              onChange={handleResource}
              sx={{
                width: '100%'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="mode" error={errorCases(mode)}>
                <Trans>policies.form.mode</Trans>
              </InputLabel>

              <Select
                labelId="mode"
                id="mode"
                variant="outlined"
                value={mode}
                label={<Trans>policies.form.mode</Trans>}
                multiple
                input={<OutlinedInput label="Mode" />}
                onChange={handleMode}
                error={errorCases(mode)}
              >
                {access_modes.map((service) => (
                  <MenuItem key={service.iri} value={service.iri}>
                    {service.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error={errorCases(mode)}>{errorText(mode)}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom component="div" color="primary">
              <Trans>policies.form.actorTitle</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: '2%' }}>
            <FormControl fullWidth>
              <InputLabel id="FormType" error={errorCases(formType)}>
                <Trans>policies.form.userType</Trans>
              </InputLabel>
              <Select
                color="secondary"
                labelId="FormType"
                id="FormType"
                variant="outlined"
                value={formType}
                label={<Trans>policies.form.userType</Trans>}
                onChange={handleFormType}
                error={errorCases(formType)}
              >
                <MenuItem value={'specific'}>Specific</MenuItem>
                <MenuItem value={'others'}>Others</MenuItem>
              </Select>
              <FormHelperText error={errorCases(formType)}>{errorText(formType)}</FormHelperText>
            </FormControl>
          </Grid>
          <Zoom
            in={formType !== '' && formType === 'specific'}
            style={{ transformOrigin: '0 0 0' }}
            {...(formType !== '' && formType !== 'specific' ? { timeout: 500 } : {})}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: formType !== '' && formType === 'specific' ? 'block' : 'none'
              }}
            >
              <Grid container spacing={6}>
                {agentsMap.map((agent, i) => (
                  <React.Fragment key={i}>
                    <Grid item xs={12} sm={12} md={2} lg={2} xl={2}></Grid>
                    <Grid item xs={12} sm={12} md={11} lg={10} xl={10}>
                      <Grid container spacing={12} direction="row" justifyContent="center" alignItems="center">
                        <Grid item xs={9} sm={9} md={10} lg={10} xl={10}>
                          <Grid container spacing={isResponsive ? 2 : 4}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <InputLabel id={'User' + i} error={errorCases(agent.type)}>
                                  <Trans>policies.form.user</Trans>
                                </InputLabel>
                                <Select
                                  color="secondary"
                                  labelId={'User' + i}
                                  id={'User' + i}
                                  name={i}
                                  key={'User' + i}
                                  value={agent.type}
                                  variant="outlined"
                                  onChange={handleAgentsType}
                                  label={<Trans>policies.form.user</Trans>}
                                  input={<OutlinedInput label="Mode" />}
                                  error={errorCases(agent.type)}
                                >
                                  {agentsTypes.map((agents) => (
                                    <MenuItem key={agents.iri} value={agents.iri}>
                                      {agents.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText error={errorCases(agent.type)}>{errorText(agent.type)}</FormHelperText>
                              </FormControl>
                            </Grid>
                            <Grow
                              in={agent.type !== null}
                              style={{ transformOrigin: '0 0 0' }}
                              {...(agent.type !== null ? { timeout: 500 } : {})}
                            >
                              <Grid
                                item
                                xs={12}
                                sx={{
                                  display: agent.type !== null ? 'block' : 'none'
                                }}
                              >
                                <TextField
                                  color="secondary"
                                  id={i}
                                  key={'actorName' + i}
                                  variant="outlined"
                                  label={getLabelName(agent.type)}
                                  value={agent.name}
                                  onChange={handleAgentsName}
                                  sx={{
                                    width: '100%'
                                  }}
                                  error={errorCases(agent.name)}
                                  helperText={errorText(agent.name)}
                                />
                              </Grid>
                            </Grow>
                          </Grid>
                        </Grid>
                        <Grid item xs={3} sm={3} md={2} lg={2} xl={2}>
                          <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={isResponsive ? 1 : 2}
                          >
                            <Tooltip title={<Trans>common.deleteTooltip</Trans>}>
                              <IconButton
                                aria-label="delete"
                                size="large"
                                onClick={() => {
                                  removeAgents(i);
                                }}
                              >
                                <DeleteIcon fontSize="inherit" />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  {' '}
                  <Grid container direction="row" justifyContent="center" alignItems="center" spacing={0}>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        addAgents();
                      }}
                    >
                      New Actor
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Zoom>
          <Zoom
            in={formType !== '' && formType === 'others'}
            style={{ transformOrigin: '0 0 0' }}
            {...(formType !== '' && formType !== 'others' ? { timeout: 500 } : {})}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: formType !== '' && formType === 'others' ? 'block' : 'none'
              }}
            >
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="ActorOthers" error={errorCases(agentOthers)}>
                      <Trans>policies.form.defaultActor</Trans>
                    </InputLabel>
                    <Select
                      color="secondary"
                      labelId="ActorOthers"
                      id="ActorOthers"
                      variant="outlined"
                      value={agentOthers}
                      label={<Trans>policies.form.defaultActor</Trans>}
                      multiple
                      input={<OutlinedInput label="ActorOthers" />}
                      onChange={handleAgentOthers}
                      error={errorCases(agentOthers)}
                    >
                      <MenuItem value={'acl:AuthenticatedAgent'}>Authenticated Actor</MenuItem>
                      <MenuItem value={'foaf:Agent'}>Anyone</MenuItem>
                      <MenuItem value={'oc-acl:ResourceTenantAgent'}>Resource Tenant Agent</MenuItem>
                    </Select>
                    <FormHelperText error={errorCases(agentOthers)}>{errorText(agentOthers)}</FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Zoom>
        </Grid>
      </DialogContent>
    </div>
  );
}
