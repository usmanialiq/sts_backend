"use strict";
const Students = require("express").Router();
const passport = require("passport");
const ObjectId = require("mongoose").Types.ObjectId;

// Mongoose Model
const Student = require("../models/Student");
const routes = require("../routes");

// @route   GET /api/users
// @desc    Get all users - admin only
// @access  Private
Students.get(
    routes.students,
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            Student.find((err, users) => {
                if (err) {
                    res.status(400).json({ error: err });
                } else {
                    res.status(200).json({
                        found: users.length,
                        students: users,
                    });
                }
            });
        } else {
            res.status(403).json({
                error: "Request under this account is not allowed",
            });
        }
    }
);

// @route   GET /api/users/:id
// @desc    Get a user with an id - admin only
// @access  Private
Students.get(
    routes.students + "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            let id = req.params.id;
            Student.find({ _id: ObjectId(id) }, (err, user) => {
                if (err) {
                    throw new Error({
                        notFound: "Student record not found...",
                    });
                } else {
                    if (user.length === 0) {
                        res.status(404).json({
                            error: "Student record not found",
                        });
                    } else {
                        res.status(200).json(user[0]);
                    }
                }
            });
        } else {
            res.status(403).json({
                error: "Request under this account is not allowed",
            });
        }
    }
);

// @route   PUT /api/users/:id
// @desc    Update a user with id - admin only
// @access  Private
// @warn    Privilege can not be altered
Students.put(
    routes.students + "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            let id = req.params.id;
            // Student.find({ _id: ObjectId(id) }, err => {
            //     if (err) {
            //         throw new Error({ error: "Not allowed" });
            //     } else {
            //         res.status(200).json({ success: "User has been deleted" });
            //     }
            // });
            res.status(200).json({ wordUnderProgress: "Under Development" });
        } else {
            res.status(405).json({ error: "Under development" });
        }
    }
);

// @route   DELETE /api/users/:id
// @desc    Delete a user with id - admin only
// @access  Private
Students.delete(
    routes.students + "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            let id = req.params.id;
            Student.remove({ _id: ObjectId(id) }, err => {
                if (err) {
                    throw new Error({ error: "Not allowed" });
                } else {
                    res.status(200).json({
                        success: "Student record has been deleted",
                    });
                }
            });
        } else {
            res.status(405).json({ error: "Delete not allowed" });
        }
    }
);

module.exports = Students;
