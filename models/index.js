if (!Date.prototype.toFormat) {
  ;(function () {
    Date.prototype.toFormat = function (pattern = 'yyyyMMddThhmmss') {
      const time = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
      }
      if (/(y+)/.test(pattern)) {
        pattern = pattern.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const item in time) {
        if (new RegExp(`(${item})`).test(pattern)) {
          pattern = pattern.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? time[item]
              : ('00' + time[item]).substr(('' + time[item]).length)
          )
        }
      }
      return pattern
    }
  })()
}

exports.listFormat = (list, govUrl) => {
  const arr = []
  list?.map((item) => {
    let hnum = 0
    let cnum = 0
    let hsnum = item.timeList.filter((i) => i.type === 'holiday').length
    let csnum = item.timeList.filter((i) => i.type === 'compensateday').length
    item.timeList.map((i) => {
      let time = new Date(`${i.time} 00:00:01`).toFormat()
      if (i.type === 'holiday') {
        hnum++
        arr.push(
          `BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:${new Date(i.time).toFormat(
            'yyyyMMdd'
          )}\r\nDTEND;VALUE=DATE:${new Date(i.time).toFormat(
            'yyyyMMdd'
          )}\r\nDTSTAMP:${time}\r\nUID:${time}_${i.type}@${
            globalThis.uName
          }\r\nCREATED:${time}\r\nSUMMARY:「${item.summary} ${
            i.name
          }」 第${hnum}天/共${hsnum}天\r\nDESCRIPTION:${
            item.description
          }\\n\\n放假通知：${govUrl}\r\nLAST-MODIFIED:${
            globalThis.modified
          }\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:0\r\nEND:VEVENT\r\n`
        )
      } else if (i.type === 'compensateday') {
        cnum++
        arr.push(
          `BEGIN:VEVENT\r\nDTSTART:${new Date(`${i.time} 09:00`).toFormat()}\r\nDTEND:${new Date(
            `${i.time} 18:00`
          ).toFormat()}\r\nDTSTAMP:${time}\r\nUID:${time}_${i.type}@${
            globalThis.uName
          }\r\nCREATED:${time}\r\nSUMMARY:「${item.summary} ${
            i.name
          }」 第${cnum}天/共${csnum}天\r\nDESCRIPTION:${
            item.description
          }\\n\\n放假通知：${govUrl}\r\nLAST-MODIFIED:${
            globalThis.modified
          }\r\nSTATUS:TENTATIVE\r\nTRANSP:OPAQUE\r\nSEQUENCE:0\r\nBEGIN:VALARM\r\nTRIGGER:-PT60M\r\nACTION:DISPLAY\r\nEND:VALARM\r\nEND:VEVENT\r\n`
        )
      }
    })
  })
  return arr.join('')
}
