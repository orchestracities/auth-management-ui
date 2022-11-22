const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };
const { ApolloError } = require('apollo-server-errors');
const { uid }=require('uid');

const ResourceType = new mongoose.Schema({
  ID: {
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
  const resourceTypes = await Resource.find({
    $and: [{ tenantName: data.tenantName }, { name: { $in: data.name } }]
  });
  let deletedResourceTypes = {};
  for (const e of resourceTypes) {
    deletedResourceTypes = await Resource.findByIdAndRemove(e._id);
  }
  return resourceTypes;
}

async function newResource(data) {
  const previusResourceTypes = await Resource.find({
    $and: [{ tenantName: data.tenantName }, { name: { $in: data.name } }]
  });
  if (previusResourceTypes.length === 0) {
    const arrayOfData = {
      ID: uid(16),
      name: data.name,
      userID: data.userID,
      tenantName: data.tenantName,
      endpointUrl: data.endpointUrl
    };
    await Resource.create(arrayOfData);
    return await getResource(data);
  } else {
    throw new ApolloError(data.name + 'already exist on this Tenant');
  }
}

async function updateResource(data) {
  const filter={
    ID: data.id
  }
  const thisEndpoint = await Resource.find(filter);
  if (thisEndpoint.length > 0) {
    const update = {
      ID:uid(16),
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
  updateResource
};
