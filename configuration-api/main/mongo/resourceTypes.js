const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };

const ResourceType = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  userID: String,
  tenantID: String
});

const Resource = connection.model('ResourceType', ResourceType);

async function getResource(data) {
  // Resource.deleteMany({}, function (err) {console.log(err)})
  if (data.tenantID !== '') {
    const resourceTypes = await Resource.find({ tenantID: data.tenantID });
    const fiwareType = await Resource.find({ tenantID: 'fiwareType' });
    return [...(await resourceTypes), ...(await fiwareType)];
  } else {
    const resourceTypes = await Resource.find({});
    return await resourceTypes;
  }
}

async function deleteResource(data) {
  const resourceTypes = await Resource.find({ name: { $in: data.name } });
  let deletedResourceTypes = {};
  for (const e of resourceTypes) {
    deletedResourceTypes = await Resource.findByIdAndRemove(e._id);
  }
  return resourceTypes;
}

async function newResource(data) {
  const arrayOfData = {
    name: data.name,
    userID: data.userID,
    tenantID: data.tenantID
  };
  await Resource.create(arrayOfData);
  return await getResource(data);
}

const ResourceEndpoint = new mongoose.Schema({
  nameAndID: String,
  name: String,
  resourceTypeName: String
});

const Endpoints = connection.model('ResourceEndpoint', ResourceEndpoint);

async function getEndpoint(data) {
  const endpoints = await Endpoints.find({ resourceTypeName: data.resourceTypeName });
  return await endpoints;
}

async function updateEndpoint(data) {
  const filter = { nameAndID: data.nameAndID };
  const thisEndpoint = await Endpoints.find(filter);
  if (thisEndpoint.length > 0) {
    const update = {
      nameAndID: data.nameAndID,
      name: data.name,
      resourceTypeName: data.resourceTypeName
    };
    await Endpoints.findOneAndUpdate(filter, update);
    return await getEndpoint(data);
  }
}

async function deleteEndpoint(data) {
  const endpoints = await Endpoints.find({ name: { $in: data.name } });
  let deletedendpoints = {};
  for (const e of endpoints) {
    deletedendpoints = await Endpoints.findByIdAndRemove(e._id);
  }
  return endpoints;
}

async function newEndPoint(data) {
  const arrayOfData = {
    nameAndID: data.nameAndID,
    name: data.name,
    resourceTypeName: data.resourceTypeName
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
