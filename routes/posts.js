const express = require('express');
const router = express.Router();
const PostModel = require('../models/Posts');
const checktoken = require('../midleware/checkToken');
var formidable = require('formidable');
const likeModel = require('../models/Likes');
const path  = require("path");
const fs = require('fs');
// post image//
router.post('/status',checktoken,async function(req,res,next){
    try{
        const form = new formidable.IncomingForm();
        form.uploadDir ='./media';
        const body ={};
        let image = [];
        let title ='';
        form.multiples =true
        form.parse(req)
        form.on("fileBegin", function(err, file){
           console.log(file.path);
           file.path = file.path + ".jpg";
            
        })
           .on('file', function(name, file) {
              image.push(file.path); 
              console.log(image);
           })
           .on('field', function(name, field) {
           body[name] = field;
           title = body[name];
           console.log(title);
           })
          .on('error', function(err) {
            throw err;
          })
          .on('end', function() {
           // console.log(body.title);
            const PostClass = new PostModel({
                title : title,
                image : image,
                createdBy : user._id,
            })
            PostClass.save(function(err,post){
                if(post){
                    res.json({
                        code : 200,
                        mess : "thanh cong",
                        data : {post}
                    });
                }else{
                    console.log(err);
                    return res.json({
                        code : 400,
                        mess : err
                    }
                    );
                }
            });
       });
    }catch(err){
        console.log(err);
        return res.json({code :400, mess :err , data : null});
    }
});
router.get('/',async (req,res,next)=>{
    try{
        const posts = await PostModel.find();
        console.log(posts[0].title);
        return res.render('posts',{posts,title:"PAGE POST"})
        //return res.render('posts',{posts,title:"PAGE POST"});
    }catch(error){
        console.log(error);
        return res.json({
            code : 400,
            mess : error ,
            data : null
        })
    }
});
router.post('/like/:_postID',checktoken,async (req,res,next)=>{
    try{
        const postID = req.params._postID;
        const checkLike = await likeModel.findOne({userlike :user._id,postID:postID});
            if(checkLike) return res.json({mess :" ban da like bai post nay"});
        const checkPost = await PostModel.findById(postID);
    
            if(!checkPost) throw "khong tim thay bai post";
        const likeClass = new likeModel({
        userlike : user._id,
        postID : postID
    });
        const like = await likeClass.save();
    }catch(err){
        return res.json({code:400 , mess: err, data : null});
    }
});
router.post('/unlike/:_postID',checktoken,async (req,res)=>{
    try{
        const postID =req.params._postID;
        const checkpost = await PostModel.findById(postID);
        if(!checkpost) return res.json({
            code :404 , mess :"khong tim thay bai post", data: null
        });
        const checkLike = await likeModel.findOne({userlike :user._id,postID:postID});
        if(!checkLike) res.json({ mess :"ban chua like bai post"});
        const unlike = await likeModel.deleteOne({userlike :user._id,postID:postID});
        return res.json({ code :200 ,mess :"unlike thanh cong", data :postID});
    }catch(err){
        return mes.json({code :400, mess : err, data: null});
    }
});
router.put('/status/:_postID',checktoken,async (req,res,next)=>{
    try{
        const postID = req.params._postID ;
        
        if(!postID) return res.json({
            mess: "ban can truyen postID de sua bai viet"
        });

        const findPost = await PostModel.findById(postID);
        //console.log(findPost,"+++++");
        const deleteIMG = findPost.image;
        console.log(deleteIMG,"-----------");
        if(!findPost) return res.json({mess :"khong tim thay bai viet", code :404});
        const UserPostID = await PostModel.findOne({_id:postID,createdBy:user._id});
        if(!UserPostID) return res.json({mess : "ban khong co quyen sua bai viet"});
        if(deleteIMG[0]!=null){
            deleteIMG.forEach((post) => {
                     fs.unlinkSynck("./"+post);
                    //next(); 
            });
        }
        const form = new formidable.IncomingForm();
        form.uploadDir = './media';
        let title = '';
        let image =[];
        const body ={};
        form.parse(req)
        form.on("fileBegin",function(err,file){
            file.path = file.path + ".jpg";
            console.log(file.path);
        })
        .on("file",function(name,file){
            image.push(file.path);
            console.log(file.path);
            console.log(image,"------");
        })
        .on("field",function(name,field){
            body[name] = field;
            title = body[name];
        })
        .on('error', function(err) {
            throw err;
        })
        .on("end", function(){
            PostModel.updateOne({_id:postID},{title :title,image:image},(err,data)=>{
                if(err) return res.json({code:400 ,mess :err })
                return res.json({mess : "ban da update status thanh cong ", code :200 ,data :"yess"});
            });
        })

    }catch(err){
        console.log(err);
        return res.json({code :400 , mess : err , data :null})
    }
});
module.exports = router;