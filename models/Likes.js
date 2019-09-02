const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new Schema ({
    userlike : {type :ObjectId},
    postID : {type :ObjectId}
});
const LikeModel = mongoose.model('like',schema);
module.exports = LikeModel;