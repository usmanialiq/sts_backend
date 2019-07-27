"use strict";
// Node Modules
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Requiriing Local
const User = require("../models/User");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        // if we get user, we do this, 'null' represents Error
                        return done(null, user);
                    }
                    // if we donot get user, we do this, 'false' represents Empty User
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};
