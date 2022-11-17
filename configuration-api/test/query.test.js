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

describe('GraphQL-Query', function () {
  this.retries(10);
  const listTenants = {
    query: `
            query listTenants($tenantNames: [String]!) {
            listTenants(tenantNames: $tenantNames) {
              name
              icon
              primaryColor
              secondaryColor
            }
          }`,
    variables: { tenantNames: ['Tenant1'] }
  };

  const getUserPreferences = {
    query: `
        query getUserPreferences($userName: String!) {
            getUserPreferences(userName: $userName) {
              userName
              language
              lastTenantSelected
            }
          }`,
    variables: { userName: '5c67b251-6f63-46f3-b3b0-085e1f7040b2' }
  };

  const getTenantResourceType = {
    query: `
    query getTenantResourceType($tenantName: String!) {
      getTenantResourceType(tenantName: $tenantName) {
        name
        userID
        tenantName
        resourceID
      }
    }`,
    variables: { tenantName: 'Tenant1' }
  };

  const getEndpoints = {
    query: `
    query getEndpoints($resourceID: String!) {
      getEndpoints(resourceID: $resourceID) {
        url
        resourceID
      }
    }`,
    variables: { resourceID: 'Tenant1/Orion' }
  };

  it('Returns tenant properties', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(listTenants)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.listTenants[0]).to.have.own.property('name');
            expect(res.body.data.listTenants[0]).to.have.own.property('icon');
            expect(res.body.data.listTenants[0]).to.have.own.property('primaryColor');
            expect(res.body.data.listTenants[0]).to.have.own.property('secondaryColor');
            done();
          });
      });
  });

  it('Returns user-preferencies', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(getUserPreferences)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.getUserPreferences[0]).to.have.own.property('userName');
            expect(res.body.data.getUserPreferences[0]).to.have.own.property('language');
            expect(res.body.data.getUserPreferences[0]).to.have.own.property('lastTenantSelected');
            done();
          });
      });
  });

  it('Returns user-resourceTypes', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(getTenantResourceType)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            if (res.body.data.length > 0) {
              expect(res.body.data.getTenantResourceType[0]).to.have.own.property('name');
              expect(res.body.data.getTenantResourceType[0]).to.have.own.property('userID');
            }
            done();
          });
      });
  });
  it('Returns resourceTypes endpoints', (done) => {
    request(config.getConfig().oidc_issuer + '/protocol/openid-connect/token')
      .post('/')
      .set('Content-type', 'application/x-www-form-urlencoded')
      .send(loginSettings)
      .end(function (err, res) {
        const token = res.body.access_token;
        request(url)
          .post('/')
          .set('Authorization', `Bearer ${token}`)
          .send(getEndpoints)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            if (res.body.data.length > 0) {
              expect(res.body.data.getEndpoints[0]).to.have.own.property('name');
              expect(res.body.data.getEndpoints[0]).to.have.own.property('resourceTypeName');
              expect(res.body.data.getEndpoints[0]).to.have.own.property('resourceID');
            }
            done();
          });
      });
  });
});
