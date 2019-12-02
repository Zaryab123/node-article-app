const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/user')

router.get('/register',(req,res) => {
    res.render('register',{
        title: 'Register'
    })
})

router.post('/register',(req,res) => {

    if(req.body.Password === req.body.confirmPassword){
        const user = new User({
            name: req.body.Name,
            email: req.body.Email,
            username: req.body.userName,
            password: req.body.Password
        })

        //Generating salt for password
        bcrypt.genSalt(10,(err,salt) => {

            //hasing the password
            bcrypt.hash(user.password, salt)
            .then(result => {
                user.password = result
                user.save()
                .then(result => {
                    req.flash('success','Registered Successfully, now you can login')
                    res.redirect('/users/login')
                })
            })
            .catch(err => {
                console.log(err)
            })
        })

    }else{
        req.flash('notify','Password does not match')
    }
})

router.get('/login',(req,res) => {
    res.render('login')
})

router.post('/login',(req,res,next) => {
    passport.authenticate('local', { successRedirect: '/article',
                                   failureRedirect: '/users/login',
                                   failureFlash: true })(req,res,next)
})

router.get('/logout',(req,res) => {
    req.logout()
    req.flash('success','logged out')
    res.redirect('/users/login')
})

module.exports = router