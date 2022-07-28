const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };

const userPreferences = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String
});

const Preferences = connection.model('UsrPreferences', userPreferences);

async function get(data) {
  const thisUser = await Preferences.find({ name: { $in: data } });
  if (thisUser.length === data.length) {
    return await thisUser;
  } else {
    fromScratch(data);
  }
}

async function update(data) {
  const filter = { name: data.name };
  const update = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor
  };

  const thisTenant = await Preferences.findOneAndUpdate(filter, update);
  return await thisTenant;
}

async function add(data) {
  const arrayOfData = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor
  };

  const thisTenant = await arrayOfData.save(function (err) {
    if (err) return config.getLogger().error(logContext, err);
  });
  return await thisTenant;
}

async function fromScratch(data) {
  for (let thisTenant of data) {
    const thisUser = await Preferences.find({ name: thisTenant });
    if (thisUser.length === 0) {
      const arrayOfData = {
        name: thisTenant,
        icon: 'none',
        primaryColor: '#8086ba',
        secondaryColor: '#8086ba'
      };
      await arrayOfData.save(function (err) {
        if (err) return config.getLogger().error(logContext, err);
      });
    }
  }
  get(data);
}

async function deleteTenant(data) {
  const thisUser = await Preferences.find({ name: { $in: data } });
  let deletedOwner = {};
  for (const e of thisUser) {
    deletedOwner = await Preferences.findByIdAndRemove(e._id);
  }
  return !!(await (typeof deletedOwner === 'object'));
}

module.exports = {
  get,
  update,
  add,
  deleteTenant
};
