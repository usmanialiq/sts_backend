"use strict";
const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
    let errors = {};

    // Making use of empty name field
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    // // Handling Valid Email Field
    // if (!Validator.isEmail(data.email)) {
    //     errors.email = "Not a valid email";
    // }
    // Handling Empty Email Field
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username is required";
    }

    // Handling Empty Password Field
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
