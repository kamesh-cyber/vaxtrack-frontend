const moment = require("moment/moment");

const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("DD/MM/YYYY");
}

const showLoading = (isShow) => {
  const event = new CustomEvent('loadingStatus', { detail: { isLoading: isShow } });
  window.dispatchEvent(event);
}

export {
    formatDate,
    showLoading
}