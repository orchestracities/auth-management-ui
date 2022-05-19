import * as React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import DialogContent from "@mui/material/DialogContent";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputLabel } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Trans } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import Grow from "@mui/material/Grow";
import Zoom from "@mui/material/Zoom";

const CustomDialogTitle = styled(AppBar)({
  position: "relative",
  background: "white",
  boxShadow: "none",
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
}) {
  const handleClose = () => {
    close(false);
  };

  // SERVICE PATH
  const [path, setPath] = React.useState();

  const handlePath = (event) => {
    setPath(event.target.value);
  };

  // ACCESS
  const [access, setAccess] = React.useState("");

  const handleAccess = (event) => {
    setAccess(event.target.value);
  };

  // RESOURCE
  const [resource, setResource] = React.useState("");

  const handleResource = (event) => {
    setResource(event.target.value);
  };

  // MODE
  const [mode, setMode] = React.useState([]);

  const handleMode = (event) => {
    setMode(event.target.value);
  };

  // AGENT-TYPE
  const [agentType, setAgentType] = React.useState("");

  const handleAgentType = (event) => {
    setAgentType(event.target.value);
  };

  // FORM- tyoe
  const [formType, setFormType] = React.useState("");

  const handleFormType = (event) => {
    setFormType(event.target.value);
  };

  // AGENT
  const [agentOthers, setAgentOthers] = React.useState([]);

  const handleAgentOthers = (event) => {
    setAgentOthers(event.target.value);
  };

  // AGENT
  const [agentsMap, setAgentsMap] = React.useState([]);
  const [index, setIndex] = React.useState(0);

  const handleAgentsName = (event) => {
    const newArray = agentsMap;
    newArray[Number(event.target.id)].name = event.target.value;
    setAgentsMap(newArray);
    setIndex(Math.random());
  };
  const handleAgentsType = (event) => {
    const newArray = agentsMap;
    newArray[Number(event.target.name)].type = event.target.value;
    setAgentsMap(newArray);
    setIndex(Math.random());
  };
  const addAgents = () => {
    setAgentsMap([...agentsMap, { type: null, name: "" }]);
  };
  const removeAgents = (index) => {
    const newArray = agentsMap;
    newArray.splice(index, 1);
    setAgentsMap(newArray);
    setIndex(Math.random());
  };

  const agentMapper = () => {
    const agentMapped = [];
    if (formType === "specific") {
      for (const thisAgent of agentsMap) {
        agentMapped.push(thisAgent.type + ":" + thisAgent.name);
      }
      return agentMapped;
    } else {
      return agentOthers;
    }
  };

  const handleSave = () => {
    switch (action) {
      case "create":
        axios
          .post(
            process.env.REACT_APP_ANUBIS_API_URL + "v1/policies/",
            {
              access_to: access,
              resource_type: resource,
              mode,
              agent: agentMapper(),
            },
            {
              headers: {
                "fiware-service": tenantName(),
                "fiware-servicepath": path,
              },
            }
          )
          .then((response) => {
            getServices();
            close(false);
          })
          .catch((e) => {
            console.error(e);
          });
        break;
      case "modify":
        break;
      default:
        break;
    }
  };
  const getLabelName = (name) => {
    switch (name) {
      case "acl:agent":
        return <Trans>policies.form.agent</Trans>;
        break;
      case "acl:agentGroup":
        return <Trans>policies.form.agentGroup</Trans>;
        break;
      case "acl:agentClass":
        return <Trans>policies.form.agentClass</Trans>;
        break;
      default:
        break;
    }
  };
  return (
    <div>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography
            sx={{ ml: 2, flex: 1, color: "black" }}
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
      <DialogContent sx={{ minHeight: "400px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="Service"
              label="Service"
              variant="outlined"
              defaultValue={tenantName()}
              disabled
              sx={{
                width: "100%",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              color="primary"
            >
              <Trans>policies.form.mainTitle</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="path">
                {" "}
                <Trans>policies.form.servicePath</Trans>
              </InputLabel>
              <Select
                labelId="path"
                id="path"
                variant="outlined"
                value={path}
                label={<Trans>policies.form.servicePath</Trans>}
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
              label={<Trans>policies.form.accessTo</Trans>}
              onChange={handleAccess}
              sx={{
                width: "100%",
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
                width: "100%",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="mode">
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
              >
                {access_modes.map((service) => (
                  <MenuItem value={service.iri}>{service.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              color="primary"
            >
              <Trans>policies.form.actorTitle</Trans>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: "2%" }}>
            <FormControl fullWidth>
              <InputLabel id="FormType">
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
              >
                <MenuItem value={"specific"}>Specific</MenuItem>
                <MenuItem value={"others"}>Others</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Zoom
            in={formType !== "" && formType === "specific"}
            style={{ transformOrigin: "0 0 0" }}
            {...(formType !== "" && formType === "specific"
              ? { timeout: 500 }
              : {})}
          >
            <Grid
              item
              xs={12}
              sx={{
                display:
                  formType !== "" && formType === "specific" ? "block" : "none",
              }}
            >
              <Grid container spacing={6}>
                {agentsMap.map((agent, i) => (
                  <React.Fragment>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={10}>
                      <Grid
                        container
                        spacing={12}
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={10}>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
                              <FormControl fullWidth>
                                <InputLabel id={"User" + i}>
                                  <Trans>policies.form.user</Trans>
                                </InputLabel>
                                <Select
                                  color="secondary"
                                  labelId={"User" + i}
                                  id={"User" + i}
                                  name={i}
                                  key={"User" + i}
                                  value={agent.type}
                                  variant="outlined"
                                  onChange={handleAgentsType}
                                  label={<Trans>policies.form.user</Trans>}
                                  input={<OutlinedInput label="Mode" />}
                                >
                                  {agentsTypes.map((agents) => (
                                    <MenuItem value={agents.iri}>
                                      {agents.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grow
                              in={agent.type !== null}
                              style={{ transformOrigin: "0 0 0" }}
                              {...(agent.type !== null ? { timeout: 500 } : {})}
                            >
                              <Grid
                                item
                                xs={12}
                                sx={{
                                  display:
                                    agent.type !== null ? "block" : "none",
                                }}
                              >
                                <TextField
                                  color="secondary"
                                  id={i}
                                  key={"actorName" + i}
                                  variant="outlined"
                                  label={getLabelName(agent.type)}
                                  value={agent.name}
                                  onChange={handleAgentsName}
                                  sx={{
                                    width: "100%",
                                  }}
                                />
                              </Grid>
                            </Grow>
                          </Grid>
                        </Grid>
                        <Grid item xs={2}>
                          <Grid
                            container
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            spacing={4}
                          >
                            <Grid item xs={12}>
                              <Tooltip
                                title={<Trans>common.deleteTooltip</Trans>}
                              >
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
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  {" "}
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0}
                  >
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
            in={formType !== "" && formType === "others"}
            style={{ transformOrigin: "0 0 0" }}
            {...(formType !== "" && formType === "others"
              ? { timeout: 500 }
              : {})}
          >
            <Grid
              item
              xs={12}
              sx={{
                display:
                  formType !== "" && formType === "others" ? "block" : "none",
              }}
            >
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="ActorOthers">
                      <Trans>policies.form.actor</Trans>
                    </InputLabel>
                    <Select
                      color="secondary"
                      labelId="Actor"
                      id="ActorOthers"
                      variant="outlined"
                      value={agentOthers}
                      label={<Trans>policies.form.actor</Trans>}
                      multiple
                      input={<OutlinedInput label="Mode" />}
                      onChange={handleAgentOthers}
                    >
                      <MenuItem value={"acl:AuthenticatedAgent"}>
                        Authenticated Actor
                      </MenuItem>
                      <MenuItem value={"foaf:Agent"}>Anyone</MenuItem>
                      <MenuItem value={"oc-alc:ResourceTenantAgent"}>
                        Resource Tenant Agent
                      </MenuItem>
                    </Select>
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
