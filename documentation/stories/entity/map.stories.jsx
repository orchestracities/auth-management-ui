import React from 'react';
import { Map } from './map';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY, Source } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entity/Form/MapEdit',
  component: Map,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    attribute: {
      control: false
    },
    attributesMap: {
      control: false
    },
    setAttributesMap: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Map Edit:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A component that is returning the geoJSON to the form</Description>
          <Description>
            You can both search using Google API's (that needs a key defined inside the env file) or clicking the map,
            is possibile to edit on the JSON tab the geoJSON object manually too. To confirm the selection you must
            click on the save button, it is possible to restore the previus value too
          </Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The entity Map edit component is inside entity/map/mapEditor.js :</Description>
          <Description>
            The GeoJSON is configured for grafana so the passed the feature but not the entire geoJSON object
          </Description>
          <Source
            language="JSON"
            dark={true}
            code={`
            { type: "Point", coordinates: [47.374249132697486, 8.544042706489565] }

  `}
          />

          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Map {...args} />;

export const MapEdit = Template.bind({});
MapEdit.args = {
  env: {},
  attribute: { name: '', type: '', value: '' },
  attributesMap: [],
  setAttributesMap: () => {},
  index: 0
};
