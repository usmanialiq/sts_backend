"use strict";
const Validator = require("validator");

const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Making use of empty name field
    data.name = !isEmpty(data.name) ? data.name : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.password2 = !isEmpty(data.password2) ? data.password2 : "";
    data.contact = !isEmpty(data.contact) ? data.contact : "";
    data.securityQ = !isEmpty(data.securityQ) ? data.securityQ : "";
    data.securityA = !isEmpty(data.securityA) ? data.securityA : "";

    // Handling Min and Max character in Name Field
    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 characters";
    }
    // Handling Empty Name Field
    if (Validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    // Handling Empty Email Field
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    }
    // Handling Valid Email Field
    if (!Validator.isEmail(data.email)) {
        errors.email = "Not a valid email";
    }

    // Handling Empty Password Field
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }
    // If Password Length is below 6
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be atleast 6 characters";
    }

    // Handling Empty Password Field
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "Password2 field is required";
    }

    // If both the passwords match
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "Passwords must match";
    }

    // Handling Empty Contact Field
    if (Validator.isEmpty(data.contact)) {
        errors.contact = "Contact field is required";
    }
    // Handling Empty Question Field
    if (Validator.isEmpty(data.securityQ)) {
        errors.securityQ = "Security Question is required";
    }
    // Handling Empty Answer Field
    if (Validator.isEmpty(data.securityA)) {
        errors.securityA = "Security Answer is required";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
