const express = require('express')
const router =  express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

//import models
const Profile = require('../../models/profile')
const Post = require('../../models/post')
const validPostInput = require('../../validation/post')

//@route   GET api/post/test
//@desc    tests post route
//@access  Public

router.get('/test',(req,res) => res.json({msg: 'post works'}))

//@route   GET api/post/
//@desc    To get all the post
//@access  Public

router.get('/',(req,res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound:'no posts found by that id'}))

})

//@route   GET api/post//:id
//@desc    To get a the post
//@access  Private

router.get('/:id',(req,res) => {
    Post.findById(req.params.id)

        .then(post => res.json(post))
        .catch(err => res.status(404).json({nopostfound:'no post found by that id'}))

})

//@route   Delete a  api/post/:id
//@desc    To delete a post
//@access  Private

router.delete('/:id',passport.authenticate('jwt',{session:false}),(req,res) =>{
    Profile.findOne({user : req.user.id})
        .then(profile =>{
            Post.findById(req.params.id)
                .then(post =>{
                    if (post.user.toString() !== req.user.id){
                        return res.status(404).json({notauthorized: 'user is not authorized'})
                    }

                    post.remove().then(() => res.json({sucess: true}))
                        .catch(err => res.json(err))
                }).catch(err => res.status(404).json({postnotfound:'no post found'}))
        })
})



//@route   POST api/post/
//@desc    To create a post
//@access  Private

router.post('/',passport.authenticate('jwt',{session: false}), (req,res) =>{

    const {error,isValid} = validPostInput(req.body)
    if (!isValid){
        //Return 404 error with error object
        return res.status(404).json(error)
    }

    const newPost = new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user: req.user.id
    })
    newPost.save().then(post => res.json(post))
})

//@route   POST api/post/like/:id
//@desc    to like a post
//@access  Private

router.post('/like/:id',passport.authenticate('jwt',{session:false}),(req,res) =>{
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post =>{
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length>0){
                        return res.status(400).json({useralreadylike:'user already like the post'})
                    }

                    post.likes.unshift({user:req.user.id})

                    post.save().then(post => res.json(post))
                }).catch(err=> res.json({nopostfound:'no post found'}))
        })

})


//@route   POST api/post/unlike/:id
//@desc    to unlike a post
//@access  Private

router.post('/unlike/:id',passport.authenticate('jwt',{session:false}),(req,res) =>{
    Profile.findOne({user : req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post =>{
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                        return res.status(400).json({notlike:'you have not yet like the post'})
                    }

                    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)

                    //splice out
                    post.likes.splice(removeIndex,1)

                    post.save().then(post => res.json(post))
                }).catch(err=> res.json({nopostfound:'no post found'}))
        })

})

//@route   POST api/post/comment/:id
//@desc    to add a comment to a post
//@access  Private
router.post('/comment/:id',passport.authenticate('jwt',{session:false}),(req,res) =>{
    const {error,isValid} = validPostInput(req.body)
    if (!isValid){
        //Return 404 error with error object
        return res.status(404).json(error)
    }

    Post.findById(req.params.id)
        .then(post =>{
            const newComment = {
                text : req.body.text,
                name: req.body.name,
                avatar:req.body.avatar,
                user:req.user.id
            }

            //Add comment to the array
            post.comments.unshift(newComment)

            //save the comment
            post.save().then(post=> res.json(post))

        }).catch(err => res.status(404).json({nopostfound: 'No post found'}))
})

//@route   Delete api/post/comment/:id/:commentId
//@desc    to delete a comment from a post
//@access  Private
router.delete('/comment/:id/:comment_id',passport.authenticate('jwt',{session:false}),(req,res) =>{

    Post.findById(req.params.id)
        .then(post =>{
            //Check for comment exist or not
            if ( post.comments.filter(comment => comment.id.toString() === req.params.comment_id).length ===0 ){
                return res.status(404).json({commentnotfound:"Comment not found"})
            }

            const removeIndex = post.comments.map(item =>item.id.toString()).indexOf(req.params.comment_id)
            //splice out
            post.comments.splice(removeIndex,1)

            //save the post
            post.save().then((post)=> res.json(post))
        }).catch(err => res.status(404).json({nopostfound: 'No Post Found'}))
})


module.exports = router