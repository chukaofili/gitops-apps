const moment = require('moment');

const timeAgo = (utcTime, currTime) => {
  const past = moment(utcTime);
  const result = past.from(moment(currTime));
  return result;
};

const formatMessages = (messages) => {
  const currTime = moment.now();
  return messages.map(({ timestamp, ...message }) => ({ ...message, timestamp, timeAgo: timeAgo(timestamp, currTime) }));
};

module.exports = {
  timeAgo,
  formatMessages,
};
