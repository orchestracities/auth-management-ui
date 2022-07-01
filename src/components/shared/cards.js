import * as React from 'react'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import MultifunctionButton from './speedDial'
import ServiceChildren from '../service/serviceChildren'
import PoliciesChildren from '../policy/policiesChildren'
import IconList from '../tenant/iconList'


const RadiusDiv = styled('div')(({ theme }) => ({
  borderRadius: '15px',
  background: theme.palette.primary.light
    .replace(')', ' / 70% )')
    .replace(/,/g, ''),
  color: theme.palette.primary.contrastText,
  maxWidth: 550
}))

export default function DashboardCard ({ pageType, data, getData, seTenant,colors}) {
  const [subpathOpen, setSubpathOpen] = React.useState(false)
 
  const [status, setOpen] = React.useState(false)
  const props = { close: setOpen }
  const listOfIcons = IconList()
  const iconMapper = (iconName) => {
    const thisIcon = listOfIcons.filter((e) => e.name === iconName)
    return thisIcon[0].name !== 'none' ? thisIcon[0].icon : data.name[0]
  }
  const layout = React.cloneElement(pageType, props)

const cardColor= typeof colors !=="undefined"
  ? colors.primaryColor
  : data.props.primaryColor;

  const avatarColor= layout.props.action === 'Sub-service-creation'
  ? colors.secondaryColor : data.props.primaryColor;

  return (
    <RadiusDiv
      sx={{
        background:
          layout.props.action === 'Sub-service-creation' ? cardColor : '#8086bab8'
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: avatarColor
             
            }}
            aria-label="recipe"
          >
            {layout.props.action === 'Sub-service-creation'
              ? data.path[1]
              : iconMapper(data.props.icon)}
          </Avatar>
        }
        action={
          <MultifunctionButton

          data={data}
            getData={getData}
            pageType={layout}
            setOpen={setOpen}
            status={status}
          ></MultifunctionButton>
        }
        title={
          layout.props.action === 'Sub-service-creation' ? data.path : data.name
        }
        subheader={<Typography variant="body2">{data.id}</Typography>}
      />
      <CardContent>
        <Typography variant="body2">
          {layout.props.action === 'Sub-service-creation'
            ? layout.props.tenantName_id.name
            : 'description'}
        </Typography>
      </CardContent>
      <CardActions>
        <ServiceChildren
          setOpen={setSubpathOpen}
          status={subpathOpen}
          data={
            layout.props.action === 'modify'
              ? data.service_paths.slice(1)
              : data.children
          }
          masterTitle={layout.props.action === 'modify' ? data.name : data.path}
          getData={getData}
        />
        {layout.props.action === 'Sub-service-creation'
          ? (
              ''
            )
          : (
          <PoliciesChildren
            tenantId={data.id}
            tenantName={data.name}
            seTenant={seTenant}
          ></PoliciesChildren>
            )}
      </CardActions>
    </RadiusDiv>
  )
}
