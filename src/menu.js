import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import React from 'react';

export const menu = [
  {
    icon: <HomeOutlinedIcon />,
    title: 'menu.home.title',
    description: 'menu.home.description',
    route: '/',
    withPermissions: false,
    items: []
  },
  {
    icon: <DatasetOutlinedIcon />,
    title: 'menu.data_management.title',
    description: 'menu.data_management.description',
    withPermissions: false,
    items: [
      {
        title: 'menu.entity.title',
        route: '/Entity',
        withPermissions: false,
        items: []
      }
    ]
  },
  {
    icon: <SecurityOutlinedIcon />,
    title: 'menu.security.title',
    description: 'menu.security.description',
    withPermissions: false,
    items: [
      {
        title: 'menu.policy.title',
        route: '/Policy',
        withPermissions: false,
        items: []
      }
    ]
  },
  {
    icon: <AdminPanelSettingsOutlinedIcon />,
    title: 'menu.administration.title',
    description: 'menu.administration.description',
    withPermissions: true,
    items: [
      {
        title: 'menu.tenant.title',
        route: '/Tenant',
        withPermissions: true,
        items: []
      },
      {
        title: 'menu.service.title',
        route: '/Service',
        withPermissions: true,
        items: []
      },
      {
        title: 'menu.resourcetype.title',
        route: '/ResourceType',
        withPermissions: true,
        items: []
      }
    ]
  }
];
