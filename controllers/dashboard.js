"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const measurementStore = require("../models/assessment-store");
const utility = require('../models/utility.js');
const uuid = require("uuid");

const dashboard = {
  index(request, response) {
    logger.info("Dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Assessment Dashboard",
      months: measurementStore.getUserMeasurements(loggedInUser.id),
      month: utility.monthName(),
      user: loggedInUser,
      bmi: utility.getBmi(loggedInUser),
      bmicat: utility.getBmiCat(loggedInUser),
      isideal: utility.idealBw(loggedInUser),
    };
    logger.info("about to render", measurementStore.getAllMonths());
    response.render("dashboard", viewData);
  },

  deleteMeasurementMonth(request, response) {
    const monthId = request.params.id;
    logger.debug(`Deleting Month ${monthId}`);
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
      measurements: [],
    };
    logger.debug("Adding measurement month for ", newMeasurementMonth);
    measurementStore.addMonth(newMeasurementMonth);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
