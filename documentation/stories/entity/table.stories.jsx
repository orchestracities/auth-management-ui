import React from 'react';
import { EntityTypeTable } from './table';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entity/Display/Table',
  component: EntityTypeTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    data: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Entities Table:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>This table will display the data stored inside the entities</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Entities Table component is inside entity/entityTable.js :</Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <EntityTypeTable {...args} />;

export const ResourceDisplay = Template.bind({});
ResourceDisplay.args = {
  data: [
    {
      type: 'AirQualityObserved',
      id: 'urn:ngsi-ld:AirQualityObserved:myAirQuality',
      dateModified: {
        value: '2022-12-17T18:10:58+00:00'
      }
    }
  ]
};
