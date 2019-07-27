"use strict";
const Auth = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const keys = require("../config/keys");
const routes = require("../routes");

// Load Input Validation
const validateRegisterInput = require("./../validation/register");
const validateLoginInput = require("./../validation/login");

// @route   POST /register
// @desc    Register user
// @access  Public
Auth.post(routes.register, (req, res, next) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        User.findOne({ username: req.body.username }, (err, user) => {
            if (err) throw new Error();
            if (user) {
                errors.username = "Username already exists";
                return res.status(400).json(errors);
            } else {
                // Strong the New User
                const newUser = {
                    name: req.body.name,
                    username: req.body.username,
                    rollNo: req.body.rollNo,
                    class: req.body.class,
                    privilege: req.body.privilege,
                    password: req.body.password,
                };

                // Hashing Password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        // Validating with User Schema
                        let regUser = new User(newUser);
                        // Saving through Mongoose
                        regUser
                            .save()
                            .then(() => {
                                res.status(200).json({
                                    success:
                                        "Account has been successfully created. Kindly Login!",
                                });
                            })
                            .catch(error => {
                                res.status(400).json({
                                    error: "Error: Failed to create user.",
                                });
                                next(error);
                            });
                    });
                });
            }
        });
    } catch (err) {
        res.status(400).json(err);
        next(err);
    }
});

// @route   POST /login
// @desc    Login User / Returning JWT Token
// @access  Public
Auth.post(routes.login, (req, res, next) => {
    try {
        const { errors, isValid } = validateLoginInput(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const username = req.body.username;
        const password = req.body.password;

        // Find user by email
        User.findOne({ username }, (error, user) => {
            // Check for user
            if (!user) {
                errors.username = "User does not exists";
                return res.status(404).json(errors);
            }

            // Check Password
            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User Matched
                        const payload = {
                            id: user._id,
                            name: user.name,
                        }; // Create JWT Payload
                        // Sign Token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 24 * 60 * 60 },
                            (err, token) => {
                                if (err) throw err;
                                res.json({
                                    loginSuccess: true,
                                    token: token,
                                });
                            }
                        );
                    } else {
                        errors.password = "Password incorrect!";
                        return res.status(400).json(errors);
                    }
                })
                .catch(err => res.status(400).json(err));
        }); // finished calling dbUsers /login
    } catch (error) {
        res.status(500).json(error);
        next(error);
    }
});

module.exports = Auth;
