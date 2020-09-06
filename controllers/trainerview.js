"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");

const trainerview = {
  index(request, response) {
    const currentMember = userStore.getUserById(request.params.id);
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("assessmentList id = ", currentMember);
    const viewData = {
      title: "Assessment List",
      months: assessmentStore.getUserMeasurements(currentMember.id),
      variance: "10",
      user: loggedInUser,
      member: currentMember,
      memberid: currentMember.id
    };
    response.render("trainerview", viewData);
  },


  updateGoal(request, response) {
    const currentMember = userStore.getUserById(request.params.id);
    const goalWeight = request.body.goalWeight;
    userStore.updateGoal(currentMember, goalWeight);
    response.redirect("/trainerview/" + currentMember.id);
  },

  deleteMeasurementMonth(request, response) {
    const currentMember = userStore.getUserById(request.params.userId);
    const monthId = request.params.id;
    logger.info(`Deleting Month ${monthId}`);
    assessmentStore.removeMeasurementMonth(monthId);
    response.redirect("/trainerview/" + currentMember.id);
  }
};

module.exports = trainerview;
