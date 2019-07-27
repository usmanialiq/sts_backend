"use strict";
const mongoose = require("mongoose");

const connection = mongoose
    .connect("mongodb://localhost:27017/sts", {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Connection to DB established...");
    })
    .catch(error => {
        console.error("Connection to DB failed...");
    });

module.exports = connection;
