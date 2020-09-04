"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const uuid = require("uuid");
const utility = require('../models/utility.js');

const trainerview = {
  index(request, response) {
    const currentMember = userStore.getUserById(request.params.id);
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("assessmentList id = ", currentMember);
    const viewData = {
      title: "Assessment List",
      months: assessmentStore.getUserMeasurements(currentMember.id),
      variance: assessmentStore.getUserMeasurements(currentMember.id).latestWeight-assessmentStore.getUserMeasurements(currentMember.id).startingWeight,
      user: loggedInUser,
      member: currentMember,
      memberid: currentMember.id,
    };
    response.render("trainerview", viewData);
  },

  deleteMeasurement(request, response) {
    const monthId = request.params.id;
    const measurementId = request.params.assessmentid;
    logger.debug(`Deleting measurement ${measurementId} from month ${monthId}`);
    assessmentStore.removeMeasurement(monthId, measurementId);
    response.redirect("/trainerview/" + monthId);
  },

  addMeasurement(request, response) {
    const monthId = request.params.id;
    const newMeasurement = {
      id: uuid.v1(),
      date: utility.shortDate(),
      height: 1.8,
      weight: request.body.weight,
      chest: request.body.chest,
      abdominal: request.body.abdominal,
      thigh: request.body.thigh,
      upperArm: request.body.upperArm,
      waist: request.body.waist,
    };
    logger.debug("New Assessment = ", newMeasurement);
    assessmentStore.addMeasurement(monthId, newMeasurement);
    response.redirect("/trainerview/" + monthId);
  }
};

module.exports = trainerview;
