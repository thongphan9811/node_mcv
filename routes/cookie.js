const express = require('express');
const router = express.Router();

router.get('/',(req,res)=>{
    res.cookie("myName","Phan thong");
    res.end("Wow");
});
// get all cookie
router.get('/all',(req,res)=>{
    console.log(" cookie :", req.cookies.myName);
    res.end("hihihi");
})
module.exports = router;