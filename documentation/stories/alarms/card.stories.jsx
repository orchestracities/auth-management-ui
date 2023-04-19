import React from 'react';
import { AlarmsCard } from './card';

import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Alarms/Card',
  component: AlarmsCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    pageType: {
      control: false
    },
    data: {
      control: false
    },
    colors: {
      control: false
    },
    getData: {
      control: false
    },
    env: {
      control: false
    },
    token: {
      control: false
    },
    language: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Alarms Card:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A clickable card to display alarm data.</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Card component is inside alarms/alarmCard.js :</Description>
          <Description>
            The element that will be rendered inside the modal, can only be a alarmForm with "Edit" as a action.
          </Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};
const emptyFunction = () => {};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <AlarmsCard {...args} />;

export const PathExample = Template.bind({});
PathExample.args = {
  pageType: <></>,
  data: {
    id: 1,
    alarm_type: 'path',
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
  colors: { secondaryColor: '#0018ef', primaryColor: '#0018ef' },
  getData: emptyFunction,
  env: undefined,
  token: '',
  language: 'en'
};

export const EntityExample = Template.bind({});
EntityExample.args = {
  pageType: <></>,
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
  colors: { secondaryColor: '#0018ef', primaryColor: '#0018ef' },
  getData: emptyFunction,
  env: undefined,
  token: '',
  language: 'en'
};
