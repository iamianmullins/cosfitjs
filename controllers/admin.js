"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const userStore = require("../models/user-store");
const assessmentStore = require("../models/assessment-store");
const uuid = require("uuid");
const utility = require("../models/utility.js");


const admin = {
  index(request, response) {
    logger.info("About rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Trainer Dashboard",
      trainerhdr: "Trainer List",
      memberhdr: "Member List",
      members: userStore.getAllMembers(),
      trainers: userStore.getAllTrainers(),
      memberCount: userStore.memberCount(),
      trainerCount: userStore.trainerCount(),
      months: assessmentStore.getUserMeasurements(loggedInUser.id),
      averageBmi: userStore.getAverageBmi(),
      user: loggedInUser
    };
    if(loggedInUser.trainer==="1"){
      response.render("admin", viewData);
    }
    else{
      response.redirect("/");
    }
  },

  deleteMember(request, response) {
    const userId = request.params.userId;
    const loggedInMember = accounts.getCurrentUser(request);
    logger.info(`Deleting User ${userId}`);
    if (userId !== loggedInMember.id) {
      userStore.removeUser(userId);
      logger.info(`Unable to delete logged in user:  ${userId}`);
    }
    response.redirect("/admin");
  },

  addTrainer(request, response) {
    const newTrainer = {
      id: uuid.v1(),
      firstName: request.body.firstName,
      lastName:  request.body.lastName,
      gender: "Undisclosed",
      dob: utility.newDate(),
      address: "tbd",
      phoneNumber: "01",
      email:  request.body.email,
      password:  request.body.password,
      trainer: "1"
    };
    userStore.addTrainer(newTrainer);
    response.redirect("/admin");
  }
};

module.exports = admin;
