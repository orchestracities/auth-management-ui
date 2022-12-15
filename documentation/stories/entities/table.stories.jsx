import React from 'react';
import { EntitiesTypeTable } from './table';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entities/Display/Table',
  component: EntitiesTypeTable,
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
          <Description>The Entities Table component is inside entities/entitiesTypeTable.js :</Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <EntitiesTypeTable {...args} />;

export const ResourceDisplay = Template.bind({});
ResourceDisplay.args = {
  data: [
    {
      type: 'AirQualityObserved',
      id: 'ID',
      dateModified: new Date()
    }
  ]
};
