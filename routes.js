~"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const trainerdashboard = require("./controllers/trainerdashboard.js");
const about = require("./controllers/about.js");
const assessmentlist = require("./controllers/assessmentlist.js");
const assessmentedit = require("./controllers/assessmentedit.js");
const trainerview = require("./controllers/trainerview.js");
const trainerassessmentlist = require("./controllers/trainerassessmentlist.js");

router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);

router.get("/dashboard", dashboard.index);
router.get("/dashboard/deleteassessmentmonth/:id", dashboard.deleteMeasurementMonth);
router.post("/dashboard/addassessmentmonth", dashboard.addMeasurementMonth);

router.get("/trainerdashboard", trainerdashboard.index);
router.get("/trainerdashboard/deletemember/:id", trainerdashboard.deleteMember);
router.get("/trainerassessmentlist/:id/viewmember", trainerview.index);
router.get("/trainerassessmentlist/:id/member/:userid", trainerassessmentlist.index);
router.post("/trainerassessmentlist/:id/updatecomment/:assessmentId", trainerassessmentlist.updateComment);

router.get("/about", about.index);

router.get("/assessmentlist/:id", assessmentlist.index);
router.get("/assessmentlist/:id/deleteassessment/:assessmentid", assessmentlist.deleteMeasurement);
router.post("/assessmentlist/:id/addassessment", assessmentlist.addMeasurement);

router.get("/assessment/:id/editassessment/:assessmentId", assessmentedit.index);
router.post("/assessment/:id/updateassessment/:assessmentId", assessmentedit.update);

module.exports = router;
