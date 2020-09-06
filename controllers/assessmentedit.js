"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");

const assessmentEdit = {
  index(request, response) {
    const monthId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Edit Assessment",
      assessmentlist: assessmentStore.getMonth(monthId),
      measurement: assessmentStore.getAssessment(monthId, assessmentId),
      user: loggedInUser
    };
    response.render("assessmentedit", viewData);
  },

  update(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const monthId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const assessment = assessmentStore.getAssessment(monthId, assessmentId);
    const latestAssessment = assessmentStore.getMostRecentAssessment(monthId);
    const newAssessment = {
      weight: Number(request.body.weight),
      chest: Number(request.body.chest),
      abdominal: Number(request.body.abdominal),
      thigh: Number(request.body.thigh),
      upperArm: Number(request.body.upperArm),
      waist: Number(request.body.waist)
    };
    if (latestAssessment.id === assessmentId) {
      loggedInUser.currentWeight = newAssessment.weight;
    }
    const newUserData = {
      kgsFromGoal: newAssessment.weight - loggedInUser.goalWeight,
      previousWeight: loggedInUser.previousWeight,
      currentWeight: newAssessment.weight
    };
    userStore.userWeightTracking(loggedInUser, newUserData);
    assessmentStore.updateMonth(monthId, loggedInUser.currentWeight);
    logger.debug(`Updating Assessment ${assessmentId} from Month ${monthId}`);
    assessmentStore.updateAssessment(assessment, newAssessment);
    response.redirect("/assessmentlist/" + monthId);
  }
};

module.exports = assessmentEdit;
