import React from 'react';
import {ShowPoliciesChildren} from './policiesChildren'
import TenantForm from "../../../src/components/tenant/tenantForm";
import ServiceForm from "../../../src/components/service/serviceForm";

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
    title: 'Shared/Card/Buttons',
    component: ShowPoliciesChildren,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        // foo is the property we want to remove from the UI
     
       
    },
    parameters: {
        docs: {
            page: () => (

                <>
                    <Title >Policies related to the Tenant:</Title>
                    <Subtitle >Description:</Subtitle>
                    <Description >
                        A Button avaitable only on the Tenant page, that is going to reiderect the user to the Policies page, the tenant will be change depending on the card that the user has clicked
                    </Description>
                    <Subtitle >API Documentation:</Subtitle>
                    <Description >
                        The button component is inside shared/policiesChildren.js :
                    </Description>
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },
};
const emptyFunction = () => {

}
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ShowPoliciesChildren {...args} />;


export const TenantPolicies = Template.bind({});
TenantPolicies.args = {
    tenantId:"b2e35303-2747-4d1f-9767-519f9310b83e",
    tenantName: "Tenant1",
    seTenant:emptyFunction
};

