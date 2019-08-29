var express = require('express');
const jwt = require('jsonwebtoken');
const routerUsers = require('../routes/users')
const checktoken = async function(req,res,next){
    try{
        //console.log("hahaha");
        const token = req.header('autoken');
        //console.log(token);
        console.log(routerUsers.token_key);
            if(!token) return res.json({ mess : "ban can dang nhap"});
        const decode = await jwt.verify(token,routerUsers.token_key);
         user = decode;
       //console.log(decode);
       next();
    }catch(err){
        console.log(err);
        return res.json({ code :400 ,mess : err, data : nulll})
    }
};
module.exports = checktoken;