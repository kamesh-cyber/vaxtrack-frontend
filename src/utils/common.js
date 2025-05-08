const moment = require("moment/moment");

const formatDate = (date) => {
    if (!date) return "";
    return moment(date).format("DD/MM/YYYY");
}
const formatClass = (value) => {
  // Handle null, undefined, empty arrays
  if (!value || !Array.isArray(value) || value.length === 0) return "None";
  
  try {
      // Convert all values to numbers and filter out invalid entries
      const validClasses = value
          .map(val => Number(val))
          .filter(val => !isNaN(val) && val > 0);
          
      if (validClasses.length === 0) return "None";
      
      // Sort classes numerically
      const sortedClasses = validClasses.sort((a, b) => a - b);
      
      // Format classes into ranges
      const ranges = [];
      let rangeStart = sortedClasses[0];
      let rangeEnd = rangeStart;
      
      for (let i = 1; i < sortedClasses.length; i++) {
          if (sortedClasses[i] === rangeEnd + 1) {
              // Extend the current range
              rangeEnd = sortedClasses[i];
          } else {
              // End the current range and start a new one
              if (rangeStart === rangeEnd) {
                  ranges.push(`${rangeStart}`);
              } else {
                  ranges.push(`${rangeStart}-${rangeEnd}`);
              }
              rangeStart = sortedClasses[i];
              rangeEnd = rangeStart;
          }
      }
      
      // Add the last range
      if (rangeStart === rangeEnd) {
          ranges.push(`${rangeStart}`);
      } else {
          ranges.push(`${rangeStart}-${rangeEnd}`);
      }
      
      return ranges.join(", ");
  } catch (error) {
      console.error("Error formatting class data:", error);
      return "Format Error";
  }
}
const showLoading = (isShow) => {
  const event = new CustomEvent('loadingStatus', { detail: { isLoading: isShow } });
  window.dispatchEvent(event);
}

const showAlert = (alertData={open: false, severity: "info", message: "Alert Message Here!"}) => {
  if (!alertData?.open) return;
  if (alertData.severity === "error") {
    let errMessage = alertData.message
    alertData.message = errMessage?.message || "Message not found!"
  }
  const event = new CustomEvent('showAlert', { detail: { alertData: alertData } });
  window.dispatchEvent(event);
}

export {
    formatDate,
    showLoading,
    showAlert,
    formatClass
}