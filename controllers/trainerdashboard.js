"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const measurementStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const utility = require('../models/utility.js');
const uuid = require("uuid");

const trainerdashboard = {
  index(request, response) {
    logger.info("Trainer Dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Trainer Dashboard",
      members: userStore.getAllMembers(),
      membercount: userStore.memberCount(),
      trainerCount: userStore.trainerCount(),
      months: measurementStore.getUserMeasurements(loggedInUser.id),
      averageBmi: userStore.getAverageBmi(),
      user: loggedInUser,
    };
    logger.info("about to render", measurementStore.getAllMonths());
    response.render("trainerdashboard", viewData);
  },

  deleteMember(request, response) {
    const memberId = request.params.id;
    logger.debug(`Deleting Member ${memberId}`);
    userStore.removeMember(memberId);
    response.redirect("/trainerdashboard");
  }
};

module.exports = trainerdashboard;
