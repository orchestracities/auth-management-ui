const { expect } = require('chai');
const config = require('../main/config');
config.loadConfig();
const url = 'http://localhost:' + config.getConfig().port + '/configuration';
const request = require('supertest');

const loginSettings = {
  username: 'admin@mail.com',
  password: 'admin',
  grant_type: 'password',
  client_id: 'configuration'
};

describe('GraphQL-Mutations', function () {
  this.retries(10);
  let ID;
  const newTenantConfig = {
    query: `
    mutation getTenantConfig(
      $name: String!
      $icon: String!
      $primaryColor: String!
      $secondaryColor: String!
      $file: String
    ) {
      getTenantConfig(
        name: $name
        icon: $icon
        primaryColor: $primaryColor
        secondaryColor: $secondaryColor
        file: $file
      ) {
        name
        icon
        primaryColor
        secondaryColor
      }
    }`,
    variables: { name: 'testTenant', icon: 'none', primaryColor: '#ffff', secondaryColor: '#ffff', file: '' }
  };

  const modifyTenantConfig = {
    query: `
    mutation modifyTenantConfig(
      $name: String!
      $icon: String!
      $primaryColor: String!
      $secondaryColor: String!
      $file: String
    ) {
      modifyTenantConfig(
        name: $name
        icon: $icon
        primaryColor: $primaryColor
        secondaryColor: $secondaryColor
        file: $file
      ) {
        name
        icon
        primaryColor
        secondaryColor
      }
    }`,
    variables: { name: 'testTenant', icon: 'custom', primaryColor: '#ffff', secondaryColor: '#ffff', file: '' }
  };

  const removeTenantConfig = {
    query: `
        mutation removeTenantConfig($tenantName: String!) {
            removeTenantConfig(tenantName: $tenantName) {
              name
              icon
              primaryColor
              secondaryColor
            }
          }`,
    variables: { tenantName: 'testTenant' }
  };

  const modifyUserPreferences = {
    query: `
    mutation modifyUserPreferences($userName: String!, $language: String!, $lastTenantSelected: String, $welcomeText:[WelcomeText]) {
      modifyUserPreferences(userName: $userName, language: $language, lastTenantSelected: $lastTenantSelected, welcomeText:$welcomeText) {
        userName
        language
        lastTenantSelected
        welcomeText {
          language
          text
        }
      }
    }
  `,
    variables: {
      userName: '5c67b251-6f63-46f3-b3b0-085e1f7040b2',
      language: 'default',
      lastTenantSelected: 'test',
      welcomeText: [
        {
          language: 'en',
          text: 'Welcome!'
        },
        {
          language: 'it',
          text: 'Benvenuto!'
        }
      ]
    }
  };

  const newResourceType = {
    query: `
    mutation newResourceType(
      $name: String!
      $userID: String!
      $tenantName: String!
      $endpointUrl: String!
    ) {
      newResourceType(name: $name, userID: $userID, tenantName: $tenantName, endpointUrl: $endpointUrl) {
        name
        userID
        tenantName
        endpointUrl
      }
    }`,
    variables: {
      name: 'new',
      userID: 'admin',
      tenantName: 'TenantTest',
      endpointUrl: 'URL'
    }
  };

  const updateThisResource = {
    query: `
    mutation updateThisResource(
      $name: String!
      $userID: String!
      $tenantName: String!
      $endpointUrl: String!
      $id: String!
    ) {
      updateThisResource(name: $name, userID: $userID, tenantName: $tenantName, endpointUrl: $endpointUrl, id:$id) {
        ID
        name
        userID
        tenantName
        endpointUrl
      }
    }`,
    variables: {
      name: 'aaaaaaaaaaaaaaaabc',
      userID: 'admin@mail.com',
      tenantName: 'TenantTest',
      endpointUrl: 'http://localhost:3000/ResourceTypebc',
      id: ''
    }
  };

  const deleteResourceType = {
    query: `
    mutation deleteResourceType($name: [String]!, $tenantName: String!) {
      deleteResourceType(name: $name, tenantName: $tenantName) {
        name
        userID
        tenantName
        endpointUrl
      }
    }`,
    variables: { name: ['new'], tenantName: 'TenantTest' }
  };

  const createAlarm = {
    query: `
    mutation newAlarm(
      $alarm_type: String!
      $tenant: String!
      $servicepath: String!
      $entity_id: String!
      $entity_type: String!
      $channel_type: String!
      $channel_destination: [String]!
      $time_unit: String!
      $max_time_since_last_update: Int!
      $alarm_frequency_time_unit: String!
      $alarm_frequency_time: Int!
      $time_of_last_alarm: String!
      $status: String!
    ) {
      newAlarm(
        alarm_type: $alarm_type
        tenant: $tenant
        servicepath: $servicepath
        entity_id: $entity_id
        entity_type: $entity_type
        channel_type: $channel_type
        channel_destination: $channel_destination
        time_unit: $time_unit
        max_time_since_last_update: $max_time_since_last_update
        alarm_frequency_time_unit: $alarm_frequency_time_unit
        alarm_frequency_time: $alarm_frequency_time
        time_of_last_alarm: $time_of_last_alarm
        status: $status
      ) {
        id
        alarm_type
        tenant
        servicepath
        entity_id
        entity_type
        channel_type
        channel_destination
        time_unit
        max_time_since_last_update
        alarm_frequency_time_unit
        alarm_frequency_time
        time_of_last_alarm
        status
      }
    }
  `,
    variables: {
      alarm_type: 'entity',
      tenant: 'EKZ',
      servicepath: '/',
      entity_id: 'urn:ngsi-ld:sss',
      entity_type: 'Thing',
      channel_type: 'email',
      channel_destination: ['smartcity@ekz.ch'],
      time_unit: 'h',
      max_time_since_last_update: 6,
      alarm_frequency_time_unit: 'd',
      alarm_frequency_time: 1,
      time_of_last_alarm: '2023-04-05T15:27:37.222Z',
      status: 'active'
    }
  };

  it('create new tenant configuration', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(newTenantConfig)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.getTenantConfig[0]).to.have.own.property('name');
            expect(res.body.data.getTenantConfig[0]).to.have.own.property('icon');
            expect(res.body.data.getTenantConfig[0]).to.have.own.property('primaryColor');
            expect(res.body.data.getTenantConfig[0]).to.have.own.property('secondaryColor');
            done();
          });
      });
  });

  it('modify tenant configuration', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(modifyTenantConfig)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.modifyTenantConfig[0]).to.have.own.property('name');
            expect(res.body.data.modifyTenantConfig[0]).to.have.own.property('icon');
            expect(res.body.data.modifyTenantConfig[0]).to.have.own.property('primaryColor');
            expect(res.body.data.modifyTenantConfig[0]).to.have.own.property('secondaryColor');
            done();
          });
      });
  });

  it('remove tenant configuration', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(removeTenantConfig)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.removeTenantConfig[0]).to.have.own.property('name');
            expect(res.body.data.removeTenantConfig[0]).to.have.own.property('icon');
            expect(res.body.data.removeTenantConfig[0]).to.have.own.property('primaryColor');
            expect(res.body.data.removeTenantConfig[0]).to.have.own.property('secondaryColor');
            done();
          });
      });
  });

  it('Modify user-preferencies', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(modifyUserPreferences)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.modifyUserPreferences[0]).to.have.own.property('userName');
            expect(res.body.data.modifyUserPreferences[0]).to.have.own.property('language');
            expect(res.body.data.modifyUserPreferences[0]).to.have.own.property('lastTenantSelected');
            expect(res.body.data.modifyUserPreferences[0]).to.have.own.property('welcomeText');
            done();
          });
      });
  });
  it('New Resource Type', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(newResourceType)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            ID = res.body.data.newResourceType[0].ID;
            expect(res.body.data.newResourceType[0]).to.have.own.property('name');
            expect(res.body.data.newResourceType[0]).to.have.own.property('userID');
            expect(res.body.data.newResourceType[0]).to.have.own.property('tenantName');
            expect(res.body.data.newResourceType[0]).to.have.own.property('endpointUrl');
            done();
          });
      });
  });

  it('update Resource', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(updateThisResource)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });

  it('delete Resource Type', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(deleteResourceType)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.deleteResourceType[0]).to.have.own.property('name');
            expect(res.body.data.deleteResourceType[0]).to.have.own.property('userID');
            expect(res.body.data.deleteResourceType[0]).to.have.own.property('tenantName');
            expect(res.body.data.deleteResourceType[0]).to.have.own.property('endpointUrl');
            done();
          });
      });
  });
  it('create Alarm', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(createAlarm)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            ID = res.body.data.newAlarm[0].id;
            expect(res.body.data.newAlarm[0]).to.have.own.property('id');
            expect(res.body.data.newAlarm[0]).to.have.own.property('alarm_type');
            expect(res.body.data.newAlarm[0]).to.have.own.property('tenant');
            expect(res.body.data.newAlarm[0]).to.have.own.property('servicepath');
            expect(res.body.data.newAlarm[0]).to.have.own.property('entity_id');
            expect(res.body.data.newAlarm[0]).to.have.own.property('entity_type');
            expect(res.body.data.newAlarm[0]).to.have.own.property('channel_type');
            expect(res.body.data.newAlarm[0]).to.have.own.property('channel_destination');
            expect(res.body.data.newAlarm[0]).to.have.own.property('time_unit');
            expect(res.body.data.newAlarm[0]).to.have.own.property('max_time_since_last_update');
            expect(res.body.data.newAlarm[0]).to.have.own.property('alarm_frequency_time_unit');
            expect(res.body.data.newAlarm[0]).to.have.own.property('alarm_frequency_time');
            expect(res.body.data.newAlarm[0]).to.have.own.property('time_of_last_alarm');
            expect(res.body.data.newAlarm[0]).to.have.own.property('status');

            done();
          });
      });
  });

  it('modify Alarm', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query: `
            mutation modifyAlarm(
              $id: String!
              $alarm_type: String!
              $tenant: String!
              $servicepath: String!
              $entity_id: String!
              $entity_type: String!
              $channel_type: String!
              $channel_destination: [String]!
              $time_unit: String!
              $max_time_since_last_update: Int!
              $alarm_frequency_time_unit: String!
              $alarm_frequency_time: Int!
              $time_of_last_alarm: String!
              $status: String!
            ) {
              modifyAlarm(
                id: $id
                alarm_type: $alarm_type
                tenant: $tenant
                servicepath: $servicepath
                entity_id: $entity_id
                entity_type: $entity_type
                channel_type: $channel_type
                channel_destination: $channel_destination
                time_unit: $time_unit
                max_time_since_last_update: $max_time_since_last_update
                alarm_frequency_time_unit: $alarm_frequency_time_unit
                alarm_frequency_time: $alarm_frequency_time
                time_of_last_alarm: $time_of_last_alarm
                status: $status
              ) {
                id
                alarm_type
                tenant
                servicepath
                entity_id
                entity_type
                channel_type
                channel_destination
                time_unit
                max_time_since_last_update
                alarm_frequency_time_unit
                alarm_frequency_time
                time_of_last_alarm
                status
              }
            }
          `,
            variables: {
              id: ID,
              alarm_type: 'entity',
              tenant: 'EKZ',
              servicepath: '/',
              entity_id: 'urn:ngsi-ld:sss',
              entity_type: 'Thing',
              channel_type: 'email',
              channel_destination: ['smartcity@ekz.ch'],
              time_unit: 'h',
              max_time_since_last_update: 6,
              alarm_frequency_time_unit: 'd',
              alarm_frequency_time: 1,
              time_of_last_alarm: '2023-04-05T15:27:37.222Z',
              status: 'active'
            }
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('id');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('alarm_type');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('tenant');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('servicepath');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('entity_id');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('entity_type');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('channel_type');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('channel_destination');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('time_unit');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('max_time_since_last_update');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('alarm_frequency_time_unit');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('alarm_frequency_time');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('time_of_last_alarm');
            expect(res.body.data.modifyAlarm[0]).to.have.own.property('status');

            done();
          });
      });
  });

  it('delete Alarm', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send({
            query: `
            mutation deleteAlarm($id: String!) {
              deleteAlarm(id: $id) {
                id
                alarm_type
                tenant
                servicepath
                entity_id
                entity_type
                channel_type
                channel_destination
                time_unit
                max_time_since_last_update
                alarm_frequency_time_unit
                alarm_frequency_time
                time_of_last_alarm
                status
              }
            }
          `,
            variables: {
              id: ID
            }
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      });
  });
});
