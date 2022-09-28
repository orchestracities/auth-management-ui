const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };

const TenantConfig = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String,
  customImage: mongoose.Schema.Types.Mixed
});

const Config = connection.model('TenantConfig', TenantConfig);

async function get(data) {
  const tenants = await Config.find({ name: { $in: data } });
  if (tenants.length === data.length) {
    return await tenants;
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
    secondaryColor: data.secondaryColor,
    customImage: data.file
  };

  const thisTenant = await Config.findOneAndUpdate(filter, update);
  return await thisTenant;
}

async function add(data) {
  const arrayOfData = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor,
    customImage: data.file
  };
  const thisTenant = await Config.create(arrayOfData);
  return await thisTenant;
}

async function fromScratch(data) {
  for (let thisTenant of data) {
    const tenants = await Config.find({ name: thisTenant });
    if (tenants.length === 0) {
      const arrayOfData = {
        name: thisTenant,
        icon: 'none',
        primaryColor: '#8086ba',
        secondaryColor: '#8086ba',
        customImage: ''
      };
      Config.create(arrayOfData);
    }
  }
  get(data);
}

async function deleteTenant(data) {
  const tenants = await Config.find({ name: { $in: data } });
  let deletedTenants = {};
  for (const e of tenants) {
    deletedTenants = await Config.findByIdAndRemove(e._id);
  }
  return !!(await (typeof deletedTenants === 'object'));
}

module.exports = {
  get,
  update,
  add,
  deleteTenant
};
