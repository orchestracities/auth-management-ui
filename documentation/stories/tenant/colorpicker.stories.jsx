import React from 'react';

import {Colors} from './colorpicker'
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
  title: 'Tenant/Form/ColorPicker',
  component: Colors,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // foo is the property we want to remove from the UI
    setColor: {
        control: false,
    },
    mode: {
        control: false,
    },
    defaultValue:{
        control:false
    }
},
  parameters: {
    docs: {
      page: () => (

        <>
          <Title >Color Selection:</Title>
          <Subtitle >Description:</Subtitle>
          <Description >
       The component used by the user to set colors
          </Description>
          <Subtitle >API Documentation:</Subtitle>
          <Description >
          The Color Picker component is inside tenant/colorPicker.js :
          </Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      ),
    },
  },
};
const rerOder = () => {

};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Colors {...args} />;

export const Main = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Main.args = {
    defaultValue:'#8086ba',
    setColor:()=>{},
    mode:"",
    text:"color:"
};

