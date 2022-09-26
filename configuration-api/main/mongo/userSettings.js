const mongoose = require('mongoose');

const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };
const userSettings = new mongoose.Schema({
  userName: String,
  language: String,
  lastTenantSelected: String
});

const Settings = connection.model('userSettings', userSettings);

async function getUserPref(data) {
  const thisUser = await Settings.find({ userName: data });
  if (thisUser.length > 0) {
    return await thisUser;
  } else {
    addUserPref(data);
  }
}

async function updateUserPref(data) {
  const filter = { userName: data.userName };
  const update = {
    userName: data.userName,
    language: data.language,
    lastTenantSelected: data.lastTenantSelected
  };

  const thisTenant = await Settings.findOneAndUpdate(filter, update);
  return await thisTenant;
}

async function addUserPref(data) {
  const arrayOfData = {
    userName: data,
    language: 'defaultBrowser',
    lastTenantSelected: null
  };

  Settings.create(arrayOfData, function (err) {
    if (err) {
      return config.getLogger().error(logContext, err);
    } else {
      getUserPref(data);
    }
  });
}

module.exports = {
  getUserPref,
  updateUserPref,
  addUserPref
};
