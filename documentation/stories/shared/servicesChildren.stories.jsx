import React from 'react';
import { ShowServicesChildren } from './servicesChildren'
import TenantForm from "../../../src/components/tenant/tenantForm";
import ServiceForm from "../../../src/components/service/serviceForm";
import ServiceChildren from '../../../src/components/service/serviceChildren'

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
    component: ShowServicesChildren,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
       
        data: {
            control: false,
        },

    },
    parameters: {
        docs: {
            page: () => (

                <>
                    <Title >Services related to the Tenant or to a Path:</Title>
                    <Subtitle >Description:</Subtitle>
                    <Description >
                        A Button avaitable inside a card to show in a modal the services linked to a Tenant or a Path.
                    </Description>
                    <Subtitle >API Documentation:</Subtitle>
                    <Description >
                        The button component is inside shared/serviceChildren.js :
                    </Description>
                    <Description >
                        To let know the component if the service is linked to a Tenant or a Path, you should check the type of form passed to the Card component.
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
const Template = (args) => <ShowServicesChildren {...args} />;


export const Services = Template.bind({});
Services.args = {
    data: {
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
            },
            {
                children: [],
                id: "3d1a91f3-8d65-4940-b9d6-cebe9fcbc5aa",
                parent_id: "f6a91fee-e167-45c3-8b48-458039fa5a8b",
                path: "/subservice",
                scope: "subservice",
                tenant_id: "b2e35303-2747-4d1f-9767-519f9310b83e"
            }
        ]
    },
    status: false,
    setOpen: emptyFunction,
    getData: emptyFunction
};

