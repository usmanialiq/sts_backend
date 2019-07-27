"use strict";
const Users = require("express").Router();
const passport = require("passport");
const ObjectId = require("mongoose").Types.ObjectId;

// Mongoose Model
const User = require("../models/User");
const routes = require("../routes");

Users.get(
    routes.users,
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            User.find((err, users) => {
                if (err) {
                    throw new Error({ notFound: "Users not found..." });
                } else {
                    res.status(200).json({
                        found: users.length,
                        users: users,
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

Users.get(
    routes.users + "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            let id = req.params.id;
            User.find({ _id: ObjectId(id) }, (err, user) => {
                if (err) {
                    throw new Error({ notFound: "User not found..." });
                } else {
                    if (user.length === 0) {
                        res.status(404).json({ error: "User not found" });
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

Users.delete(
    routes.users + "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        if (req.user.privilege === "admin") {
            let id = req.params.id;
            User.remove({ _id: ObjectId(id), privilege: "regular" }, err => {
                if (err) {
                    throw new Error({ error: "Not allowed" });
                } else {
                    res.status(200).json({ success: "User has been deleted" });
                }
            });
        } else {
            res.status(405).json({ error: "User deletion is not allowed" });
        }
    }
);

module.exports = Users;
