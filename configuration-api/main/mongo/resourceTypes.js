const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };

const ResourceType = new mongoose.Schema({
  resourceID: {
    type: String,
    unique: true
  },
  userID: String,
  name: String,
  tenantName: String,
  endpointUrl: String
});

const Resource = connection.model('ResourceType', ResourceType);

async function getResource(data) {
  const resourceTypes = await Resource.find({ tenantName: data.tenantName });
  return await resourceTypes;
}

async function deleteResource(data) {
  const resourceTypes = await Resource.find({ resourceID: { $in: data.resourceID } });
  let deletedResourceTypes = {};
  for (const e of resourceTypes) {
    deletedResourceTypes = await Resource.findByIdAndRemove(e._id);
  }
  return resourceTypes;
}

async function newResource(data) {
  const arrayOfData = {
    resourceID: data.resourceID,
    name: data.name,
    userID: data.userID,
    tenantName: data.tenantName,
    endpointUrl: data.endpointUrl
  };
  await Resource.create(arrayOfData);
  return await getResource(data);
}

async function updateEndpoint(data) {
  const filter = { resourceID: data.resourceID };
  const thisEndpoint = await Resource.find(filter);
  if (thisEndpoint.length > 0) {
    const update = {
      resourceID: data.resourceID,
      name: data.name,
      userID: data.userID,
      tenantName: data.tenantName,
      endpointUrl: data.endpointUrl
    };
    await Resource.findOneAndUpdate(filter, update);
    return await getResource(data);
  }
}

module.exports = {
  getResource,
  deleteResource,
  newResource,
  updateEndpoint
};
