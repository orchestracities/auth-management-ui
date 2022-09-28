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
    const newUser = await addUserPref(data);
    return await newUser;
  }
}

async function updateUserPref(data) {
  const filter = { userName: data.userName };
  const thisUser = await Settings.find(filter);
  if (thisUser.length > 0) {
    const update = {
      userName: data.userName,
      language: data.language,
      lastTenantSelected: data.lastTenantSelected
    };
    const thisTenant = await Settings.findOneAndUpdate(filter, update);
    return await thisTenant;
  } else {
    await addUserPref(data.userName);
    updateUserPref(data);
  }
}

async function addUserPref(data) {
  const arrayOfData = {
    userName: data,
    language: 'defaultBrowser',
    lastTenantSelected: null
  };

  const thisUser = await Settings.create(arrayOfData);
  return await thisUser;
}

module.exports = {
  getUserPref,
  updateUserPref,
  addUserPref
};
