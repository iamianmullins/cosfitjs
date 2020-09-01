"use strict";

const logger = require("../utils/logger");
const accounts = require("./accounts.js");

const about = {
  index(request, response) {
    logger.info("About rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const viewData = {
      title: "Some content required",
      user: loggedInUser,
    };
    response.render("about", viewData);
  }
};

module.exports = about;
