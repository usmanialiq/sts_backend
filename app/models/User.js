"use strict";
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    rollNo: {
        type: Number,
        required: true,
    },
    // for students, teachers "school"
    class: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    // admin, teacher and student
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
