const mongoose = require('mongoose');
const { uid } = require('uid/secure');

//require('dotenv').config({ path: '../.env' });

const connection = mongoose.createConnection(process.env.MONGO_DB || 'mongodb://localhost:27017/graphql');
const orionURL = process.env.REACT_APP_ORION || 'http://localhost:1026';

const TenantConfig = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
  customImage: mongoose.Schema.Types.Mixed
});

const ResourceType = new mongoose.Schema({
  ID: {
    type: String,
    unique: true
  },
  userID: String,
  name: String,
  tenantName: String,
  endpointUrl: String
});

const Config = connection.model('TenantConfig', TenantConfig);

const userSettings = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  language: String,
  lastTenantSelected: String
});
const Resource = connection.model('ResourceType', ResourceType);

const Settings = connection.model('userSettings', userSettings);
Resource.deleteMany({}, function (err) {
  Resource.create(
    {
      ID: uid(16),
      userID: '',
      name: 'entity',
      tenantName: 'Tenant1',
      endpointUrl: orionURL + '/v2/entities?attrs=id&orderBy=id'
    },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        Resource.create(
          {
            ID: uid(16),
            userID: '',
            name: 'entity',
            tenantName: 'Tenant2',
            endpointUrl: orionURL + '/v2/entities?attrs=id&orderBy=id'
          },
          function (err) {
            if (err) {
              console.log(err);
            } else {
              Resource.create(
                {
                  ID: uid(16),
                  userID: '',
                  name: 'entityType',
                  tenantName: 'Tenant1',
                  endpointUrl: orionURL + '/v2/types'
                },
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    Resource.create(
                      {
                        ID: uid(16),
                        userID: '',
                        name: 'entityType',
                        tenantName: 'Tenant2',
                        endpointUrl: orionURL + '/v2/types'
                      },
                      function (err) {
                        if (err) {
                          console.log(err);
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
    }
  );
  Settings.deleteMany({}, function (err) {
    Config.deleteMany({}, function (err) {
      console.log('PopulateDB: clear old data...');
      if (err) {
        console.log(err);
      } else {
        Config.create(
          {
            name: 'Tenant1',
            icon: 'none',
            primaryColor: '#8086ba',
            secondaryColor: '#8086ba',
            customImage: ''
          },
          function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('Tenant1 created!');
              Config.create(
                {
                  name: 'Tenant2',
                  icon: 'none',
                  primaryColor: '#8086ba',
                  secondaryColor: '#8086ba',
                  customImage: ''
                },
                function (err) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log('Tenant2 created!');
                    process.exit();
                  }
                }
              );
            }
          }
        );
      }
    });
  });
});
