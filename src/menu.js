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
    items: []
  },
  {
    icon: <DatasetOutlinedIcon />,
    title: 'menu.dataManagement.title',
    description: 'menu.dataManagement.description',
    items: [
      {
        title: 'menu.entity.title',
        route: '/Entity',
        items: []
      },
      {
        title: 'alarms',
        route: '/Alarms',
        items: []
      }
    ]
  },
  {
    icon: <SecurityOutlinedIcon />,
    title: 'menu.security.title',
    description: 'menu.security.description',
    items: [
      {
        title: 'menu.policy.title',
        route: '/Policy',
        items: []
      }
    ]
  },
  {
    icon: <AdminPanelSettingsOutlinedIcon />,
    title: 'menu.administration.title',
    description: 'menu.administration.description',
    withRole: 'tenant-admin',
    withSuperAdmin: true,
    items: [
      {
        title: 'menu.tenant.title',
        route: '/Tenant',
        withSuperAdmin: true,
        items: []
      },
      {
        title: 'menu.service.title',
        route: '/Service',
        withRole: 'tenant-admin',
        withSuperAdmin: true,
        items: []
      },
      {
        title: 'menu.resourcetype.title',
        route: '/ResourceType',
        withRole: 'tenant-admin',
        withSuperAdmin: true,
        items: []
      }
    ]
  }
];
