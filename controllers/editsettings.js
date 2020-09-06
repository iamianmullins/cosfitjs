"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const userStore = require("../models/user-store");

const editsettings = {
  index(request, response) {
    logger.info("Edit details rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Edit details",
      user: loggedInUser
    };
    if (loggedInUser.trainer === "1") {
      logger.info("Edit trainer details rendering");
      response.render("trainersettings", viewData);
    } else {
      logger.info("Edit member details rendering");
      response.render("editsettings", viewData);
    }
  },

  update(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser.trainer === "1") {
      const updatedUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        gender: request.body.gender,
        dob: request.body.dob,
        address: request.body.address,
        phoneNumber: request.body.phoneNumber,
        password: request.body.password
      };
      userStore.updateTrainer(loggedInUser, updatedUser);
    } else {
      const updatedUser = {
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        currentWeight: Number(request.body.currentWeight),
        goalWeight: Number(request.body.goalWeight),
        phoneNumber: request.body.phoneNumber,
        address: request.body.address,
        password: request.body.password
      };
      userStore.updateUser(loggedInUser, updatedUser);
    }
    response.redirect("/editsettings");
  }
};

module.exports = editsettings;
