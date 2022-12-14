import React from 'react';
import { EntitiesFiltering } from './filter';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY, Source } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entities/Filtering',
  component: EntitiesFiltering,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    data: {
      control: false
    },
    services: {
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
          <Title>Entities Filters:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A set of filters to help the user</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The entities filters component is inside entities/entitiesFilters.js :</Description>
          <Description>
            The element should be rendered with the entitiesTable component inside the same page
          </Description>
          <Description>
            To control every filter the component is using an object is composed by a property with the filter ID and
            two properties value for the hook value and set for the hook function
          </Description>
          <Source
            language="jsx"
            dark={true}
            code={`
                        import * as React from 'react'


                        const [servicePath, setServicePath] = React.useState(null);
  const [type, setType] = React.useState(null);
  const [date, setDate] = React.useState(null);
  const filterMapper = {
    servicePath: {
      value: servicePath,
      set: setServicePath
    },
    type: {
      value: type,
      set: setType
    },
    date: {
      value: date,
      set: setDate
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
const Template = (args) => <EntitiesFiltering {...args} />;

export const AllFilters = Template.bind({});
AllFilters.args = {
  data: [
    {
      type: 'AirQualityObserved'
    }
  ],
  mapper: {},
  services: []
};
