const mongoose = require('mongoose');

//require('dotenv').config({ path: '../.env' });

const connection = mongoose.createConnection(process.env.MONGO_DB || 'mongodb://localhost:27017/graphql');
const fiwareURL = process.env.FIWARE_SERVICE || 'http://localhost:1026/v2/entities';

const TenantConfig = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
  customImage: mongoose.Schema.Types.Mixed
});

const ResourceType = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  userID: String,
  tenantID: String
});

const ResourceEndpoint = new mongoose.Schema({
  nameAndID: String,
  name: String,
  resourceTypeName: String
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
      name: 'entity',
      userID: '',
      tenantID: 'fiwareType'
    },
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );
  Endpoints.deleteMany({}, function (err) {
    Endpoints.create(
      {
        nameAndID: 'fiware',
        name: fiwareURL,
        resourceTypeName: 'entity'
      },
      function (err) {
        if (err) {
          console.log(err);
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
