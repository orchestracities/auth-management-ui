import React from 'react';
import { ServicePathTable } from './table';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ResourceType/Display/Table',
  component: ServicePathTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    resources: {
      control: false
    },
    env: {
      control: false
    },
    tokenData: {
      control: false
    },
    getTheResources: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Resource Table:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>
            This table will display the data stored inside the configuration api related to the resource types and their
            endpoints
          </Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Resource Table component is inside resource/resourceTypeTable.js :</Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ServicePathTable {...args} />;

export const ResourceDisplay = Template.bind({});
ResourceDisplay.args = {
  resources: [
    {
      endpointUrl
      : 
      "http://localhost:1026/v2/entities",
      name
      : 
      "Orion",
      resourceID
      : 
      "Tenant1/Orion",
      tenantName
      : 
      "Tenant1",
      userID
      : 
      ""
    }
  ],
  token: '',
  env: {
    ANUBIS_API_URL: 'http://localhost:8085/',
    CONFIGURATION_API_URL: 'http://localhost:4000/configuration',
    DESCRIPTION: 'A Management UI for Anubis',
    IMAGE_SIZE: '20',
    KEYCLOACK_ADMIN: 'http://localhost:8080/admin/realms/default',
    LOG_LEVEL: 'debug',
    OIDC_CLIENT: 'configuration',
    OIDC_ISSUER: 'http://localhost:8080/realms/default',
    OIDC_SCOPE: 'openid profile email',
    TITLE: 'Anubis',
    URI: 'http://localhost:3000/'
  },
  tokenData: {},
  getTheResources: () => {},
  GeTenantData: () => {
    return 'name';
  }
};
