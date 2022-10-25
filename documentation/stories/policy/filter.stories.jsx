import React from 'react';
import { PoliciesFiltering } from './filter';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY, Source } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Policy/Filtering',
  component: PoliciesFiltering,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    data: {
      control: false
    },
    access_modes: {
      control: false
    },
    agentsTypes: {
      control: false
    },
    mapper: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Policy Filters:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A set of filters to help the user</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The policy filters component is inside policy/policyFilters.js :</Description>
          <Description>The element should be rendered with the policyTable component inside the same page</Description>
          <Description>
            To control every filter the component is using an object is composed by a property with the filter ID and
            two properties value for the hook value and set for the hook function
          </Description>
          <Source
            language="jsx"
            dark={true}
            code={`
                        import * as React from 'react'


                        const [mode, setMode] = React.useState(null)
                        const [agent, setAgent] = React.useState(null)
                        const [resource, setResource] = React.useState(null)
                        const [resourceType, setResourceType] = React.useState(null)
                        const [agentType, setAgentype] = React.useState(null)
                        const [policyFilter, setPolicyFilter] = React.useState(null)
                        
                        const filterMapper = {
                            mode: {
                                value: mode,
                                set: setMode
                            },
                            agent: {
                                value: agent,
                                set: setAgent
                            },
                            resource: {
                                value: resource,
                                set: setResource
                            },
                            resourceType: {
                                value: resourceType,
                                set: setResourceType
                            },
                            agentType: {
                                value: agentType,
                                set: setAgentype
                            },
                            policy: {
                                value: policyFilter,
                                set: setPolicyFilter
                            }
                        }
  `}
          />

          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <PoliciesFiltering {...args} />;

export const AllFilters = Template.bind({});
AllFilters.args = {
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
  mapper: {},
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
  ]
};
