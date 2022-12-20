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
import ColorPicker from './colorPicker';
import IconPicker from './iconPicker';
import axios from 'axios';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Trans } from 'react-i18next';
import useNotification from '../shared/messages/alerts';
import Box from '@mui/material/Box';
import { DropzoneDialog } from 'mui-file-dropzone';
import Avatar from '@mui/material/Avatar';
import * as log from 'loglevel';

const CustomDialogTitle = styled(AppBar)({
  position: 'relative',
  background: 'white',
  boxShadow: 'none'
});

export default function TenantForm({ title, close, action, tenant, getTenants, token, env, renewTokens }) {
  typeof env === 'undefined' ? log.setDefaultLevel('debug') : log.setLevel(env.LOG_LEVEL);
  const anubisURL = typeof env !== 'undefined' ? env.ANUBIS_API_URL : '';

  const [msg, sendNotification] = useNotification();
  log.debug(msg);
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [name, setName] = React.useState(action === 'modify' ? tenant.name : ' ');
  const [primaryColor, setPrimaryColor] = React.useState(action === 'modify' ? tenant.props.primaryColor : '#8086ba');
  const [secondaryColor, setSecondaryColor] = React.useState(
    action === 'modify' ? tenant.props.secondaryColor : '#8086ba'
  );
  const [iconName, setIconName] = React.useState(action === 'modify' ? tenant.props.icon : 'none');

  const [openImageUpload, setOpenImageUpload] = React.useState(false);
  const [customImage, uploadCustomImage] = React.useState([]);
  const [base64Image, setBase64Image] = React.useState(action === 'modify' ? tenant.props.customImage : '');

  const handleClose = () => {
    close(false);
  };
  const httpLink = createHttpLink({
    uri: typeof env !== 'undefined' ? env.CONFIGURATION_API_URL : ''
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    };
  });

  const manageUpload = (files) => {
    uploadCustomImage(files);
    log.debug(files);
  };

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  React.useEffect(async () => {
    if (iconName === 'custom') {
      const result = await toBase64(customImage[0]);
      setBase64Image(result);
    }
  }, [customImage]);

  const handleSave = () => {
    switch (action) {
      case 'create':
        if (iconName === 'custom' && customImage.length === 0) {
          sendNotification({ msg: 'No image uploaded', variant: 'error' });
          break;
        } else {
          axios
            .post(
              anubisURL + 'v1/tenants',
              {
                name: name
              },
              {
                headers: {
                  authorization: `Bearer ${token}`
                }
              }
            )
            .then(() => {
              client
                .mutate({
                  mutation: gql`
                    mutation getTenantConfig(
                      $name: String!
                      $icon: String!
                      $primaryColor: String!
                      $secondaryColor: String!
                      $file: String
                    ) {
                      getTenantConfig(
                        name: $name
                        icon: $icon
                        primaryColor: $primaryColor
                        secondaryColor: $secondaryColor
                        file: $file
                      ) {
                        name
                        icon
                        primaryColor
                        secondaryColor
                      }
                    }
                  `,
                  variables: {
                    name,
                    icon: iconName,
                    file: iconName === 'custom' && customImage.length > 0 && base64Image !== '' ? base64Image : '',
                    primaryColor: primaryColor.toString(),
                    secondaryColor: secondaryColor.toString()
                  }
                })
                .then(() => {
                  close(false);
                  getTenants();
                  sendNotification({
                    msg: (
                      <Trans
                        i18nKey="common.messages.sucessCreate"
                        values={{
                          data: name
                        }}
                      />
                    ),
                    variant: 'success'
                  });
                  renewTokens();
                })
                .catch((e) => {
                  sendNotification({ msg: e.message + ' the config', variant: 'error' });
                });
            })
            .catch((e) => {
              getTenants();
              typeof e.response.data.detail === 'string'
                ? sendNotification({ msg: e.response.data.detail, variant: 'error' })
                : e.response.data.detail.map((msgObj) => sendNotification({ msg: msgObj.msg, variant: 'error' }));
            });

          break;
        }
      case 'modify':
        client
          .mutate({
            mutation: gql`
              mutation modifyTenantConfig(
                $name: String!
                $icon: String!
                $primaryColor: String!
                $secondaryColor: String!
                $file: String
              ) {
                modifyTenantConfig(
                  name: $name
                  icon: $icon
                  primaryColor: $primaryColor
                  secondaryColor: $secondaryColor
                  file: $file
                ) {
                  name
                  icon
                  primaryColor
                  secondaryColor
                }
              }
            `,
            variables: {
              name,
              icon: iconName,
              file: iconName === 'custom' && customImage.length > 0 && base64Image !== '' ? base64Image : '',
              primaryColor: primaryColor.toString(),
              secondaryColor: secondaryColor.toString()
            }
          })
          .then(() => {
            close(false);
            getTenants();
            sendNotification({
              msg: (
                <Trans
                  i18nKey="common.messages.sucessUpdate"
                  values={{
                    data: name
                  }}
                />
              ),
              variant: 'success'
            });
          })
          .catch((e) => {
            getTenants();
            iconName === 'custom' && customImage.length === 0
              ? sendNotification({ msg: 'No image uploaded', variant: 'error' })
              : sendNotification({ msg: e.message + ' the config', variant: 'error' });
          });
        break;
      default:
        break;
    }
  };

  return (
    <Box>
      <CustomDialogTitle>
        <Toolbar>
          <IconButton edge="start" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1, color: 'black' }} variant="h6" component="div">
            {title}
          </Typography>
          <Button autoFocus color="secondary" onClick={handleSave}>
            <Trans>common.saveButton</Trans>
          </Button>
        </Toolbar>
      </CustomDialogTitle>
      <DialogContent sx={{ minHeight: '740px' }}>
        <Grid container spacing={3}>
          {action === 'modify' ? (
            ''
          ) : (
            <Grid item xs={12}>
              <TextField
                id="Name"
                label={<Trans>tenant.form.name</Trans>}
                variant="outlined"
                defaultValue={action === 'modify' ? tenant.name : ''}
                sx={{
                  width: '100%'
                }}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                helperText={name === '' ? 'the name is mandatory' : ''}
                error={name === ''}
              />
            </Grid>
          )}

          <Grid item lg={12} md={12} xs={12} container direction="column" justifyContent="center" alignItems="center">
            <IconPicker previusValue={iconName} setValue={setIconName} mode={action}></IconPicker>
          </Grid>
          <Grid
            item
            lg={12}
            md={12}
            xs={12}
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              marginTop: '3rem',
              display: iconName === 'custom' ? 'flex' : 'none'
            }}
          >
            {base64Image === '' ? (
              <Button variant="outlined" size="large" color="secondary" onClick={() => setOpenImageUpload(true)}>
                <Trans>tenant.form.addImage</Trans>
              </Button>
            ) : (
              <Avatar
                onClick={() => setOpenImageUpload(true)}
                sx={{ width: 56, height: 56, cursor: 'pointer' }}
                aria-label="recipe"
                src={base64Image}
              />
            )}
            <DropzoneDialog
              acceptedFiles={['image/*']}
              cancelButtonText={<Trans>tenant.form.fileCancel</Trans>}
              dialogTitle={''}
              submitButtonText={<Trans>tenant.form.fileSubmit</Trans>}
              dropzoneText={<Trans>tenant.form.fileIstructions</Trans>}
              maxFileSize={typeof env !== 'undefined' ? env.IMAGE_SIZE : ''}
              filesLimit={1}
              open={openImageUpload}
              onClose={() => setOpenImageUpload(false)}
              onSave={(files) => {
                manageUpload(files);
                setOpenImageUpload(false);
              }}
              showPreviews={true}
              showFileNamesInPreview={false}
            />
          </Grid>
          <Grid item lg={6} md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
            <ColorPicker
              defaultValue={primaryColor}
              setColor={setPrimaryColor}
              mode={action}
              text={<Trans>tenant.form.primaryColor</Trans>}
            ></ColorPicker>
          </Grid>
          <Grid item lg={6} md={6} xs={12} container direction="column" justifyContent="center" alignItems="center">
            <ColorPicker
              defaultValue={secondaryColor}
              setColor={setSecondaryColor}
              mode={action}
              text={<Trans>tenant.form.secondaryColor</Trans>}
            ></ColorPicker>
          </Grid>
        </Grid>
      </DialogContent>
    </Box>
  );
}
