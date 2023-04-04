import React from 'react';
import { Display } from './display';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entity/Form/DisplayData',
  component: Display,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    title: {
      control: false
    },
    close: {
      control: false
    },
    data: {
      control: false
    },
    types: {
      control: false
    },
    setView: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Entity Display:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>The visualization of every element chainde to the entity </Description>
          <Description>
            The component is returning a more simple data visualization for the entity and the possibility to switch to
            the edit form.
          </Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The entity display component is inside entity/entityDisplay.js :</Description>

          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Display {...args} />;

export const ShowData = Template.bind({});
ShowData.args = {
  title: 'Edit',
  close: () => {},
  data: {
    id: 'urn:ngsi-ld:AirQualityObserved:Tenant1',
    type: 'AirQualityObserved',
    awawdawda: {
      type: 'Boolean',
      value: true,
      metadata: {}
    },
    e: {
      type: 'geo:json',
      value: {
        type: 'Point',
        coordinates: [47.374539757, 8.545657396]
      },
      metadata: {}
    },
    eeeee: {
      type: 'Text',
      value: 'aaaaaaaah',
      metadata: {}
    },
    ffff: {
      type: 'StructuredValue',
      value: {
        a: 52
      },
      metadata: {}
    },
    s: {
      type: 'Number',
      value: 23,
      metadata: {}
    },
    temperature: {
      type: 'DateTime',
      value: '2023-03-01T17:25:00.000Z',
      metadata: {}
    },
    dateCreated: {
      type: 'DateTime',
      value: '2023-03-28T09:00:31.832Z',
      metadata: {}
    },
    dateModified: {
      type: 'DateTime',
      value: '2023-03-30T15:50:55.454Z',
      metadata: {}
    }
  },
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
  setView: () => {}
};
