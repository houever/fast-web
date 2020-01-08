let util = {

};

util.millsToTime = function (mills) {
  if (!mills) {
    return "";
  }
  let s = mills / 1000;
  if (s < 60) {
    return s.toFixed(0) + " 秒"
  }
  let m = s / 60;
  if (m < 60) {
    return m.toFixed(0) + " 分钟"
  }
  let h = m / 60;
  if (h < 24) {
    return h.toFixed(0) + " 小时"
  }
  let d = h / 24;
  if (d < 30) {
    return d.toFixed(0)  + " 天"
  }
  let month = d / 30
  if (month < 12) {
    return month.toFixed(0)  + " 月"
  }
  let year = month / 12
  return year.toFixed(0)  + " 年"

};

export default util;
