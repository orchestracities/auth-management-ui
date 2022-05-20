const mongoose = require("mongoose");

require("dotenv").config({ path: "../.env" });

const connection = mongoose.createConnection(process.env.GRAPHQL_MONGO_DB);

const usrPreference = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
});

const Preferences = connection.model("UsrPreferences", usrPreference);

const usrSettings = new mongoose.Schema({
  usrName: String,
  language: String,
});

const Settings = connection.model("UsrSettings", usrSettings);

async function getUserPref(data) {
  const thisUser = await Settings.find({ usrName: data });
  if (thisUser.length > 0) {
    return await thisUser;
  } else {
    addUserPref(data);
  }
}

async function updateUserPref(data) {
  const filter = { usrName: data.usrName };
  const update = {
    usrName: data.usrName,
    language: data.language,
  };

  const thisTenant = await Settings.findOneAndUpdate(filter, update);
  return await thisTenant;
}

async function addUserPref(data) {
  const arrayOfData = {
    usrName: data,
    language: "defaultBrowser",
  };

  Settings.create(arrayOfData, function (err, small) {
    if (err) {
      return handleError(err);
    } else {
      getUserPref(data);
    }
  });
}

module.exports = {
  getUserPref,
  updateUserPref,
  addUserPref,
};
