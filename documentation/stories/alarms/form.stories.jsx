import React from 'react';
import { Form } from './form';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Alarms/Form',
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
    },
    token: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Alarm Form:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>The form for the Alarm creaton and edit </Description>
          <Description>
            The form is splitted between the creation and the edit, it changed based on the parameter passed to the
            component.
          </Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The alarm form component is inside alarms/alarmform.js :</Description>

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
  env: undefined,
  data: {
    id: 1,
    alarm_type: 'entity',
    tenant: 'EKZ',
    servicepath: '/',
    entity_id: 'urn:ngsi-ld:sss',
    entity_type: 'Thing',
    channel_type: 'email',
    channel_destination: ['smartcity@ekz.ch'],
    time_unit: 'h',
    max_time_since_last_update: 6,
    alarm_frequency_time_unit: 'd',
    alarm_frequency_time: 1,
    time_of_last_alarm: '2023-04-05T15:27:37.222Z',
    status: 'active'
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
  view: () => {},
  token: '',
  entityEndpoint: 'http://localhost:1026/v2/entities?attrs=dateCreated,dateModified,*&options=count'
};

export const Create = Template.bind({});
Create.args = {
  title: 'Create',
  close: () => {},
  action: 'create',
  env: undefined,
  data: {
    id: 1,
    alarm_type: 'entity',
    tenant: 'EKZ',
    servicepath: '/',
    entity_id: 'urn:ngsi-ld:sss',
    entity_type: 'Thing',
    channel_type: 'email',
    channel_destination: ['smartcity@ekz.ch'],
    time_unit: 'h',
    max_time_since_last_update: 6,
    alarm_frequency_time_unit: 'd',
    alarm_frequency_time: 1,
    time_of_last_alarm: '2023-04-05T15:27:37.222Z',
    status: 'active'
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
  view: () => {},
  token: '',
  entityEndpoint: 'http://localhost:1026/v2/entities?attrs=dateCreated,dateModified,*&options=count'
};
