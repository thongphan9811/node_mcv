const express = require('express');
const router = express.Router();

const Auth = require('../midleware/Auth');
const postModel = require('../models/Posts');
const UserModel = require('../models/Users');
const likeModel = require('../models/Likes');

router.get('/post',Auth,async function(req,res,next){
    try{
        const posts = await postModel.find({});
        let arrPost = [];
        for(let i = 0 ; i< posts.length; i++){
            const detail = JSON.parse(JSON.stringify(posts[i]));
            const countLike = await likeModel.find({postID :posts[i]._id});
            detail.countLike = countLike.length;
            arrPost.push(detail);
        }
        return res.render('admin/postlist',{arrPost});

    }catch(err){
        return res.json({
            code :400 ,
            mess : err
        })
    }
})

router.get('/users',Auth,async function(req,res){
    try{
        const userCustomer = await UserModel.find({role : "customer"});
        console.log(userCustomer);
        return res.render('admin/userlist',{userCustomer,url : WEB_URL });
        
    }catch(err){
        return res.json({
            code :400,
            mess : err,
            data :null
        })
    }

})

module.exports = router;
