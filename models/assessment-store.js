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

  getUserMeasurements(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  },


  addMonth(month) {
    this.store.add(this.collection, month);
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

  addMeasurement(id, measurement) {
    const month = this.getMonth(id);
    month.assessmentcount++;
    month.measurements.unshift(measurement);
    this.store.save();
  },

  removeMeasurement(id, measurementId) {
    const month = this.getMonth(id);
    const measurementList = month.measurements;
    month.assessmentcount--;
    _.remove(measurementList, { id: measurementId });
    this.store.save();
  },

  getAssessment(id, assessmentId) {
    const assessmentMonth = this.store.findOneBy(this.collection, { id: id });
    const assessments = assessmentMonth.measurements.filter(assessment => assessment.id == assessmentId);
    return assessments[0];
  },

  updateAssessment(assessment, updatedAssessment) {
    assessment.weight = updatedAssessment.weight;
    assessment.chest = updatedAssessment.chest;
    assessment.abdominal = updatedAssessment.abdominal;
    assessment.thigh = updatedAssessment.thigh;
    assessment.upperArm = updatedAssessment.upperArm;
    assessment.waist = updatedAssessment.waist;
    this.store.save();
  }
};

module.exports = assessmentStore;
