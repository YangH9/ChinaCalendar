if (!Date.prototype.toFormat) {
  ;(function () {
    Date.prototype.toFormat = function (pattern = 'YYYYMMDDThhmmss') {
      const time = {
        'M+': this.getMonth() + 1,
        'D+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
      }
      const week = ['\u65e5', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d']
      if (/(Y+)/.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      if (/(E+)/.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[this.getDay()])
      }
      for (const item in time) {
        if (new RegExp(`(${item})`).test(pattern)) {
          pattern = pattern.replace(RegExp.$1, RegExp.$1.length === 1 ? time[item] : ('00' + time[item]).substr(('' + time[item]).length))
        }
      }
      return pattern
    }
  })()
}
