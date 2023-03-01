import React from 'react';
import { PolicyDataInTable } from './policyTable';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Policy/DataDisplay',
  component: PolicyDataInTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    getData: {
      control: false
    },
    data: {
      control: false
    },
    access_modes: {
      control: false
    },
    agentsTypes: {
      control: false
    },
    env: {
      control: false
    },
    token: {
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
          <Title>Policy Display:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A table to display the policies data</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The policy table component is inside policy/policyTable.js :</Description>
          <Description>
            The element should be rendered with the policyfilter component inside the same page in order to filter data
          </Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PolicyDataInTable {...args} />;

export const Table = Template.bind({});
Table.args = {
  data: [
    {
      access_to: 'default',
      agent: ['acl:agentClass:Admin'],
      fiware_service: 'Tenant1',
      fiware_service_path: '/',
      id: 'cb077db5-ec93-48df-923d-99f9ad594799',
      mode: ['acl:Control'],
      resource_type: 'policy'
    },
    {
      access_to: 'default',
      agent: ['acl:agentClass:Admin'],
      fiware_service: 'Tenant1',
      fiware_service_path: '/',
      id: 'cb077db5-ec93-48df-923d-99f9ad594799',
      mode: ['acl:Control'],
      resource_type: 'policy'
    }
  ],
  access_modes: [
    { iri: 'acl:Read', name: 'read' },

    { iri: 'acl:Write', name: 'write' },

    { iri: 'acl:Control', name: 'control' },

    { iri: 'acl:Append', name: 'append' }
  ],
  agentsTypes: [
    { iri: 'acl:agent', name: 'agent' },

    { iri: 'acl:agentGroup', name: 'group' },

    { iri: 'acl:agentClass', name: 'class' }
  ],
  getData: () => {},
  env: undefined,
  token: '',
  page: 0,
  setPage: () => {},
  rowsPerPage: 10,
  setRowsPerPage: () => {},
  policiesLength: 2
};
