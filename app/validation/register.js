"use strict";
const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Making use of empty name field
    data.name = !isEmpty(data.name) ? data.name : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.privilege = !isEmpty(data.privilege) ? data.privilege : "";

    // Handling Min and Max character in Name Field
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 characters";
    }
    // Handling Empty Name Field
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    // Handling Empty Username Field
    if (Validator.isEmpty(data.username)) {
        errors.username = "Username is required";
    }

    // Handling Empty Password Field
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password is required";
    }
    // If Password Length is below 6
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be atleast 6 characters";
    }

    // Handling Empty Password Field
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Password2 is required";
    }

    // If both the passwords match
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    // Handling Empty Answer Field
    if (Validator.isEmpty(data.privilege)) {
        errors.privilege = "Privilege is required";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
