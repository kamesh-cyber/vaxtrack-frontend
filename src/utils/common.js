const moment = require("moment/moment");

const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("DD/MM/YYYY");
}

export {
    formatDate
}