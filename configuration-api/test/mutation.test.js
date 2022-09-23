const { expect } = require('chai');
const config = require('../main/config');
config.loadConfig();
const url = 'http://localhost:' + config.getConfig().port + '/configuration';
const request = require('supertest');

const loginSettings = {
  username: config.getConfig().credential,
  password: config.getConfig().credential,
  grant_type: 'password',
  client_id: config.getConfig().oidc_client
};

describe('GraphQL-Mutations', () => {
  const newTenantConfig = {
    query: `
        mutation getTenantConfig(
            $name: String!
            $icon: String!
            $primaryColor: String!
            $secondaryColor: String!
          ) {
            getTenantConfig(
              name: $name
              icon: $icon
              primaryColor: $primaryColor
              secondaryColor: $secondaryColor
            ) {
              name
              icon
              primaryColor
              secondaryColor
            }
          }`,
    variables: { name: 'testTenant', icon: '', primaryColor: '#ffff', secondaryColor: '#ffff' }
  };

  const modifyTenantConfig = {
    query: `
        mutation modifyTenantConfig(
            $name: String!
            $icon: String!
            $primaryColor: String!
            $secondaryColor: String!
          ) {
            modifyTenantConfig(
              name: $name
              icon: $icon
              primaryColor: $primaryColor
              secondaryColor: $secondaryColor
            ) {
              name
              icon
              primaryColor
              secondaryColor
            }
          }`,
    variables: { name: 'testTenant', icon: 'custom', primaryColor: '#ffff', secondaryColor: '#ffff' }
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
        mutation modifyUserPreferences($userName: String!, $language: String!) {
            modifyUserPreferences(userName: $userName, language: $language) {
              userName
              language
            }
          }`,
    variables: { userName: '5c67b251-6f63-46f3-b3b0-085e1f7040b2', language: 'default' }
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
          .send(modifyUserPreferences)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.data.modifyUserPreferences[0]).to.have.own.property('userName');
            expect(res.body.data.modifyUserPreferences[0]).to.have.own.property('language');
            done();
          });
      });
  });
});
