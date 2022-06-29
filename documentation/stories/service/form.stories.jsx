import React from 'react';
import { ServiceMainForm } from './form';
import {
    Title,
    Subtitle,
    Description,
    ArgsTable,
    PRIMARY_STORY,
} from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Service/Form/CompleteForm',
    component: ServiceMainForm,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
       
        action:{
            control:false,
        },
        tenantName_id:{
            control:false
        },
        service:{
            control:false
        }
       
    },
    parameters: {
        docs: {
            page: () => (

                <>
                    <Title >Service Form:</Title>
                    <Subtitle >Description:</Subtitle>
                    <Description >
                       The form used for the service and subservice creation
                    </Description>
                    <Subtitle >API Documentation:</Subtitle>
                    <Description >
                        The Service form component is inside service/serviceForm.js :
                    </Description>
                    <Description >
                        The element should be rendered inside a modal
                    </Description>
                    <ArgsTable story={PRIMARY_STORY} />
                </>
            ),
        },
    },
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <ServiceMainForm {...args} />;


export const ServiceCreation = Template.bind({});
ServiceCreation.args = {
    title: "Title",
    close: () => { },
    action: "create",
    getServices: () => { },
    service:{},
    tenantName_id: [{
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
    }]
};

export const SubServiceCreation = Template.bind({});
SubServiceCreation.args = {
    title: "Service Name",
    close: () => { },
    action: "Sub-service-creation",
    getServices: () => { },
    service:{
        "path": "serviceName",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8b",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    },
    tenantName_id: [{
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
    }]
};


