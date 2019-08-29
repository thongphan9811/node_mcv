const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema({ 
  title: String,
  image: { type: Array },
  createdBy: { type: ObjectId }
});

const PostModel = mongoose.model('Post', schema);

module.exports = PostModel;