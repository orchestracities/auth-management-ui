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
    mutation modifyUserPreferences($userName: String!, $language: String!, $lastTenantSelected: String) {
      modifyUserPreferences(userName: $userName, language: $language, lastTenantSelected: $lastTenantSelected) {
        userName
        language
        lastTenantSelected
      }
    }
  `,
    variables: { userName: '5c67b251-6f63-46f3-b3b0-085e1f7040b2', language: 'default', lastTenantSelected: 'test' }
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
});
