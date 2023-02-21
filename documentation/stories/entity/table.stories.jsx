import React from 'react';
import { EntityTypeTable } from './table';
import { Title, Subtitle, Description, ArgsTable, PRIMARY_STORY } from '@storybook/addon-docs';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Entity/Display/Table',
  component: EntityTypeTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    data: {
      control: false
    },
    env: {
      control: false
    },
    token: {
      control: false
    },
    language: {
      control: false
    },
    getTheEntities: {
      control: false
    },
    entityEndpoint: {
      control: false
    },
    types: {
      control: false
    },
    GeTenantData: {
      control: false
    },
    services: {
      control: false
    },
    page: {
      control: false
    },
    setPage: {
      control: false
    },
    rowsPerPage: {
      control: false
    },
    setRowsPerPage: {
      control: false
    },
    entitiesLenght: {
      control: false
    }
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Entities Table:</Title>
          <Subtitle>Description:</Subtitle>
          <Description>This table will display the data stored inside the entities</Description>
          <Subtitle>API Documentation:</Subtitle>
          <Description>The Entities Table component is inside entity/entityTable.js :</Description>
          <Description>
            Because the Table is rendered with pagination in mind the usage of hooks is a must :
          </Description>
          <ArgsTable story={PRIMARY_STORY} />
        </>
      )
    }
  }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template = (args) => <EntityTypeTable {...args} />;

export const ResourceDisplay = Template.bind({});
ResourceDisplay.args = {
  data: [
    {
      type: 'AirQualityObserved',
      id: 'urn:ngsi-ld:AirQualityObserved:myAirQuality',
      dateModified: {
        value: '2022-12-17T18:10:58+00:00'
      }
    },
    {
      type: 'AirQualityObserved',
      id: 'urn:ngsi-ld:AirQualityObserved:myAirQuality2',
      dateModified: {
        value: '2022-12-17T18:10:58+00:00'
      }
    }
  ],
  env: undefined,
  token: '',
  language: 'en',
  getTheEntities: () => {},
  entityEndpoint: '',
  types: [],
  GeTenantData: () => {},
  services: [],
  page: 0,
  setPage: () => {},
  rowsPerPage: 10,
  setRowsPerPage: () => {},
  entitiesLenght: 2
};
