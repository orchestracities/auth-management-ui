const mongoose = require('mongoose')

require('dotenv').config({ path: '../.env' })
const connection = mongoose.createConnection(process.env.GRAPHQL_MONGO_DB)

const usrPreference = new mongoose.Schema({
  name: String,
  icon: String,
  primaryColor: String,
  secondaryColor: String
})

const Preferences = connection.model('UsrPreferences', usrPreference)

const usrSettings = new mongoose.Schema({
  usrName: String,
  language: String
})

const Settings = connection.model('UsrSettings', usrSettings)

async function get (data) {
  const thisUser = await Preferences.find({ name: { $in: data } })

  return await thisUser
}

async function update (data) {
  const filter = { name: data.name }
  const update = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor
  }

  const thisTenant = await Preferences.findOneAndUpdate(filter, update)
  return await thisTenant
}

async function add (data) {
  const arrayOfData = {
    name: data.name,
    icon: data.icon,
    primaryColor: data.primaryColor,
    secondaryColor: data.secondaryColor
  }

  const thisTenant = await arrayOfData.save(function (err) {
    if (err) return handleError(err)
  })
  return await thisTenant
}

async function deleteTenant (data) {
  const thisUser = await Preferences.find({ name: { $in: data } })

  for (const e of thisUser) {
    const deletedOwner = await Preferences.findByIdAndRemove(e._id)
  }
  return !!(await (typeof deletedOwner === 'object'))
}

module.exports = {
  get,
  update,
  add,
  deleteTenant
}
