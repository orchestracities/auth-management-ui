const express = require('express');
const app = express();
const port = 4200;
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const connection = mongoose.createConnection(typeof process.env.MONGO_DB=== 'undefined' ? 'mongodb://root:example@localhost:27017/admin' :process.env.MONGO_DB);
const axios = require('axios');
const nodemailer = require('nodemailer');

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

let queue = [];

const timeCalculator = (type, value) => {
  switch (true) {
    case type === 'd':
      return value * 86400000;
    case type === 'h':
      return value * 3600000;
    case type === 'm':
      return value * 60000;
    case type === 's':
      return value * 1000;
    case type === 'ms':
      return value * 1;
    default:
      return false;
  }
};

const queueInit = (alarmsData) => {
  for (let alarm of alarmsData) {
    queue.push({
      id: alarm.id,
      timeout: setTimeout(async () => {
        entityReschedule(alarm);
      }, timeCalculator(alarm.alarm_frequency_time_unit, alarm.alarm_frequency_time))
    });
  }
};

const newElement = (data) => {
  queue.push({
    id: data.id,
    timeout: setTimeout(async () => {
      entityReschedule(data);
    }, timeCalculator(data.alarm_frequency_time_unit, data.alarm_frequency_time))
  });
};

const modifyElement = async (data) => {
  const thisElement = await Alarm.find({ id: data.id });
  const index = queue.findIndex((x) => x.id === data.id);
  if (JSON.stringify(thisElement[0]) !== JSON.stringify(data)) {
    clearTimeout(queue[index].timeout);
    queue[index].timeout = setTimeout(async () => {
      entityReschedule(data);
    }, timeCalculator(data.alarm_frequency_time_unit, data.alarm_frequency_time) + process.env.NOTIFICATION_DELAY);
  }
};

const deleteElement = async (data) => {
  const index = queue.findIndex((x) => x.id === data.id);
  clearTimeout(queue[index].timeout);
};

const entityReschedule = async (updateData) => {
  const resourceTypes = await Resource.find({ name: 'entity' });
  const url =
    resourceTypes.length > 0
      ? resourceTypes[0].endpointUrl.slice(0, resourceTypes[0].endpointUrl.indexOf('?')) +
        '?attrs=dateCreated,dateModified'
      : process.env.REACT_APP_ORION + '/v2/entities?attrs=dateCreated,dateModified';
  const queryParameters = '&id=' + updateData.entity_id;
  const headers = {
    'fiware-Service': updateData.tenant,
    'fiware-ServicePath': updateData.servicepath
  };
  axios
    .get(url + queryParameters, {
      headers: headers
    })
    .then(async (response) => {
      const index = queue.findIndex((x) => x.id === updateData.id);
      const now = new Date();
      const lastUpdate = new Date(response.data[0].dateModified.value);
      lastUpdate.setMilliseconds(timeCalculator(updateData.time_unit, updateData.max_time_since_last_update));
      if (lastUpdate.getTime() > now.getTime()) {
        queue[index].timeout = setTimeout(async () => {
          entityReschedule(updateData);
        }, timeCalculator(updateData.alarm_frequency_time_unit, updateData.alarm_frequency_time) + process.env.NOTIFICATION_DELAY);
      } else {
        await sender(updateData);
        const update = {
          id: updateData.id,
          alarm_type: updateData.alarm_type,
          tenant: updateData.tenant,
          servicepath: updateData.servicepath,
          entity_id: updateData.entity_id,
          entity_type: updateData.entity_type,
          channel_type: updateData.channel_type,
          channel_destination: updateData.channel_destination,
          time_unit: updateData.time_unit,
          max_time_since_last_update: updateData.max_time_since_last_update,
          alarm_frequency_time_unit: updateData.alarm_frequency_time_unit,
          alarm_frequency_time: updateData.alarm_frequency_time,
          time_of_last_alarm: new Date().toString(),
          status: updateData.status
        };
        const filter = {
          id: updateData.id
        };

        queue[index].timeout = setTimeout(async () => {
          entityReschedule(update);
        }, timeCalculator(update.alarm_frequency_time_unit, update.alarm_frequency_time) + process.env.NOTIFICATION_DELAY);
        await Alarm.findOneAndUpdate(filter, update);
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

const sender = async (data) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = process.env.DEV_VERSION.toLowerCase() === 'true' ? await nodemailer.createTestAccount() : '';

  let transporter = nodemailer.createTransport({
    host: process.env.DEV_VERSION.toLowerCase() === 'true' ? 'smtp.ethereal.email' : process.env.MAIL_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.DEV_VERSION.toLowerCase() === 'true' ? testAccount.user : process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.DEV_VERSION.toLowerCase() === 'true' ? testAccount.pass : process.env.MAIL_PASS // generated ethereal password
    }
  });

  // send mail with defined transport object

  try {
    let info = await transporter.sendMail({
      from: process.env.MAIL_FROM, // sender address
      to: data.channel_destination.toString(), // list of receivers
      subject: process.env.MAIL_SUBJECT + ' ' + data.id, // Subject line
      text: process.env.MAIL_MESSAGE + ' ' + data.entity_id // plain text body
    });
    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.log(err);
  }
};

app.listen(port, async () => {
  const alarmsData = await Alarm.find({ status: 'active' });

  queueInit(alarmsData);
});

module.exports = {
  newElement,
  modifyElement,
  deleteElement
};
