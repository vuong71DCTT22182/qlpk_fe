// src/js/timePlugin.js
import moment from "moment";
import "moment-timezone";

const timePlugin = {
  install(app) {
    app.config.globalProperties.$convertToLocalTime = (utcTime) => {
      let time = moment
        .utc(utcTime)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD h:mm:ss A");
      return moment.tz(time, "Asia/Ho_Chi_Minh").toISOString();
    };
  },
};

export default timePlugin;
