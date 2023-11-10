export function generateRequestID() {
  var date = new Date();
  var year = date.getFullYear();
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var day = String(date.getDate()).padStart(2, "0");
  var hour = String(date.getHours()).padStart(2, "0");
  var minute = String(date.getMinutes()).padStart(2, "0");
  var seconds = String(date.getSeconds()).padStart(2, "0");
  var ID =
    year + "" + month + "" + day + "_" + hour + "" + minute + "" + seconds;
  return ID;
}
