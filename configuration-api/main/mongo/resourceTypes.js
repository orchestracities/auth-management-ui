const mongoose = require('mongoose');
const config = require('../config');
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const logContext = { op: 'configuration-api.advancedAuth' };
const { GraphQLError } = require('graphql');
const { uid } = require('uid/secure');

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
  const resourceTypes = await Resource.find({ tenantName: data.tenantName })
    .sort({ update_at: -1 })
    .skip(typeof data.skip !== 'undefined' ? Number(data.skip) : 0)
    .limit(typeof data.limit !== 'undefined' ? Number(data.limit) : 0);

  const count = await Resource.countDocuments({ tenantName: data.tenantName });

  return { data: resourceTypes, count: count };
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
    return await Resource.find({ tenantName: data.tenantName });
  } else {
    throw new GraphQLError(data.name + 'already exist on this Tenant');
  }
}

async function updateResource(data) {
  const filter = {
    ID: data.id
  };
  const thisEndpoint = await Resource.find(filter);
  if (thisEndpoint.length > 0) {
    const update = {
      ID: uid(16),
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
