const express = require('express')
const router =  express.Router()

const gravtar = require('gravatar')
const bcrypt = require('bcryptjs')

//load user model
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport')

//Load input validation
const  validRegisterInput = require('../../validation/register')
const  validLoginInput = require('../../validation/login')

//@route   GET api/users/test
//@desc    tests users route
//@access  Public
router.get('/test',(req,res) => res.json({msg: 'user works'}))

//@route   POST api/users/register
//@desc    tests users route
//@access  Public
router.post('/register',(req,res) => {

    const {error, isValid} = validRegisterInput(req.body);
    //check validation
    if(!isValid){
        res.status(400).json(error)
    }


    User.findOne({email: req.body.email})
        .then(user => {
            if (user){
                error.email ='email already exists'
                return res.status(400).json(error)
            }else{
                const avatar = gravtar.url(req.body.email,{
                    s: '200', //Size
                    r: 'pg',
                    d:'mm'
                })
                const newuser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })
                /*bcrypt.genSalt(10, (err,salt) =>{
                    bcrypt.hash(newuser.password,salt,(err,hash) => {
                         // if(err)throw err
                        newuser.password=hash
                        newuser.save()
                            .then(user =>res.json(user))
                            .catch(err => console.log(err))
                    })
                })*/
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newuser.password, salt, (err, hash) => {
                        // if (err) throw err;
                        newuser.password = hash;
                        newuser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
    })
})

//@route  POST api/users/login
//@desc    login and authenticate the user
//@access  Public
router.post('/login', (req,res) => {
    const {error, isValid} = validLoginInput(req.body);
    //check validation
    if(!isValid){
        res.status(400).json(error)
    }
    const email = req.body.email
    const password  = req.body.password

    //Find user by email
    User.findOne({email})
        .then(user => {
            if(!user){
                error.email="user not found"
                return res.status(404).json(error)
            }else{
                //check password
                bcrypt.compare(password,user.password)
                    .then(isMatch => {
                        if(!isMatch){
                            error.password = "Password incorrect"
                            return res.status(404).json(error)
                        }else {
                            /*res.json({msg: 'Sucessfull'})*/
                            // create payload
                            const payload = {id : user.id ,name:user.name,avatar:user.avatar}
                            const key = keys.secretOrKey
                            //jwt sign
                            jwt.sign(payload,key,{expiresIn:3600} , (err,token) =>{
                                res.json({sucess:true,
                                          token: 'Bearer ' + token})

                            })
                        }

                    })
            }
        })


})

//@route   GET api/users/current
//@desc    return current user
//@access  Private
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res) =>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email:req.user.email
    })
})



module.exports = router