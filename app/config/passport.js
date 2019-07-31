"use strict";
// Node Modules
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

// Requiriing Local
const User = require("../models/User");
const Student = require("../models/Student");
const keys = require("./keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            if (jwt_payload.privilege === ("admin" || "teacher")) {
                User.findById(jwt_payload.id)
                    .then(user => {
                        if (user) {
                            // if we get user, we do this, 'null' represents Error
                            return done(null, user);
                        }
                        // if we donot get user, we do this, 'false' represents Empty User
                        return done(null, false);
                    })
                    .catch(err => {
                        return err;
                    });
            }
            if (jwt_payload.privilege === "student") {
                Student.findById(jwt_payload.id)
                    .then(student => {
                        if (student) {
                            // if we get student, we do this, 'null' represents Error
                            return done(null, student);
                        }
                        // if we donot get student, we do this, 'false' represents Empty student
                        return done(null, false);
                    })
                    .catch(err => {
                        return err;
                    });
            }
        })
    );
};
