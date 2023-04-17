const fs = require('fs');
const path = require('path');
const { uid } = require('uid/secure');

const configDirectory = path.resolve(process.cwd(), 'main/mongo');
async function getTheAlarms(data) {
  return JSON.parse(fs.readFileSync(path.join(configDirectory, 'alarms.json'), 'utf8'));
}
async function deleteThisAlarm(data) {
  let old = JSON.parse(fs.readFileSync(path.join(configDirectory, 'alarms.json'), 'utf8'));
  const index = old.findIndex((x) => x.id === data.id);
  old.splice(index, 1);
  fs.writeFile(path.join(configDirectory, 'alarms.json'), JSON.stringify(old), (error) => {
    if (error) {
      console.error(error);
    }
  });
  return getTheAlarms();
}
async function addAlarm(data) {
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
async function updateThisAlarm(data) {
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
module.exports = {
  getTheAlarms,
  deleteThisAlarm,
  addAlarm,
  updateThisAlarm
};
