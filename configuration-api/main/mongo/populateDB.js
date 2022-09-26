const mongoose = require('mongoose');

//require('dotenv').config({ path: '../.env' });

const connection = mongoose.createConnection(process.env.MONGO_DB || 'mongodb://localhost:27017/graphql');

const TenantConfig = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String
});

const Config = connection.model('TenantConfig', TenantConfig);

const userSettings = new mongoose.Schema({
  userName: String,
  language: String,
  lastTenantSelected: String
});

const Settings = connection.model('userSettings', userSettings);
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
          secondaryColor: '#8086ba'
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
                secondaryColor: '#8086ba'
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