"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");
const userStore = require("../models/user-store");
const uuid = require("uuid");
const utility = require('../models/utility.js');

const trainerassessmentlist = {
  index(request, response) {
    const assessmentListId = request.params.id;
    const currentMember = userStore.getUserById(request.params.userid);
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug("assessmentList id = ", assessmentListId);
    const viewData = {
      title: "Assessment List",
      assessmentlist: assessmentStore.getMonth(assessmentListId),
      user: loggedInUser,
      member: currentMember,
    };
    response.render("trainerassessmentlist", viewData);
  },

  updateComment(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const assessmentId = request.params.assessmentId;
    const monthId = request.params.id
    const month = assessmentStore.getMonth(monthId);
    const assessment = assessmentStore.getAssessment(monthId, assessmentId);

    const newAssessment = {
      weight: assessment.weight,
      chest: assessment.chest,
      abdominal: assessment.abdominal,
      thigh: assessment.thigh,
      upperArm: assessment.upperArm,
      waist: assessment.waist,
      comment: loggedInUser.firstName + ": " + request.body.comment,
    };
    logger.info(`Updating Assessment ${newAssessment.id} from Month ${request.body.comment}`);
    assessmentStore.updateAssessment(assessment, newAssessment);
    response.redirect("/trainerassessmentlist/" + monthId + "/member/" + month.userid);
  },

  addMeasurement(request, response) {
    const monthId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
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
    loggedInUser.currentWeight = newMeasurement.weight;
    assessmentStore.addMeasurement(monthId, newMeasurement);
    response.redirect("/trainerassessmentlist/" + monthId);
  }
};

module.exports = trainerassessmentlist;
