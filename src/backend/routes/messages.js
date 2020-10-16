const mongoose = require('mongoose');

const { GUESTBOOK_DB_ADDR } = process.env;
const mongoURI = `mongodb://${GUESTBOOK_DB_ADDR}/guestbook`;

const db = mongoose.connection;
db.on('disconnected', () => {
  console.error(`Disconnected: unable to reconnect to ${mongoURI}`);
});
db.on('error', (err) => {
  console.error(`Unable to connect to ${mongoURI}: ${err}`);
});
db.once('open', () => {
  console.log(`Connected to ${mongoURI}`);
});

const connectToMongoDB = async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    connectTimeoutMS: 2000,
    useUnifiedTopology: true,
  });
};

const messageSchema = mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  body: { type: String, required: [true, 'Message Body is required'] },
  timestamps: {},
});

const MessageModel = mongoose.model('Message', messageSchema);

const construct = (params) => {
  const { name } = params;
  const { body } = params;
  const message = new MessageModel({ name, body });
  return message;
};

const save = (message) => {
  console.log('saving message...');
  message.save((err) => {
    if (err) { throw err; }
  });
};

// Constructs and saves message
const create = (params) => {
  const msg = construct(params);
  const validationError = msg.validateSync();
  if (validationError) { throw validationError; }
  save(msg);
};

module.exports = {
  create,
  MessageModel,
  connectToMongoDB,
};
