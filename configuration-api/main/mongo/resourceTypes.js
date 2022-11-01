const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };

const ResourceType = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  userID: String
});

const Resource = connection.model('ResourceType', ResourceType);

async function getResource(data) {
  const resourceTypes = await Resource.find({ userID: data.userID });
    return await resourceTypes;
}

async function deleteResource(data) {
  const resourceTypes = await Resource.find({ name: { $in: data.name } });
  let deletedResourceTypes = {};
  for (const e of resourceTypes) {
    deletedResourceTypes = await Resource.findByIdAndRemove(e._id);
  }
  return !!(await (typeof deletedResourceTypes === 'object'));
}

async function newResource(data) {
  const arrayOfData = {
    name: data.name,
    userID: data.userID
  };
  await Resource.create(arrayOfData);
  return await getResource(data)
}


const ResourceEndpoint = new mongoose.Schema({
  nameAndID: {
    type: String,
    unique: true
  },
  name: String,
  resourceTypeName: String
});

const Endpoints = connection.model('ResourceEndpoint', ResourceEndpoint);

async function getEndpoint(data) {
  const endpoints = await Endpoints.find({ resourceTypeName: data.resourceTypeName });
    return await endpoints;
  
}

async function deleteEndpoint(data) {
  const endpoints = await Endpoints.find({ name: { $in: data.name } });
  let deletedendpoints = {};
  for (const e of endpoints) {
    deletedendpoints = await Endpoints.findByIdAndRemove(e._id);
  }
  return !!(await (typeof deletedendpoints === 'object'));
}

async function newEndPoint(data) {
  const arrayOfData = {
    nameAndID: data.nameAndID,
    name: data.name,
    resourceTypeName: data.resourceTypeName
  };
  await Endpoints.create(arrayOfData);
  return await getEndpoint(data)
}



module.exports = {
  getResource,
  deleteResource,
  newResource,
  getEndpoint,
  deleteEndpoint,
  newEndPoint
};
