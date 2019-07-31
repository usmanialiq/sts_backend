"use strict";
// Node Modules
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Requiriing Local
const Student = require("../models/Student");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            Student.findById(jwt_payload.id)
                .then(student => {
                    if (student) {
                        // if we get student, we do this, 'null' represents Error
                        return done(null, student);
                    }
                    // if we donot get student, we do this, 'false' represents Empty student
                    return done(null, false);
                })
                .catch(err => console.log(err));
        })
    );
};
