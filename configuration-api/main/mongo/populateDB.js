const mongoose = require('mongoose');

//require('dotenv').config({ path: '../.env' });

const connection = mongoose.createConnection(process.env.MONGO_DB || 'mongodb://localhost:27017/graphql');
const fiwareURL = process.env.REACT_APP_ORION || 'http://localhost:1026/v2/entities';

const TenantConfig = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
  customImage: mongoose.Schema.Types.Mixed
});

const ResourceType = new mongoose.Schema({
  resourceID: {
    type: String,
    unique: true
  },
  userID: String,
  name: String,
  tenantName: String
});

const ResourceEndpoint = new mongoose.Schema({
  resourceID: String,
  url: String
});

const Config = connection.model('TenantConfig', TenantConfig);

const userSettings = new mongoose.Schema({
  userName: String,
  language: String,
  lastTenantSelected: String
});
const Endpoints = connection.model('ResourceEndpoint', ResourceEndpoint);
const Resource = connection.model('ResourceType', ResourceType);

const Settings = connection.model('userSettings', userSettings);
Resource.deleteMany({}, function (err) {
  Resource.create(
    {
      resourceID: 'Tenant1/Orion',
      userID: '',
      name: 'Orion',
      tenantName: 'Tenant1'
    },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        Resource.create(
          {
            resourceID: 'Tenant2/Orion',
            userID: '',
            name: 'Orion',
            tenantName: 'Tenant2'
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

  Endpoints.deleteMany({}, function (err) {
    Endpoints.create(
      {
        resourceID: 'Tenant1/Orion',
        url: fiwareURL
      },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          Endpoints.create(
            {
              resourceID: 'Tenant2/Orion',
              url: fiwareURL
            },
            function (err) {
              if (err) {
                console.log(err);
              } else {
                console.log('Resource Types Created');
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
});
