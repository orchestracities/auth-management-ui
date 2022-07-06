import React from 'react';

import { Sort } from './Sort';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/Sort',
  component: Sort,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Sort Button:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>The decreasing/increasing Button to order elements.</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Sort component is inside shared/sortButton.js :</Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};
const rerOder = () => {};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Sort {...args} />;

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {
  data: [],
  id: 'name',
  sortData: rerOder
};
