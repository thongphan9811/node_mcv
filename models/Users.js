const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {USER} = require('../constant');
const schema = new Schema({ 
    username: String,
    password: String,
    role :{type :String , default:USER.ROLE.CUSTOMER}
  })

const UserModel = mongoose.model('User', schema);
module.exports = UserModel;