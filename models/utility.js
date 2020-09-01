'use strict';
const utility = {
  monthName() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentDate = new Date();
    const currentMonth = monthNames[currentDate.getMonth()];
    const currentYear = currentDate.getFullYear();
    const monthYearName = currentMonth + ' - ' + currentYear;
    return monthYearName;
  },

  shortDate() {
    const currentDate = new Date();
    const shortDate = currentDate.toLocaleDateString();
    return shortDate;
  },
}
module.exports = utility;
