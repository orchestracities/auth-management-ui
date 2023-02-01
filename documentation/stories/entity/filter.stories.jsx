import React from 'react';
import { EntityFiltering } from './filter';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY, Source } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entity/Filtering',
  component: EntityFiltering,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    types: {
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
          <Description>The entity filters component is inside entity/entityFilters.js :</Description>
          <Description>The element should be rendered with the entityTable component inside the same page</Description>
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
const Template = (args) => <EntityFiltering {...args} />;

export const AllFilters = Template.bind({});
AllFilters.args = {
  mapper: {},
  services: [{ path: '/' }, { path: '/another' }],
  types: [{ type: 'a type' }]
};
