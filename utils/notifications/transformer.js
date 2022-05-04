const { prop } = require('./rules');

const toUpdateNotificationDate = (toSend = []) => {
  if(toSend.length === 0) return null;
  const oUpdate = {};
  toSend.forEach((send) => {
    const key = prop[send.type];
    if (key) {
      oUpdate[`${key}_date`] = send.date;
    }
  });
  return oUpdate;
}

module.exports = {
  toUpdateNotificationDate,
}