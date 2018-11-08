const express = require('express')
const router =  express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// load validation
const validProfileInput = require('../../validation/profile')
const validExperienceInput = require('../../validation/experience')
const validEducationInput = require('../../validation/education')

//Load Profile model
const Profile = require('../../models/profile')
//Load Profile model
const User = require('../../models/User')


//@route   GET api/profile/test
//@desc    tests profile route
//@access  Public

router.get('/test',(req,res) => res.json({msg: 'profile works'}))

//@route   GET api/profile
//@desc    get current user profile
//@access  Private

router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
    const error ={}
    Profile.findOne({user:req.user.id})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if (!profile){
                error.noprofilefound ='no profile found'
                return res.status(404).json(error)
            }
            res.json(profile)
        }).catch(err => res.status(404).json(err))
})

//@route   GET api/profile/handle:handle
//@desc    Get profle by handle
//@access  Public
router.get('/handle/:handle',(req,res) =>{
    const error={}

    Profile.findOne({handle : req.params.handle})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                error.noprofile='Profile not found'
                return res.status(404).json(error)
            }
            res.json(profile)
        }).catch(err =>{
            res.status(400).json(err)
    })
})

//@route   GET api/profile/user/:user_id
//@desc    Get profle by id
//@access  Public
router.get('/user/:user_id',(req,res) =>{
    const error={}
    Profile.findOne({user : req.params.user_id})
        .populate('user',['name','avatar'])
        .then(profile =>{
            if(!profile){
                error.noprofile='Profile not found'
                return res.status(404).json(error)
            }
            res.json(profile)
        }).catch(err =>{
        res.status(400).json({profile:'There is no profile for this user'})
    })
})

//@route   GET api/profile/all
//@desc    Get profiles
//@access  Public
router.get('/all',(req,res) =>{
    const error={}
    Profile.find()
        .populate('user',['name','avatar'])
        .then(profiles =>{
            if(!profiles){
                error.noprofile='Profile not found'
                return res.status(404).json(error)
            }
            res.json(profiles)
        }).catch(err =>{
        res.status(400).json({profiles:'There are no profiles'})
    })
})


//@route   POST api/profile
//@desc    Create or edit user profile
//@access  Private
router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {error ,isValid} = validProfileInput(req.body)

    //check validation
    if(!isValid){
        return res.status(400).json(error)
    }

    //Get fields
    const profileFields ={}
    profileFields.user = req.user.id
    if(req.body.handle) profileFields.handle = req.body.handle
    if(req.body.company) profileFields.company = req.body.company
    if(req.body.website) profileFields.website = req.body.website
    if(req.body.location) profileFields.location = req.body.location
    if(req.body.bio) profileFields.bio = req.body.bio
    if(req.body.status) profileFields.status = req.body.status
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername

    //Splits the skills
    if(typeof req.body.skills !== 'undefined') profileFields.skills = req.body.skills.split(',')

    //Social
    profileFields.social={}
    if(req.body.youtube) profileFields.social.youtube= req.body.youtube
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram
    if(req.body.linkdin) profileFields.social.linkdin = req.body.linkdin
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook

    Profile.findOne({user: req.user.id}).then(profile => {
        if (profile){
            //Update
            Profile.findOneAndUpdate({user:req.user.id},{$set : profileFields},{new:true})
                .then(profile => res.json(profile))
        }else{
            //create

            //Check if handle exists
            Profile.findOne({handle: profileFields.handle}).then(profile=>{
                if (profile){
                    error.handle = 'Handle already existt'
                    req.status(400).json(error)
                }
                else {
                    //save profile
                    new Profile(profileFields).save().then(profile => res.json(profile))

                }

            })
        }
    })

})

//@route   POST api/profile/experience
//@desc    Add exeperience to the user
//@access  Private

router.post('/experience',passport.authenticate('jwt',{ session:false}),(req,res) =>{
    const {error ,isValid} = validExperienceInput(req.body)

    //check validation
    if(!isValid){
        return res.status(400).json(error)
    }
    Profile.findOne({user : req.user.id})
        .then(profile =>{

            const newExp = {
                title: req.body.title,
                company:req.body.company,
                location:req.body.location,
                from:req.body.from,
                to:req.body.to,
                description:req.body.description
            }

            //Add experience to profile
            profile.experience.unshift(newExp)
            profile.save().then(profile => res.json(profile))
        }).catch()
})

//@route   POST api/profile/education
//@desc    Add education to the user
//@access  Private

router.post('/education',passport.authenticate('jwt',{ session:false}),(req,res) =>{
    const {error ,isValid} = validEducationInput(req.body)

    //check validation
    if(!isValid){
        return res.status(400).json(error)
    }
    Profile.findOne({user : req.user.id})
        .then(profile =>{

            const newEdu = {
                school: req.body.school,
                degree:req.body.degree,
                fieldofstudy:req.body.fieldofstudy,
                from:req.body.from,
                to:req.body.to,
                description:req.body.description
            }

            //Add education to profile
            profile.education.unshift(newEdu)
            profile.save().then(profile => res.json(profile))
        }).catch(err => res.json(err))
})

//@route   DELETE api/profile/experience/:exp_id
//@desc    delete experience
//@access  Private

router.delete('/experience/:exp_id',passport.authenticate('jwt',{ session:false}),(req,res) =>{

    Profile.findOne({user : req.user.id})
        .then(profile =>{
                const removeindex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

            //splice form the array
            profile.experience.splice(removeindex,1)

            //save the profile
            profile.save().then(profile => res.json(profile))
                .catch(err => res.json(err))

        })
})

//@route   DELETE api/profile/education/:edu_id
//@desc    delete experience
//@access  Private

router.delete('/education/:edu_id',passport.authenticate('jwt',{ session:false}),(req,res) =>{

    Profile.findOne({user : req.user.id})
        .then(profile =>{
            const removeindex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

            //splice form the array
            profile.education.splice(removeindex,1)

            //save the profile
            profile.save().then(profile => res.json(profile))
                .catch(err => res.json(err))

        })
})

//@route   DELETE api/profile/
//@desc    delete experience
//@access  Private

router.delete('/',passport.authenticate('jwt',{ session:false}),(req,res) =>{

    Profile.findOneAndRemove({user : req.user.id})
        .then(User.findOneAndRemove({_id: req.user.id}).then(() => res.json('Sucessfully deleted'))

        )
})

module.exports = router