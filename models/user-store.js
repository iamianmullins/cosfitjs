"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const utility = require("./utility.js");

const userStore = {
  store: new JsonStore("./models/user-store.json", { users: [] }),
  collection: "users",

  addUser(user) {
    this.store.add(this.collection, user);
    user.currentWeight = user.startWeight;
    this.store.save();
  },

  addTrainer(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getMemberById(id) {
    const user = this.store.findOneBy(this.collection, { id: id });
    if (users.trainer === "0") {
      return user;
    }
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },


  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  getAllMembers() {
    const users = this.store.findAll(this.collection);
    const members = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].trainer === "0") {
        members.unshift(users[i]);
      }
    }
    const membersOrdered = _.orderBy(members, ["asc"]);
    return membersOrdered;
  },

  getAllTrainers() {
    const users = this.store.findAll(this.collection);
    const members = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].trainer === "1") {
        members.unshift(users[i]);
      }
    }
    return members;
  },

  getAverageBmi() {
    const members = this.getAllMembers();
    let total = null;
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      total += +utility.getBmi(member);
    }
    const bmiAvg = total / members.length;
    const bmiAvgRounded = bmiAvg.toFixed(2);
    return bmiAvgRounded;
  },

  memberCount() {
    const users = this.store.findAll(this.collection);
    const members = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].trainer === "0") {
        members.unshift(users[i]);
      }
    }
    return members.length;
  },

  trainerCount() {
    const users = this.store.findAll(this.collection);
    const trainers = [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].trainer === "1") {
        trainers.unshift(users[i]);
      }
    }
    return trainers.length;
  },

  removeUser(id) {
    const user = this.getUserById(id);
    this.store.remove(this.collection, user);
    this.store.save();
  },

  updateUser(user, updatedUser) {
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.currentWeight = updatedUser.currentWeight;
    user.goalWeight = updatedUser.goalWeight;
    user.address = updatedUser.address;
    user.password = updatedUser.password;
    user.kilosFromGoalWeight = updatedUser.currentWeight - updatedUser.goalWeight;
    this.store.save();
  },

  updateTrainer(user, updatedUser) {
    user.firstName = updatedUser.firstName;
    user.lastName = updatedUser.lastName;
    user.gender = updatedUser.gender;
    user.dob = updatedUser.dob;
    user.address = updatedUser.address;
    user.phoneNumber = updatedUser.phoneNumber;
    user.password = updatedUser.password;
    user.address = updatedUser.address;
    user.password = updatedUser.password;
    this.store.save();
  },

  updateGoal(user, updatedGoal) {
    user.goalWeight = updatedGoal;
    user.goalDatePassed = false;
    user.goalReached = false;
    if(user.daysFromGoal<=0) {
      user.goalDatePassed = false;
      if (user.kilosFromGoalWeight <= 0) {
        user.goalReached = true;
      } else {
        user.goalDatePassed = true;
        user.goalReached = false;
      }
    }
    user.kilosFromGoalWeight =  Math.abs(user.currentWeight - user.goalWeight);
    this.checkGoalDate(user);
    this.store.save();
  },

  updateGoalOnLogin() {
    const users= this.store.findAll(this.collection);
    for(let i=0; i<users.length; i++) {
      if (users[i].trainer === "0") {
      this.checkGoalDate(users[i]);
    }
    }
    this.store.save();
  },

  checkGoalDate(user)
  {
    user.goalDatePassed = false;
    const currentDate = new Date();
    if (user.originalGoalDate >= currentDate) {
      user.goalDatePassed = false;
      if ((user.kilosFromGoalWeight <= 1)) {
        user.goalReached = true;
      }
    }
    else {
      user.goalDatePassed = true;
      user.goalReached = false;
    }
    this.store.save();
  },

  newGoal(user, updatedGoal, goalDate, goalDateFormatted, goalDays) {
    user.goalDate = goalDateFormatted;
    user.originalGoalDate = goalDate;
    user.goalWeight = updatedGoal;
    user.goalDatePassed = false;
    user.daysToGoal = goalDays;
    user.goalDatePassed = false;
    user.goalReached = false;
    user.kilosFromGoalWeight = Math.abs(user.currentWeight - user.goalWeight);
    this.checkGoalDate(user);
    this.store.save();
  },

  userWeightTracking(user, newData) {
    user.kilosFromGoalWeight = newData.kgsFromGoal;
    user.previousWeight = newData.previousWeight;
    user.currentWeight = newData.currentWeight;
    this.checkGoalDate(user)

    if (utility.idealBw(user) === "Ideal") {
      user.weightClassGoalReached = true;
    } else {
      user.weightClassGoalReached = false;
    }

    if (utility.getBmiCat(user) === "Normal") {
      user.bmiCatGoalReached = true;
    } else {
      user.bmiCatGoalReached = false;
    }
    if ((utility.getBmi(user) >= 18.5) && (utility.getBmi(user) < 25)) {
      user.bmiGoalReached = true;
    } else {
      user.bmiGoalReached = false;
    }
    this.store.save();
  }
};

module.exports = userStore;
