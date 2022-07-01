
import React from 'react';
import { PolicyMainForm } from './form';
import {
    Title,
    Subtitle,
    Description,
    ArgsTable,
    PRIMARY_STORY,
} from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Policy/Form/CompleteForm',
    component: PolicyMainForm,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
       
        action: {
            control: false,
        },

        services: {
            control: false
        },
        access_modes: {
            control: false
        },
        agentsTypes: {
            control: false
        },

    },
    parameters: {
        docs: {
            page: () => (

                <>
                    <Title >Policy Form:</Title>
                    <Subtitle >Description:</Subtitle>
                    <Description >
                        The form used for the policies creation
                    </Description>
                    <Description >
                     Inside the form is possibile to map the users, the groups and classes is the value of the user type is specific, if the value is others is possible to select fixed value
                    </Description>
                    <Subtitle >API Documentation:</Subtitle>
                    <Description >
                        The Policy form component is inside policy/policyForm.js :
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
const Template = (args) => <PolicyMainForm {...args} />;

                   

export const PolicyCreation = Template.bind({});
PolicyCreation.args = {
    access_modes: [

        { iri: 'acl:Read', name: 'read' },

        { iri: 'acl:Write', name: 'write' },

        { iri: 'acl:Control', name: 'control' },

        { iri: 'acl:Append', name: 'append' }],
    agentsTypes: [
        { iri: 'acl:agent', name: 'agent' },

        { iri: 'acl:agentGroup', name: 'group' },

        { iri: 'acl:agentClass', name: 'class' }],
    services: [{
        "path": "/path",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8b",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    },
    {
        "path": "/secondpath",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8c",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    },
    {
        "path": "/thirdPath",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8d",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    }],
    getServices: () => { },
    title: "Simple Title",
    action:"create",
    close: () => { }
};


export const ModifyAPolicy = Template.bind({});
ModifyAPolicy.args = {
    access_modes: [

        { iri: 'acl:Read', name: 'read' },

        { iri: 'acl:Write', name: 'write' },

        { iri: 'acl:Control', name: 'control' },

        { iri: 'acl:Append', name: 'append' }],
    agentsTypes: [
        { iri: 'acl:agent', name: 'agent' },

        { iri: 'acl:agentGroup', name: 'group' },

        { iri: 'acl:agentClass', name: 'class' }],
    services: [{
        "path": "/path",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8b",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    },
    {
        "path": "/secondpath",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8c",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    },
    {
        "path": "/thirdPath",
        "id": "f6a91fee-e167-45c3-8b48-458039fa5a8d",
        "tenant_id": "b2e35303-2747-4d1f-9767-519f9310b83e",
        "parent_id": null,
        "scope": null,
        "children": []
    }],
    getServices: () => { },
    title: "Simple Title",
    action:"modify",
    data:{"access_to"
        : 
        "*",
        "agent"
        : 
        ['acl:AuthenticatedAgent'],
        "fiware_service"
        : 
        "Tenant1",
        "fiware_service_path"
        : 
        "/",
        "id"
        : 
        "3a17f496-30b8-4ae1-9129-36bee20eec67",
        "mode"
        : 
        ['acl:Control'],
        "resource_type"
        : 
        "entity"},
    close: () => { }
};