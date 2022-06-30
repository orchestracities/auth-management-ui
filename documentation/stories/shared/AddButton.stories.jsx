import React from 'react';

import { AddButton } from './AddButton'
import {
  Title,
  Subtitle,
  Description,
  ArgsTable,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/AddButton',
  component: AddButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
  parameters: {
    docs: {
      page: () => (

        <>
          <Title >Add New Element Button:</Title>
          <Subtitle >Description:</Subtitle>
          <Description >
            The new element button should be used to open a modal with a form to add new elements to the page.
          </Description>
          <Description >
            Is possibile to render inside the modal every component withouth any limitation but a form is reccomended.
          </Description>
          <Description >
            The button will get the secondary color of the theme decided for the Tenant.
          </Description>
          <Subtitle >API Documentation:</Subtitle>
          <Description >
            The air quality component is inside shared/addButton.js :
          </Description>

          <ArgsTable story={PRIMARY_STORY} />
        </>
      ),
    },
  },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <AddButton {...args} />;

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {

};

