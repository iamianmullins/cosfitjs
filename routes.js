~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const trainerdashboard = require("./controllers/trainerdashboard.js");
const admin = require("./controllers/admin.js");
const assessmentlist = require("./controllers/assessmentlist.js");
const assessmentedit = require("./controllers/assessmentedit.js");
const trainerview = require("./controllers/trainerview.js");
const trainerassessmentlist = require("./controllers/trainerassessmentlist.js");
const editsettings = require("./controllers/editsettings.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/dashboard", dashboard.index);
router.get("/dashboard/deleteassessmentmonth/:id", dashboard.deleteMeasurementMonth);
router.post("/dashboard/addassessmentmonth", dashboard.addMeasurementMonth);
router.get("/editsettings", editsettings.index);
router.post("/editsettings/updateuser", editsettings.update);

router.get("/trainerdashboard", trainerdashboard.index);
router.get("/trainerdashboard/deletemember/:id", trainerdashboard.deleteMember);
router.get("/trainerassessmentlist/:id/deletemonth/:userId", trainerview.deleteMeasurementMonth);
router.get("/trainerview/:id/", trainerview.index);
router.post("/trainerview/:id/updategoal", trainerview.updateGoal);
router.post("/dashboard/:id/updategoal", dashboard.updateGoal);
router.get("/trainerassessmentlist/:id/member/:userid", trainerassessmentlist.index);
router.post("/trainerassessmentlist/:id/updatecomment/:assessmentId", trainerassessmentlist.updateComment);
router.get("/trainerassessmentlist/:id/deleteassessment/:assessmentid", trainerassessmentlist.deleteMeasurement);


router.get("/admin", admin.index);
router.post("/admin/addtrainer", admin.addTrainer);
router.get("/admin/deleteUser/:userId", admin.deleteMember);

router.get("/assessmentlist/:id", assessmentlist.index);
router.get("/assessmentlist/:id/deleteassessment/:assessmentid", assessmentlist.deleteMeasurement);
router.post("/assessmentlist/:id/addassessment", assessmentlist.addMeasurement);

router.get("/assessment/:id/editassessment/:assessmentId", assessmentedit.index);
router.post("/assessment/:id/updateassessment/:assessmentId", assessmentedit.update);

module.exports = router;
