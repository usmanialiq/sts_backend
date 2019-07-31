"use strict";
const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
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
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    privilege: {
        type: String,
        required: true,
        default: "student",
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
});

const Student = mongoose.model("Students", StudentSchema);

module.exports = Student;
