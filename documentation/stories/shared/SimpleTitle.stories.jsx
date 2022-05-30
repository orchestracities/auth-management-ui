import React from 'react';

import {SimpleTitle} from "./SimpleTitle"
import {
  Title,
  Subtitle,
  Description,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
  Meta, Story, Canvas, Source
} from '@storybook/addon-docs';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/SimpleTitle',
  component: SimpleTitle,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
  parameters: {
    docs: {
      page: () => (

        <>
          <Title >Main Title:</Title>
          <Subtitle >Description:</Subtitle>
          <Description >
           The mainTitle of the page.
          </Description>
          <Subtitle >API Documentation:</Subtitle>
          <Description >
          The title component is inside shared/mainTitle.js :
          </Description>

          <ArgsTable story={PRIMARY_STORY} />
        </>
      ),
    },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <SimpleTitle {...args} />;

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {

};

