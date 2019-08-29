const express = require('express');
const router = express.Router();
//const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const token_key = 'asdasdhs';
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
//app.use(bodyParser.json());
const UserModel = require('../models/Users');
/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const users = await UserModel.find();
    return res.render('users', { users, title: 'USERS PAGE' });
  } catch (err) {
    return res.json({
      code: 400,
      mess: err
    })
  }
});
/* POST  customer register then login*/
router.post('/', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const find = await UserModel.find({ username: username });
    if (find) return res.json({
      mess: "ten dang nhap da duoc dang ki"
    });
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    const UserClass = new UserModel({ username, password: hash });
    const user = await UserClass.save();
    return res.json({
      code: 200, mess: '', data: { user }
    });
  } catch (err) {
    console.log(err);
    return res.json({
      code: 400, mess: err, data: null
    })
  }
});

/* POST users create. */
router.post('/login', async function (req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username: username });
    if (!user) return res.json({
      mess: "ban chua dang ki hoac sai ten dang nhap"
    });
    const hash = bcrypt.compareSync(password, user.password);
    if (!hash) {
      return res.json({ mess: " ban nhap sai mat khau" });
    }
    user.password = undefined;
    const JsonUser = JSON.parse(JSON.stringify(user));
    const token = jwt.sign(JsonUser, token_key);
    return res.header('auto-token', token).json({
      code: 200,
      mess: "dang nhap thanh cong",
      data: { JsonUser }
    });
  } catch (err) {
    res.json({
      code: 400,
      mess: err,
      data: null
    })
  }
});

module.exports = { router, token_key };
