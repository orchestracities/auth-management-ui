import * as React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputLabel } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import axios from "axios";
import { Mode } from "@mui/icons-material";
import { Trans } from "react-i18next";

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

  const [otherAgent, setOtherAgent] = React.useState("");

  const handleOtherAgent = (event) => {
    setOtherAgent(event.target.value);
  };

  // AGENT
  const [agent, setAgent] = React.useState([]);

  const handleAgent = (event) => {
    setAgent(event.target.value);
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
              agent,
            },
            {
              headers: {
                fiware_service: tenantName(),
                fiware_service_path: path,
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
            save
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
            <FormControl fullWidth>
              <InputLabel id="path">
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
              label={<Trans>policies.form.acessTo</Trans>}
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
            <FormControl fullWidth>
              <InputLabel id="agentType">
                <Trans>policies.form.agentType</Trans>
              </InputLabel>
              <Select
                labelId="agentType"
                id="agentType"
                variant="outlined"
                value={agentType}
                label={<Trans>policies.form.agentType</Trans>}
                onChange={handleAgentType}
              >
                <MenuItem value={"default"}>Default</MenuItem>
                <MenuItem value={"user"}>User</MenuItem>
                <MenuItem value={"role"}>Role</MenuItem>
                <MenuItem value={"group"}>User</MenuItem>
                <MenuItem value={"other"}>Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {agentType === "default" ? (
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="agent">
                  <Trans>policies.form.agent</Trans>
                </InputLabel>
                <Select
                  labelId="agent"
                  id="agent"
                  variant="outlined"
                  value={agent}
                  label={<Trans>policies.form.agent</Trans>}
                  multiple
                  input={<OutlinedInput label="Mode" />}
                  onChange={handleAgent}
                >
                  <MenuItem value={"acl:AuthenticatedAgent"}>
                    Authenticated Agent
                  </MenuItem>
                  <MenuItem value={"foaf:Agent"}>Agent</MenuItem>
                  <MenuItem value={"oc-acl:ResourceTenantAgent"}>
                    Resource Tenant Agent
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          ) : (
            ""
          )}

          {agentType === "other" ? (
            <Grid item xs={12}>
              <TextField
                id="OtherAgent"
                variant="outlined"
                value={otherAgent}
                label={<Trans>policies.form.otherAgent</Trans>}
                onChange={handleOtherAgent}
                sx={{
                  width: "100%",
                }}
              />
            </Grid>
          ) : (
            ""
          )}
        </Grid>
      </DialogContent>
    </div>
  );
}
