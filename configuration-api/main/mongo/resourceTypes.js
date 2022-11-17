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
  tenantName: String
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
    tenantName: data.tenantName
  };
  await Resource.create(arrayOfData);
  return await getResource(data);
}

const ResourceEndpoint = new mongoose.Schema({
  resourceID: String,
  url: String
});

const Endpoints = connection.model('ResourceEndpoint', ResourceEndpoint);

async function getEndpoint(data) {
  const endpoints = await Endpoints.find({ resourceID: data.resourceID });
  return await endpoints;
}

async function updateEndpoint(data) {
  const filter = { resourceID: data.resourceID };
  const thisEndpoint = await Endpoints.find(filter);
  if (thisEndpoint.length > 0) {
    const update = {
      resourceID: data.resourceID,
      url: data.url
    };
    await Endpoints.findOneAndUpdate(filter, update);
    return await getEndpoint(data);
  }
}

async function deleteEndpoint(data) {
  const endpoints = await Endpoints.find({ resourceID: { $in: data.resourceID } });
  let deletedendpoints = {};
  for (const e of endpoints) {
    deletedendpoints = await Endpoints.findByIdAndRemove(e._id);
  }
  return endpoints;
}

async function newEndPoint(data) {
  const arrayOfData = {
    resourceID: data.resourceID,
    url: data.url
  };
  await Endpoints.create(arrayOfData);
  return await getEndpoint(data);
}

module.exports = {
  getResource,
  deleteResource,
  newResource,
  getEndpoint,
  deleteEndpoint,
  updateEndpoint,
  newEndPoint
};
