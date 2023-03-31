import React from 'react';
import { Form } from './form';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entity/Form/CompleteForm',
  component: Form,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    title: {
      control: false
    },
    close: {
      control: false
    },
    action: {
      control: false
    },
    env: {
      control: false
    },
    data: {
      control: false
    },
    getTheEntities: {
      control: false
    },
    types: {
      control: false
    },
    services: {
      control: false
    },
    GeTenantData: {
      control: false
    },
    entityEndpoint: {
      control: false
    },
    view: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Entity Form:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>The form for the entity creaton </Description>
          <Description>
            The form is splitted between the creation and the modification, it changed based on the parameter passed to
            the component, the modify forum has the geoJSON in in for that take a look on the section
          </Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The entity Map edit component is inside entity/entityform.js :</Description>

          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Form {...args} />;

export const Edit = Template.bind({});
Edit.args = {
  title: 'Edit',
  close: () => {},
  action: 'modify',
  env: {},
  data: {
    dateCreated: { type: 'DateTime', value: '2023-02-01T15:12:17.685Z' },
    dateModified: { type: 'DateTime', value: '2023-02-02T08:41:08.230Z' },
    id: 'urn:ngsi-ld:AirQualityObserved:Tenant1',
    temperature: { type: 'Number', value: 12 },
    type: 'AirQualityObserved'
  },
  getTheEntities: () => {},
  types: [
    {
      attrs: {
        temperature: {
          types: ['Number']
        },

        test: {
          types: ['geo:json']
        }
      },
      count: 1,
      type: 'AirQualityObserved'
    }
  ],
  services: [
    {
      id: '493da064-e1ae-4c5b-93c4-534b89ae272f',
      parent_id: null,
      path: '/',
      scope: null,
      tenant_id: 'ad08d69f-8a18-4c8d-b9ac-1432d6b30b30'
    }
  ],
  GeTenantData: () => {},
  entityEndpoint: 'http://localhost:1026/v2/entities?attrs=dateCreated,dateModified,*&options=count'
};

export const Create = Template.bind({});
Create.args = {
  title: 'Create',
  close: () => {},
  action: 'create',
  env: {},
  data: {
    dateCreated: { type: 'DateTime', value: '2023-02-01T15:12:17.685Z' },
    dateModified: { type: 'DateTime', value: '2023-02-02T08:41:08.230Z' },
    id: 'urn:ngsi-ld:AirQualityObserved:Tenant1',
    temperature: { type: 'Number', value: 12 },
    type: 'AirQualityObserved'
  },
  getTheEntities: () => {},
  types: [
    {
      attrs: {
        temperature: {
          types: ['Number']
        },

        test: {
          types: ['geo:json']
        }
      },
      count: 1,
      type: 'AirQualityObserved'
    }
  ],
  services: [
    {
      id: '493da064-e1ae-4c5b-93c4-534b89ae272f',
      parent_id: null,
      path: '/',
      scope: null,
      tenant_id: 'ad08d69f-8a18-4c8d-b9ac-1432d6b30b30'
    }
  ],
  GeTenantData: () => {},
  entityEndpoint: 'http://localhost:1026/v2/entities?attrs=dateCreated,dateModified,*&options=count'
};
