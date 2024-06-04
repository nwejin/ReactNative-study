const TestSchema = require('../models/TestSchema');

exports.testWrite = async (req, res) => {
  try {
    console.log(req.body.content);
    await TestSchema.create({
      content: req.body.content,
    });
  } catch (err) {
    console.log(err);
  }
};
