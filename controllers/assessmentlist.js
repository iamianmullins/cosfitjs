"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const uuid = require("uuid");
const utility = require("../models/utility.js");

const assessmentlist = {
  index(request, response) {
    const assessmentListId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("assessmentList id = ", assessmentListId);
    const viewData = {
      title: "Assessment List",
      assessmentlist: assessmentStore.getMonth(assessmentListId),
      member: loggedInUser,
      user: loggedInUser
    };
    response.render("assessmentlist", viewData);
  },

  deleteMeasurement(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const monthId = request.params.id;
    const measurementId = request.params.assessmentid;
    loggedInUser.currentWeight = loggedInUser.previousWeight;
    logger.debug(`Deleting measurement ${measurementId} from month ${monthId}`);
    const newUserData = {
      kgsFromGoal: loggedInUser.previousWeight - loggedInUser.goalWeight,
      currentWeight: loggedInUser.previousWeight,
      previousWeight: loggedInUser.previousWeight

    };
    userStore.userWeightTracking(loggedInUser, newUserData);
    assessmentStore.updateMonth(monthId, loggedInUser.previousWeight);
    assessmentStore.removeMeasurement(monthId, measurementId);
    response.redirect("/assessmentlist/" + monthId);
  },

  addMeasurement(request, response) {
    const monthId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    const newMeasurement = {
      id: uuid.v1(),
      date: utility.shortDate(),
      height: Number(loggedInUser.height),
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      abdominal: Number(request.body.abdominal),
      thigh: Number(request.body.thigh),
      upperArm: Number(request.body.upperArm),
      waist: Number(request.body.waist),
      trend: false
    };
    let mostRecentAssessment = assessmentStore.getMostRecentAssessment(monthId);
    if (mostRecentAssessment === undefined) {
      mostRecentAssessment = newMeasurement;
    }
    if (mostRecentAssessment.weight === newMeasurement.weight) {
      newMeasurement.trend = true;
    } else if (mostRecentAssessment.weight < newMeasurement.weight) {
      newMeasurement.trend = false;
    } else if (mostRecentAssessment.weight > newMeasurement.weight) {
      newMeasurement.trend = true;
    }
    const newUserData = {
      kgsFromGoal: newMeasurement.weight - loggedInUser.goalWeight,
      previousWeight: loggedInUser.currentWeight,
      currentWeight: newMeasurement.weight
    };

    userStore.userWeightTracking(loggedInUser, newUserData);
    assessmentStore.addMeasurement(monthId, newMeasurement);
    response.redirect("/assessmentlist/" + monthId);
  }
};

module.exports = assessmentlist;
