"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const assessmentStore = {
  store: new JsonStore("./models/assessment-store.json", {
    assessmentCollection: []
  }),
  collection: "assessmentCollection",

  getAllMonths() {
    return this.store.findAll(this.collection);
  },

  getMonth(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getAssessment(id, assessmentId) {
    const month = this.getMonth(id);
    const assessments = month.measurements.filter(assessment => assessment.id == assessmentId);
    return assessments[0];
  },

  getMostRecentAssessment(id) {
    const month = this.getMonth(id);
    return month.measurements[0];
  },

  getLatestMonth(userid) {
    const assessmentList = _.reverse(this.store.findBy(this.collection, { userid: userid }));
    const latestAssessment = assessmentList[0];
    return latestAssessment;
  },

  getPreviousMonth(userid) {
    const assessmentList = _.reverse(this.store.findBy(this.collection, { userid: userid }));
    const latestAssessment = assessmentList[1];
    return latestAssessment;
  },

  getUserMeasurements(userid) {
    return _.reverse(this.store.findBy(this.collection, { userid: userid }));
  },

  addMonth(newMonth) {
    this.store.add(this.collection, newMonth);
    this.store.save();
  },

  addMeasurement(id, measurement) {
    const month = this.getMonth(id);
    month.assessmentcount++;
    if (month.measurements.length > 0) {
      month.latestWeight = measurement.weight;
    } else if (month.measurements.length === 0) {
      month.startingWeight = measurement.weight;
      month.latestWeight = measurement.weight;
    }
    month.measurements.unshift(measurement);
    this.store.save();
  },



  removeMeasurementMonth(id) {
    const month = this.getMonth(id);
    this.store.remove(this.collection, month);
    this.store.save();
  },

  removeAllAssessmentMonths() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  removeMeasurement(id, measurementId) {
    const month = this.getMonth(id);
    const measurementList = month.measurements;
    month.assessmentcount--;
    _.remove(measurementList, { id: measurementId });
    this.store.save();
  },

  updateMonth(monthId, currentWeight) {
    const month = this.getMonth(monthId);
    month.latestWeight = currentWeight;
    this.store.save();
  },

  updateAssessment(assessment, updatedAssessment) {
    assessment.weight = updatedAssessment.weight;
    assessment.chest = updatedAssessment.chest;
    assessment.abdominal = updatedAssessment.abdominal;
    assessment.thigh = updatedAssessment.thigh;
    assessment.upperArm = updatedAssessment.upperArm;
    assessment.waist = updatedAssessment.waist;
    assessment.comment = updatedAssessment.comment;
    this.store.save();
  }
};

module.exports = assessmentStore;
