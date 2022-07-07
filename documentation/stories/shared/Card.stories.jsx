import React from 'react';
import { Card } from './Card';
import TenantForm from '../../../src/components/tenant/tenantForm';
import ServiceForm from '../../../src/components/service/serviceForm';

import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Shared/Card/FullCardExamples',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    pageType: {
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
          <Title>Simple Card:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>A simple card to Display elements, edit them or delete them.</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Card component is inside shared/cards.js :</Description>
          <Description>
            The element that will be rendered inside the modal, can only be a ServiceForm with "Sub-service-creation" as
            a action or a TenantForm with "Modify" as a action
          </Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};
const emptyFunction = () => {};
// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <Card {...args} />;

export const TenantExample = Template.bind({});
TenantExample.args = {
  pageType: (
    <TenantForm
      keycloakToken={''}
      title={'Title'}
      action={'modify'}
      tenant={{
        name: 'Tenant1',
        id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
        props: {
          name: 'Tenant1',
          icon: 'none',
          primaryColor: '#0018ef',
          secondaryColor: '#8086ba',
          __typename: 'TenantConfiguration'
        },
        service_paths: [
          {
            path: '/',
            id: 'f6a91fee-e167-45c3-8b48-458039fa5a8b',
            tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
            parent_id: null,
            scope: null,
            children: []
          }
        ]
      }}
      getTenants={emptyFunction}
    ></TenantForm>
  ),
  data: {
    name: 'Tenant1',
    id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
    props: {
      name: 'Tenant1',
      icon: 'none',
      primaryColor: '#0018ef',
      secondaryColor: '#8086ba',
      __typename: 'TenantConfiguration'
    },
    service_paths: [
      {
        path: '/',
        id: 'f6a91fee-e167-45c3-8b48-458039fa5a8b',
        tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
        parent_id: null,
        scope: null,
        children: []
      }
    ]
  },
  getData: emptyFunction,
  seTenant: emptyFunction
};

export const ServiceExample = Template.bind({});
ServiceExample.args = {
  pageType: (
    <ServiceForm
      title={'doc'}
      action={'Sub-service-creation'}
      service={{
        children: [],
        id: '3d1a91f3-8d65-4940-b9d6-cebe9fcbc5aa',
        parent_id: 'f6a91fee-e167-45c3-8b48-458039fa5a8b',
        path: '/subservice',
        scope: 'subservice',
        tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e'
      }}
      getServices={emptyFunction}
      tenantName_id={[
        {
          name: 'Tenant1',
          id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
          props: {
            name: 'Tenant1',
            icon: 'none',
            primaryColor: '#0018ef',
            secondaryColor: '#8086ba',
            __typename: 'TenantConfiguration'
          },
          service_paths: [
            {
              path: '/',
              id: 'f6a91fee-e167-45c3-8b48-458039fa5a8b',
              tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e',
              parent_id: null,
              scope: null,
              children: []
            }
          ]
        }
      ]}
    />
  ),
  data: {
    children: [],
    id: '3d1a91f3-8d65-4940-b9d6-cebe9fcbc5aa',
    parent_id: 'f6a91fee-e167-45c3-8b48-458039fa5a8b',
    path: '/subservice',
    scope: 'subservice',
    tenant_id: 'b2e35303-2747-4d1f-9767-519f9310b83e'
  },
  colors: { secondaryColor: '#0018ef', primaryColor: '#0018ef' },
  getData: emptyFunction,
  seTenant: undefined
};
