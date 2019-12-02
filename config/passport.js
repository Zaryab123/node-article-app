const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = (passport) => {
    passport.use(new LocalStrategy((username, password, done) => {
        const query = { email: username }

        User.findOne(query)
            .then(user => {

                if (!user) {
                    return done(null, false, { message: 'No user found' })
                } else {
                    bcrypt.compare(password, user.password)
                        .then(isMatch => {
                            if (isMatch) {
                                return done(false, user)
                            } else {
                                return done(null, false, { message: 'Password is wrong' })
                            }
                        })
                }
            })
    }))

    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ _id: id }, function (err, user) {
            done(err, user);
        });
    });
}