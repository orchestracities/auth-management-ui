import React from 'react';
import { SelectTenant } from './tenantSelection'

import {
    Title,
    Subtitle,
    Description,
    ArgsTable,
    PRIMARY_STORY,
   Source
} from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Shared/SelectTenant',
    component: SelectTenant,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        correntValue: {
            control: false,
        },
    },
    parameters: {
        docs: {
            page: () => (

                <>
                    <Title >Tenant Selection:</Title>
                    <Subtitle >Description:</Subtitle>
                    <Description >
                        A Select to change the value of the corrent Tenant selected by the user.
                    </Description>
                    <Subtitle >API Documentation:</Subtitle>
                    <Description >
                        The Tenant selection component is inside shared/tenantSelection.js :
                    </Description>
                    <Description >
                      A possible example of a TenantValue:
                    </Description>
                           <Source code={JSON.stringify([ {id:"name",props:{icon:"copy"},name:"name"}
          ]

          )} language='javascript' dark={true} />
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <SelectTenant {...args} />;

export const Main = Template.bind({});
Main.args = {
    correntValue:"",
    seTenant:undefined,
    tenantValues:[  {id:"name",props:{icon:"copy"},name:"name"}]
  
};
