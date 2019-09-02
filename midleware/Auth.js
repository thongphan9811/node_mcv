
const jwt = require('jsonwebtoken');
const routerUsers = require('../routes/users');
const cookie = require('cookie');

const Auth =async function(req,res,next){
    try{
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies['session-token'];
        console.log(token);
        if(!token) return res.render('users/login',{url : WEB_URL});

        const decode = await jwt.verify(token,routerUsers.token_key);

        user = decode;
        if(user.role != "admin") throw "ban khong co quyen vao trang nay";
        next();

    }catch(err){
        return res.json({
            code : 400,
            mess : err,
            data :null
        })
    }
};
module.exports = Auth;