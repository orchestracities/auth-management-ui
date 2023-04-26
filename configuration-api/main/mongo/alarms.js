const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../config');
require('dotenv').config({ path: '../../.env' });
const connection = mongoose.createConnection(config.getConfig().mongo_db);
const { uid } = require('uid/secure');

const configDirectory = path.resolve(process.cwd(), 'main/mongo');

//MONGO

const Alarms = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  alarm_type: String,
  tenant: String,
  servicepath: String,
  entity_id: String,
  entity_type: String,
  channel_type: String,
  channel_destination: [String],
  time_unit: String,
  max_time_since_last_update: Number,
  alarm_frequency_time_unit: String,
  alarm_frequency_time: Number,
  time_of_last_alarm: String,
  status: String
});
const Alarm = connection.model('Alarms', Alarms);

async function getTheAlarmsmongo(data) {
  const AlarmsData =
    data.servicePath === ''
      ? await Alarm.find({ tenant: data.tenantName })
      : await Alarm.find({
          $and: [{ tenant: data.tenantName }, { servicepath: data.servicePath }]
        });
  return AlarmsData;
}
async function deleteThisAlarmmongo(data) {
  const AlarmsData = await Alarm.find({ id: data.id });
  let deletedAlarms = {};
  for (const e of AlarmsData) {
    deletedAlarms = await Alarm.findByIdAndRemove(e._id);
  }
  return AlarmsData;
}
async function addAlarmmongo(data) {
  const arrayOfData = {
    id: uid(16),
    alarm_type: data.alarm_type,
    tenant: data.tenant,
    servicepath: data.servicepath,
    entity_id: data.entity_id,
    entity_type: data.entity_type,
    channel_type: data.channel_type,
    channel_destination: data.channel_destination,
    time_unit: data.time_unit,
    max_time_since_last_update: data.max_time_since_last_update,
    alarm_frequency_time_unit: data.alarm_frequency_time_unit,
    alarm_frequency_time: data.alarm_frequency_time,
    time_of_last_alarm: data.time_of_last_alarm,
    status: data.status
  };
  await Alarm.create(arrayOfData);
  return [arrayOfData];
}
async function updateThisAlarmmongo(data) {
  const session = await connection.startSession();
  const filter = {
    id: data.id
  };
  const AlarmsData = await Alarm.find(filter,null,{ session: session, new: true });
  const update = {
    id: AlarmsData[0].id,
    alarm_type: data.alarm_type,
    tenant: data.tenant,
    servicepath: data.servicepath,
    entity_id: data.entity_id,
    entity_type: data.entity_type,
    channel_type: data.channel_type,
    channel_destination: data.channel_destination,
    time_unit: data.time_unit,
    max_time_since_last_update: data.max_time_since_last_update,
    alarm_frequency_time_unit: data.alarm_frequency_time_unit,
    alarm_frequency_time: data.alarm_frequency_time,
    time_of_last_alarm: data.time_of_last_alarm,
    status: data.status
  };

  await Alarm.findOneAndUpdate(filter, update, { session: session, new: true });
  return [update];
}

//json
async function getTheAlarmsjson(data) {
  return JSON.parse(fs.readFileSync(path.join(configDirectory, 'alarms.json'), 'utf8'));
}
async function deleteThisAlarmjson(data) {
  let old = JSON.parse(fs.readFileSync(path.join(configDirectory, 'alarms.json'), 'utf8'));
  const index = old.findIndex((x) => x.id === data.id);
  old.splice(index, 1);
  fs.writeFile(path.join(configDirectory, 'alarms.json'), JSON.stringify(old), (error) => {
    if (error) {
      console.error(error);
    }
  });
  return [old[index]];
}
async function addAlarmjson(data) {
  let old = JSON.parse(fs.readFileSync(path.join(configDirectory, 'alarms.json'), 'utf8'));
  data.id = uid(16);
  old.push(data);
  fs.writeFile(path.join(configDirectory, 'alarms.json'), JSON.stringify(old), (error) => {
    if (error) {
      console.error(error);
    }
  });
  return [data];
}
async function updateThisAlarmjson(data) {
  let old = JSON.parse(fs.readFileSync(path.join(configDirectory, 'alarms.json'), 'utf8'));
  const index = old.findIndex((x) => x.id === data.id);
  old[index] = data;
  fs.writeFile(path.join(configDirectory, 'alarms.json'), JSON.stringify(old), (error) => {
    if (error) {
      console.error(error);
    }
  });
  return [data];
}

async function getTheAlarms(data) {
  return eval('getTheAlarms' + process.env.ALARMS_SAVE.toLowerCase() + '(data)');
}
async function deleteThisAlarm(data) {
  return eval('deleteThisAlarm' + process.env.ALARMS_SAVE.toLowerCase() + '(data)');
}
async function addAlarm(data) {
  return eval('addAlarm' + process.env.ALARMS_SAVE.toLowerCase() + '(data)');
}
async function updateThisAlarm(data) {
  return eval('updateThisAlarm' + process.env.ALARMS_SAVE.toLowerCase() + '(data)');
}

module.exports = {
  getTheAlarms,
  deleteThisAlarm,
  addAlarm,
  updateThisAlarm
};
