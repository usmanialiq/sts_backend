"use strict";
const Auth = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validator = require("validator");

// requiring local modules
const User = require("../models/User");
const Student = require("../models/Student");
const keys = require("../config/keys");
const routes = require("../routes");

// Load Input Validation
const validation = require("./../validation/index");

// @route   POST /register
// @desc    Register admin & teachers
// @access  Public
Auth.post(routes.register + "/admin", (req, res, next) => {
    try {
        const { errors, isValid } = validation.register(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        // check if admin accounts have exceeded
        if (req.body.privilege === "admin") {
            User.find({ privilege: "admin" }, (err, response) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
                if (response.length >= 1) {
                    return res.status(403).json({
                        error: "Admin accounts have reached its limit",
                    });
                } else {
                    User.find({ username: req.body.username }, (err, user) => {
                        if (err) {
                            return res.status(400).json({ error: err });
                        }
                        if (user.length > 0) {
                            errors.username = "Username already exists";
                            return res.status(400).json(errors);
                        } else {
                            // Strong the New User
                            const newUser = {
                                name: req.body.name,
                                username: req.body.username,
                                password: req.body.password,
                                password2: req.body.password2,
                                privilege: req.body.privilege,
                            };
                            if (newUser.privilege === "admin") {
                                newUser.email = req.body.email;
                                if (
                                    !newUser.email ||
                                    newUser.email === ("" || null || undefined)
                                ) {
                                    errors.email = "Email is required";
                                    return res.status(400).json(errors);
                                }
                                if (!validator.isEmail(newUser.email)) {
                                    errors.email = "Not a valid email";
                                    return res.status(400).json(errors);
                                }
                            }
                            if (newUser.privilege === "teacher") {
                                newUser.subject = req.body.subject;
                                if (
                                    newUser.subject ===
                                    ("" || null || undefined)
                                ) {
                                    errors.subject = "Subject is required";
                                    return res.status(400).json(errors);
                                }
                            }
                            // Hashing Password
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(
                                    newUser.password,
                                    salt,
                                    (err, hash) => {
                                        if (err) {
                                            return res
                                                .status(400)
                                                .json({ error: err });
                                        }
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
                                                    error:
                                                        "Error: Failed to create user.",
                                                });
                                                next(error);
                                            });
                                    }
                                );
                            });
                        }
                    });
                }
            });
        } else {
            User.find({ username: req.body.username }, (err, user) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
                if (user.length > 0) {
                    errors.username = "Username already exists";
                    return res.status(400).json(errors);
                } else {
                    // Strong the New User
                    const newUser = {
                        name: req.body.name,
                        username: req.body.username,
                        password: req.body.password,
                        password2: req.body.password2,
                        privilege: req.body.privilege,
                    };
                    if (newUser.privilege === "admin") {
                        newUser.email = req.body.email;
                        if (
                            !newUser.email ||
                            newUser.email === ("" || null || undefined)
                        ) {
                            errors.email = "Email is required";
                            return res.status(400).json(errors);
                        }
                        if (!validator.isEmail(newUser.email)) {
                            errors.email = "Not a valid email";
                            return res.status(400).json(errors);
                        }
                    }
                    if (newUser.privilege === "teacher") {
                        newUser.subject = req.body.subject;
                        if (newUser.subject === ("" || null || undefined)) {
                            errors.subject = "Subject is required";
                            return res.status(400).json(errors);
                        }
                    }
                    // Hashing Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                return res.status(400).json({ error: err });
                            }
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
        }
    } catch (err) {
        res.status(400).json(err);
        next(err);
    }
});

// @route   POST /register/students
// @desc    Register students
// @access  Private
Auth.post(
    routes.register + routes.students,
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        try {
            const { errors, isValid } = validation.registerStudent(req.body);
            // Check Validation
            if (!isValid) {
                return res.status(400).json(errors);
            }

            Student.find({ username: req.body.username }, (err, user) => {
                if (err) {
                    return res.status(400).json({ error: err });
                }
                if (user.length > 0) {
                    errors.username = "Username already exists";
                    return res.status(400).json(errors);
                } else {
                    // Strong the New User
                    const newUser = {
                        name: req.body.name,
                        username: req.body.username,
                        password: req.body.password,
                        password2: req.body.password2,
                        rollNo: req.body.rollNo,
                        class: req.body.class,
                    };
                    // Hashing Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) {
                                return res.status(400).json({ error: err });
                            }
                            newUser.password = hash;
                            // Validating with User Schema
                            let regUser = new Student(newUser);
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
    }
);

// @route   POST /login
// @desc    Login admin & teachers / Returning JWT Token
// @access  Public
Auth.post(routes.login + "/admin", (req, res, next) => {
    try {
        const { errors, isValid } = validation.login(req.body);

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
                            privilege: user.privilege,
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

// @route   POST /login/students
// @desc    Login students / Returning JWT Token
// @access  Public
Auth.post(routes.login + routes.students, (req, res, next) => {
    try {
        const { errors, isValid } = validation.login(req.body);

        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        const username = req.body.username;
        const password = req.body.password;

        // Find user by email
        Student.findOne({ username }, (error, user) => {
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
                            privilege: user.privilege,
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
