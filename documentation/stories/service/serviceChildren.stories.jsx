import React from 'react';
import { ChildrenOfTheService } from './serviceChildren';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Service/DataDisplay',
  component: ChildrenOfTheService,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    status: {
      control: false
    },
    data: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Service Children:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>
            A modal with a table that allows the user to read and delete the children of a service path
          </Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Service children component is inside service/serviceChildren.js :</Description>
          <Description>The element should be rendered inside a modal</Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ChildrenOfTheService {...args} />;

export const Main = Template.bind({});
Main.args = {
  masterTitle: 'Name of the Service',
  setOpen: () => {},
  status: true,
  getData: () => {},
  data: [
    {
      path: '/path',
      id: 'f6a91fee-e167-45c3-8b48-458039fa5a8b',
      tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
      parent_id: null,
      scope: null,
      children: []
    },
    {
      path: '/secondpath',
      id: 'f6a91fee-e167-45c3-8b48-458039fa5a8c',
      tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
      parent_id: null,
      scope: null,
      children: []
    },
    {
      path: '/thirdPath',
      id: 'f6a91fee-e167-45c3-8b48-458039fa5a8d',
      tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
      parent_id: null,
      scope: null,
      children: []
    }
  ]
};
