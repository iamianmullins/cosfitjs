"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const utility = require("../models/utility.js");

const trainerview = {
  index(request, response) {
    const currentMember = userStore.getUserById(request.params.id);
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("assessmentList id = ", currentMember);
    const viewData = {
      title: "Assessment List",
      months: assessmentStore.getUserMeasurements(currentMember.id),
      daysFromGoal: utility.returnGoalDays(currentMember.originalGoalDate),
      user: loggedInUser,
      member: currentMember,
      memberid: currentMember.id
    };
    response.render("trainerview", viewData);
  },


    updateGoal(request, response) {
      const currentMember = userStore.getUserById(request.params.id);
      const goalWeight = request.body.goalWeight;
      const isNewGoal = request.body.newGoal;
      console.info(isNewGoal);
      const goalDateFormated = utility.formatGoalDate();
      const goalDate = utility.setGoalDate();
      const goalDays = utility.returnGoalDays();
      if(isNewGoal){
        userStore.newGoal(currentMember, goalWeight, goalDate, goalDateFormated, goalDays);
      }
      else{
        userStore.updateGoal(currentMember, goalWeight, goalDate);
      }
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
