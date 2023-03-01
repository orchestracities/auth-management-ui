import React from 'react';
import { ResourceTypeTable } from './table';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ResourceType/Display/Table',
  component: ResourceTypeTable,
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
    },
    page: {
      control: false
    },
    setPage: {
      control: false
    },
    rowsPerPage: {
      control: false
    },
    setRowsPerPage: {
      control: false
    },
    entitiesLenght: {
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
const Template = (args) => <ResourceTypeTable {...args} />;

export const ResourceDisplay = Template.bind({});
ResourceDisplay.args = {
  resources: [
    {
      endpointUrl: 'http://localhost:1026/v2/entities',
      name: 'entity',
      resourceID: 'Tenant1/entity',
      tenantName: 'Tenant1',
      userID: ''
    }
  ],
  token: '',
  env: undefined,
  tokenData: {},
  getTheResources: () => {},
  GeTenantData: () => {
    return 'name';
  },
  page: 0,
  setPage: () => {},
  rowsPerPage: 10,
  setRowsPerPage: () => {},
  entitiesLenght: 1
};
