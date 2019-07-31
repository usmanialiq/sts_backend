"use strict";
const MCQ = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// requiring local modules
const Student = require("../models/Student");
const keys = require("../config/keys");
const routes = require("../routes");

// Load Input Validation
const validation = require("./../validation/index");

module.exports = MCQ;
