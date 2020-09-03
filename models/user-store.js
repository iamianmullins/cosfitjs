"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const utility = require('./utility.js');

const userStore = {
  store: new JsonStore("./models/user-store.json", { users: [] }),
  collection: "users",

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    user.currentWeight = user.startWeight;
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getAllMembers() {
    const users = this.store.findAll(this.collection);
    const members = [];
    for (let i = 0; i < users.length; i++) {
      if(users[i].trainer==="0"){
        members.unshift(users[i])
      }
    }
    return members;
  },

  getAverageBmi() {
    const members = this.getAllMembers();
    let total = null;
    for (let i = 0; i < members.length; i++) {
      let member = members[i];
      total += + utility.getBmi(member);
    }
    const bmiAvg = total/members.length;
    const bmiAvgRounded  = bmiAvg.toFixed(2);
    return bmiAvgRounded;
  },

  memberCount() {
    const users = this.store.findAll(this.collection);
    const members = [];
    for (let i = 0; i < users.length; i++) {
      if(users[i].trainer==="0"){
        members.unshift(users[i])
      }
    }
    return members.length;
  },

  trainerCount() {
    const users = this.store.findAll(this.collection);
    const trainers = [];
    for (let i = 0; i < users.length; i++) {
      if(users[i].trainer==="1"){
        trainers.unshift(users[i])
      }
    }
    return trainers.length;
  },

  getMemberById(id) {
    const user = this.store.findOneBy(this.collection, { id: id });
    if(users.trainer==="0"){
      return user;
    }
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },


  getCurrentMember(request) {
    const memberId = request.cookies.id;
    return userstore.getUserByEmail(userEmail);
  },

  removeMember(id) {
    const member = this.getUserById(id);
    this.store.remove(this.collection, member);
    this.store.save();
  },
};

module.exports = userStore;
