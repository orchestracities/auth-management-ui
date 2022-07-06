import React from 'react';
import { Notification } from './notifications';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY, Source } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/Notifications',
  component: Notification,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Notification:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A simple notification system based on colors</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The notification component is inside shared/messages/alert.js :</Description>
          <Description>The element should be related to a modified hook</Description>
          <Subtitle>How does it work?</Subtitle>
          <Description>first of all you need to import the component and bind it to a hook</Description>
          <Source
            language="jsx"
            dark={true}
            code={`
                        import useNotification from '../shared/messages/alerts'
                        const [msg, sendNotification] = useNotification();
                        `}
          />
          <Description>Then it would be possibile to use it</Description>
          <Source
            language="jsx"
            dark={true}
            code={`
                        import useNotification from '../shared/messages/alerts'
                        const [msg, sendNotification] = useNotification();

                        sendNotification({msg:"message", variant: 'success'})
                        `}
          />
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Notification {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'A message',
  variant: 'default'
};
export const Success = Template.bind({});
Success.args = {
  text: 'success',
  variant: 'success'
};

export const Error = Template.bind({});
Error.args = {
  text: 'error',
  variant: 'error'
};

export const Warning = Template.bind({});
Warning.args = {
  text: 'warning',
  variant: 'warning'
};

export const Info = Template.bind({});
Info.args = {
  text: 'info',
  variant: 'info'
};
