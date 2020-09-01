"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");
const assessmentStore = require("../models/assessment-store");

const assessmentEdit = {
  index(request, response) {
    const monthId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const loggedInUser = accounts.getCurrentUser(request);
    logger.debug(`Editing Assessment ${assessmentId} from Month ${monthId}`);
    const viewData = {
      title: "Edit Assessment",
      assessmentlist: assessmentStore.getMonth(monthId),
      measurement: assessmentStore.getAssessment(monthId, assessmentId),
      user: loggedInUser,
    };
    response.render("assessmentedit", viewData);
  },

  update(request, response) {
    const monthId = request.params.id;
    const assessmentId = request.params.assessmentId;
    const assessment = assessmentStore.getAssessment(monthId, assessmentId)
    const newAssessment = {
        weight: Number(request.body.weight),
        chest: Number(request.body.chest),
        abdominal: Number(request.body.abdominal),
        thigh: Number(request.body.thigh),
        upperArm: Number(request.body.upperArm),
        waist: Number(request.body.waist)
    };
    logger.debug(`Updating Assessment ${assessmentId} from Month ${monthId}`);
    assessmentStore.updateAssessment(assessment, newAssessment);
    response.redirect("/assessmentlist/" + monthId);
  }
};

module.exports = assessmentEdit;
