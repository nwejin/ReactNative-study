const mongoose = require('mongoose');
const { Schema } = mongoose;

const TestSchema = new Schema({
  content: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('test', TestSchema);
