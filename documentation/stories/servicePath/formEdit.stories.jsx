import React from 'react';
import { EndpointEdit } from './formEdit';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ResourceType/Form/Creation',
  component: EndpointEdit,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    resources: {
      control: false
    },
    env: {
      control: false
    },
    data: {
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
          <Title>Resource Type Modification:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>This is the one used to modify the endpoint of a resource type</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>
            The Resource Type Creation component is inside resource/endpointsForm.js should be rendered inside a modal:
          </Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <EndpointEdit {...args} />;

export const Modify = Template.bind({});
Modify.args = {
  title: 'Modify element',
  close: () => {},
  action: 'create',
  token: '',
  resourceTypeName: 'ResourceName',
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
  data: [
    {
      name: 'http://localhost:1026/v2/entities',
      nameAndID: 'fiware',
      resourceTypeName: 'entity'
    }
  ],
  getTheResources: () => {}
};
