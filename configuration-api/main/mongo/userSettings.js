const mongoose = require('mongoose');

const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };
const userSettings = new mongoose.Schema({
  userName: {
    type: String,
    unique: true
  },
  language: String,
  lastTenantSelected: String,
  welcomeText: [
    {
      language: String,
      text: String
    }
  ]
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
      lastTenantSelected: data.lastTenantSelected,
      welcomeText:data.welcomeText
    };
    const thisTenant = await Settings.findOneAndUpdate(filter, update);
    return await thisTenant;
  } else {
    const results = await addUserPref(data.userName);
    return await results;
  }
}

async function addUserPref(data) {
  const arrayOfData = {
    userName: data,
    language: 'en',
    lastTenantSelected: null,
    welcomeText: [{
      language: 'en',
      text: "Welcome!"
    },
    {
      language: 'it',
      text: "Benvenuto!"
    }]
  };
  await Settings.create(arrayOfData);
  return await getUserPref(data);
}

module.exports = {
  getUserPref,
  updateUserPref,
  addUserPref
};
