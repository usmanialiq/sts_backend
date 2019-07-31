"use strict";
const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    options: [OptionSchema],
    answer: {
        type: Number,
        required: true,
    },
});

const OptionSchema = new mongoose.Schema({
    option: {
        type: String,
        required: true,
    },
    serial: {
        Number,
        required: true,
    },
});

const McqSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    // the date for the test to be valid
    date: {
        type: Number,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    questions: [QuestionSchema],
    class: {
        type: String,
        required: true,
    },
    // student id
    submittedBy: {
        type: String,
        required: true,
    },
    // teacher id
    createdBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        default: Date.now(),
    },
});

const Mcq = mongoose.model("Mcqs", McqSchema);

module.exports = Mcq;
