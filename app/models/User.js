"use strict";
const mongoose = require("mongoose");

// For dashboard access
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    // only for admin
    email: {
        type: String,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    // only for teacher
    subject: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    // admin and teacher
    privilege: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
