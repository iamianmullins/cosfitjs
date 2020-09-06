"use strict";
const utility = {
  monthName() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const monthYearName = currentMonth + " - " + currentYear;
    return monthYearName;
  },

  shortDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDay();
    const hours = now.getHours();
    const minu = now.getMinutes();
    const sec = now.getSeconds();
    return (day + "/" + month + "/" + year + " - " + hours + ":" + minu + ":" + sec);
  },

  newDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDay();
    const hours = now.getHours();
    const minu = now.getMinutes();
    const sec = now.getSeconds();
    return (day + "/" + month + "/" + year + " - " + hours + ":" + minu + ":" + sec);
  },

  getBmi(member) {
    const weight = member.currentWeight;
    const height = member.height;
    let bmi = weight / (height * height);
    const bmiRounded = bmi.toFixed(2);
    return bmiRounded;
  },


  getBmiCat(member) {
    const weight = member.currentWeight;
    const height = member.height;
    let bmi = weight / (height * height);
    let category = "";
    if (bmi < 18.5) {
      category = "Underweight";
    }
    if (bmi >= 18.5 && bmi < 25) {
      category = "Normal";
    }
    if (bmi >= 25 && bmi < 30) {
      category = "Overweight";
    }
    if (bmi >= 25 && bmi < 30) {
      category = "Obese";
    }
    if (bmi >= 30 && bmi < 35) {
      category = "Extremely Obese";
    }
    if (bmi >= 35) {
      category = "Super Obese";
    }
    return category;
  },

  idealBw(member) {
    const baseWeightMale = 50;
    const baseWeightFemale = 45.5;
    const baseHeight = 60; //5 feet in inches
    const mtrsToInch = 39.37;
    let isIdeal = "";

    const weight = member.currentWeight;
    const height = member.height * mtrsToInch;
    const gender = member.gender;

    let weightDifference = 0;
    if (gender == "Male") {
      weightDifference = weight - baseWeightMale;
    } else {
      weightDifference = weight - baseWeightFemale;
    }

    let heightDifference = height - baseHeight;
    let allowance = heightDifference * 2.3; //2.3kg allowance per inch over 5 foot
    const weightAllowanceDifference = allowance - weightDifference;
    if ((weightAllowanceDifference >= -0.5) && (weightAllowanceDifference <= 0.5)) { //Increased tolerance from 0.2 to 0.5
      isIdeal = "Ideal";
    } else {
      isIdeal = "Not Ideal";
    }
    return isIdeal;
  }

};

module.exports = utility;
