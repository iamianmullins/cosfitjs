"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");

const trainerdashboard = {
  index(request, response) {
    logger.info("Trainer Dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Trainer Dashboard",
      trainerhdr: "Trainer List",
      memberhdr: "Member List",
      members: userStore.getAllMembers(),
      trainers: userStore.getAllTrainers(),
      membercount: userStore.memberCount(),
      trainerCount: userStore.trainerCount(),
      months: assessmentStore.getUserMeasurements(loggedInUser.id),
      averageBmi: userStore.getAverageBmi(),
      user: loggedInUser
    };
    logger.info("about to render", assessmentStore.getAllMonths());
    response.render("trainerdashboard", viewData);
  },

  deleteMember(request, response) {
    const userId = request.params.id;
    const loggedInMember = accounts.getCurrentUser(request);
    logger.info(`Deleting User ${userId}`);
    if (userId !== loggedInMember.id) {
      userStore.removeUser(userId);
      logger.info(`Unable to delete logged in user:  ${userId}`);
    }
    response.redirect("/trainerdashboard");
  }

};

module.exports = trainerdashboard;
