"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const measurementStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const utility = require("../models/utility.js");
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    logger.info("Dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Assessment Dashboard",
      months: measurementStore.getUserMeasurements(loggedInUser.id),
      month: utility.monthName(),
      member: loggedInUser,
      user: loggedInUser,
      daysFromGoal: utility.returnGoalDays(loggedInUser.originalGoalDate),
      bmi: utility.getBmi(loggedInUser),
      bmicat: utility.getBmiCat(loggedInUser),
      isideal: utility.idealBw(loggedInUser)
    };
    response.render("dashboard", viewData);
  },

  deleteMeasurementMonth(request, response) {
    const monthId = request.params.id;
    logger.info(`Deleting Month ${monthId}`);
    measurementStore.removeMeasurementMonth(monthId);
    response.redirect("/dashboard");
  },

  addMeasurementMonth(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newMeasurementMonth = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      month: utility.monthName(),
      assessmentcount: 0,
      startingWeight: loggedInUser.currentWeight,
      latestWeight: loggedInUser.currentWeight,
      measurements: [],
      trend: false
    };
    let latestMonth = measurementStore.getLatestMonth(loggedInUser.id);
    if (latestMonth === undefined) {
      latestMonth = newMeasurementMonth;
    }
    if (latestMonth.latestWeight === newMeasurementMonth.latestWeight) {
      newMeasurementMonth.trend = true;
    } else if (latestMonth.latestWeight < newMeasurementMonth.latestWeight) {
      newMeasurementMonth.trend = false;
    } else if (latestMonth.latestWeight > newMeasurementMonth.latestWeight) {
      newMeasurementMonth.trend = true;
    }
    logger.info("Adding measurement month for ", newMeasurementMonth);
    measurementStore.addMonth(newMeasurementMonth);
    response.redirect("/dashboard");
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
    response.redirect("/dashboard");
  },
};

module.exports = dashboard;
