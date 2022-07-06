import React from 'react';

import { UsrMenu } from './Usermenu';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/UserMenu',
  component: UsrMenu,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    userData: {
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
          <Title>User Menu:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>The user icon used to set the language and other settings.</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The UserMenu component is inside shared/useMenu.js :</Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <UsrMenu {...args} />;

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {
  language: { language: 'defaultBrowser', setLanguage: () => {} },
  userData: {},
  token: ''
};
