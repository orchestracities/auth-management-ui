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
        mutation removeTenantConfig($tenantNames: [String]!) {
            removeTenantConfig(tenantNames: $tenantNames) {
              name
              icon
              primaryColor
              secondaryColor
            }
          }`,
    variables: { tenantNames: ['testTenant'] }
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
    mutation newResourceType($name: String!, $userID: String!, $tenantName: String!, $resourceID: String!) {
      newResourceType(name: $name, userID: $userID, tenantName: $tenantName, resourceID: $resourceID) {
        name
        userID
        tenantName
        resourceID
      }
    }`,
    variables: {
      name: 'new',
      userID: 'admin',
      tenantName: 'Tenant1',
      resourceID: 'Tenant1' + '/' + 'new'
    }
  };

  const deleteResourceType = {
    query: `
    mutation deleteResourceType($resourceID: [String]!) {
      deleteResourceType(resourceID: $resourceID) {
        name
        userID
        tenantName
        resourceID
      }
    }`,
    variables: { resourceID: ['Tenant1' + '/' + 'new'] }
  };

  const addEndpoint = {
    query: `
    mutation addEndpoint($resourceID: String!, $url: String!) {
      addEndpoint(resourceID: $resourceID, url: $url) {
        url
        resourceID
      }
    }`,
    variables: { resourceID: 'Tenant1' + '/' + 'new', url: 'http...' }
  };

  const updateEndpoint = {
    query: `
    mutation updateThisEndpoint($resourceID: String!, $url: String!) {
      updateThisEndpoint(resourceID: $resourceID, url: $url) {
        url
        resourceID
      }
    }`,
    variables: { resourceID: 'Tenant1' + '/' + 'new', url: 'httpnew.' }
  };

  const deleteThisEndpoint = {
    query: `
    mutation deleteThisEndpoint($resourceID: [String]!) {
      deleteThisEndpoint(resourceID: $resourceID) {
        url
        resourceID
      }
    }`,
    variables: { resourceID: 'Tenant1' + '/' + 'new' }
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
            expect(res.body.data.removeTenantConfig).to.be.a('null');
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
            expect(res.body.data.newResourceType[0]).to.have.own.property('name');
            expect(res.body.data.newResourceType[0]).to.have.own.property('userID');
            expect(res.body.data.newResourceType[0]).to.have.own.property('tenantName');
            expect(res.body.data.newResourceType[0]).to.have.own.property('resourceID');

            done();
          });
      });
  });

  it('New Endpoint', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(addEndpoint)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.addEndpoint[0]).to.have.own.property('resourceID');
            expect(res.body.data.addEndpoint[0]).to.have.own.property('url');
            done();
          });
      });
  });

  it('update Endpoint', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(updateEndpoint)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.updateThisEndpoint[0]).to.have.own.property('resourceID');
            expect(res.body.data.updateThisEndpoint[0]).to.have.own.property('url');
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
            expect(res.body.data.deleteResourceType[0]).to.have.own.property('resourceID');
            done();
          });
      });
  });

  it('Delete Endpoint', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(deleteThisEndpoint)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.deleteThisEndpoint[0]).to.have.own.property('resourceID');
            expect(res.body.data.deleteThisEndpoint[0]).to.have.own.property('url');
            done();
          });
      });
  });
});
