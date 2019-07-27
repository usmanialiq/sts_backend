"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");

const router = require("./services/index");

const app = express();

require("./db/connection");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
require("./config/passport")(passport);
app.use(cookieParser());
app.use(helmet());
app.use(cors());

app.use("/api", router.auth, router.users);

module.exports = app;
