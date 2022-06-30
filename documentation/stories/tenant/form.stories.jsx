import React from 'react';
import { TenantMainForm } from './form';
import {
    Title,
    Subtitle,
    Description,
    ArgsTable,
    PRIMARY_STORY,
} from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Tenant/Form/CompleteForm',
    component: TenantMainForm,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
       
        action:{
            control:false,
        },
        tenant:{
            control:false
        },
        token:{
            control:false
        }
       
    },
    parameters: {
        docs: {
            page: () => (

                <>
                    <Title >Tenant Form:</Title>
                    <Subtitle >Description:</Subtitle>
                    <Description >
                       The form used for the tenant modification and creation
                    </Description>
                    <Subtitle >API Documentation:</Subtitle>
                    <Description >
                        The Tenant form component is inside tenant/tenantForm.js :
                    </Description>
                    <Description >
                        The element should be rendered inside the modal
                    </Description>
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <TenantMainForm {...args} />;


export const TenantCreation = Template.bind({});
TenantCreation.args = {
    title: "Title",
    close: () => { },
    action: "create",
    getTenants: () => { },
    tenant: {},
    token: "",
};

export const TenantModification = Template.bind({});
TenantModification.args = {
    title: "Tenant Name",
    close: () => { },
    action: "modify",
    getTenants: () => { },
    tenant: {
        "name": "Tenant1",
        "id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "props": { "name": "Tenant1", "icon": "none", "primaryColor": "#0018ef", "secondaryColor": "#8086ba", "__typename": "TenantConfiguration" },
        "service_paths": [
            {
                "path": "/",
                "id": "f6a91fee-e167-45c3-8b48-458039fa5a8b",
                "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
                "parent_id": null,
                "scope": null,
                "children": []
            }
        ]
    },
    token: "",
};


