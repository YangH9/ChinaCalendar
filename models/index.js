const { readdirSync } = require('fs')
const { join } = require('path')

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

const solarTermData = {
  // 24节气速查表 ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
  // prettier-ignore
  solarTerms : ["\u5c0f\u5bd2", "\u5927\u5bd2", "\u7acb\u6625", "\u96e8\u6c34", "\u60ca\u86f0", "\u6625\u5206", "\u6e05\u660e", "\u8c37\u96e8", "\u7acb\u590f", "\u5c0f\u6ee1", "\u8292\u79cd", "\u590f\u81f3", "\u5c0f\u6691", "\u5927\u6691", "\u7acb\u79cb", "\u5904\u6691", "\u767d\u9732", "\u79cb\u5206", "\u5bd2\u9732", "\u971c\u964d", "\u7acb\u51ac", "\u5c0f\u96ea", "\u5927\u96ea", "\u51ac\u81f3"],

  // 1900-2100各年的24节气日期速查表
  // prettier-ignore
  solarTermInfo : [
    '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722',
    '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
    '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
    '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd',
    '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
    '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
    '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0723b06bd',
    '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
    '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722',
    '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f531b0b0bb0b6fb0722',
    '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
    '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd',
    '7f07e7f0e47f149b0723b0787b0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e47f149b0723b0787b0721',
    '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
    '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35',
    '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b0723b02d5',
    '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
    '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f531b0b0bb0b6fb0722'
  ],
  getSolarTerm: (y, n) => {
    if (y < 2000 || y > 2100) {
      return -1
    }
    if (n < 1 || n > 24) {
      return -1
    }
    const key = solarTermData.solarTermInfo[y - 2000]
    const keyInfo = Array.from({ length: 6 }, (_, i) => `${+`0x${key.slice(i * 5, (i + 1) * 5)}`}`)
    const calDay = Array.from({ length: 24 }, (_, i) => keyInfo[~~(i / 4)].slice([0, 1, 3, 4][i % 4], [0, 1, 3, 4][i % 4] + 1 + (i % 2)))
    return +calDay[n - 1]
  }
}

let AllKeyId = 1
/**
 * @description: 法定节假日
 * @returns {String} 日历数据
 */
const holidayBody = (all) => {
  let keyId = 1
  const { yearList, filePath, uName, calDesc, modified } = globalThis
  return yearList
    .slice(0, -1)
    .map((year) => {
      const { list, govUrl } = require(join(filePath, `${year}.js`))
      return list.map((item) => {
        let hnum = 0
        let cnum = 0
        const hsnum = item.timeList.filter((i) => i.type === 'holiday').length
        const csnum = item.timeList.filter((i) => i.type === 'compensateday').length
        return item.timeList.map((i) => {
          const timeDate = `VALUE=DATE:${new Date(i.time).toFormat('YYYYMMDD')}`
          const timeT = new Date(`${i.time} 00:00:01`).toFormat()
          const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
          const time09 = new Date(`${i.time} 09:00`).toFormat()
          const time18 = new Date(`${i.time} 18:00`).toFormat()
          if (i.type === 'holiday') {
            hnum++
            // 法定休假日
            // prettier-ignore
            return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:「${item.summary} ${i.name}」 第${hnum}天/共${hsnum}天\r\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
          }
          cnum++
          // 法定补班日
          // prettier-ignore
          return `BEGIN:VEVENT\r\nDTSTART:${time09}\r\nDTEND:${time18}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:「${item.summary} ${i.name}」 第${cnum}天/共${csnum}天\r\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:TENTATIVE\r\nTRANSP:OPAQUE\r\nSEQUENCE:1\r\nBEGIN:VALARM\r\nTRIGGER:-PT60M\r\nACTION:DISPLAY\r\nEND:VALARM\r\nEND:VEVENT\r\n`
        })
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 节日
 * @returns {String} 日历数据
 */
const festivalBody = (all) => {
  let keyId = 1
  const { filePath, uName, calDesc, modified } = globalThis
  const { list } = require(join(filePath, 'ChineseFestival.js'))
  return list
    .map((item) => {
      return item.timeList.map((i) => {
        const timeDate = `VALUE=DATE:${new Date(i.time).toFormat('YYYYMMDD')}`
        const timeT = new Date(`${i.time} 00:00:01`).toFormat()
        const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${i.summary}』\r\nDESCRIPTION:${i.description}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 24节气
 * @returns {String} 日历数据
 */
const solarTermBody = (all) => {
  let keyId = 1
  const { uName, yearList, modified } = globalThis
  const { solarTerms, getSolarTerm } = solarTermData
  return yearList
    .map((year) => {
      return Array.from({ length: 24 }, (_, i) => {
        const time = `${year}/${~~(i / 2) + 1}/${getSolarTerm(year, i + 1)}`
        const name = solarTerms[i]
        const timeDate = `VALUE=DATE:${new Date(time).toFormat('YYYYMMDD')}`
        const timeT = new Date(`${time} 00:00:01`).toFormat()
        const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // prettier-ignore
        return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${name}』\r\nDESCRIPTION:${name}，${year}年第${i + 1}个节气\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 全部日历汇总
 * @returns {String} 日历数据
 */
const allBody = () => {
  return `${holidayBody(true)}${festivalBody(true)}${solarTermBody(true)}`
}

const calenderOption = {
  all: allBody,
  holiday: holidayBody,
  festival: festivalBody,
  solarTerm: solarTermBody
}

/**
 * @description: 生成各种日历数据
 * @param {}
 * @returns {Object}
 */
exports.calenderInit = () => {
  const { uName, yearList, modified, nowTime, calendarList } = globalThis
  calendarList.map((item) => {
    // item.title
    // item.key
    // prettier-ignore
    item.main = `BEGIN:VCALENDAR\r\nPRODID:-//${uName}//China Public Holidays//CN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:${item.title}\r\nX-WR-TIMEZONE:Asia/Shanghai\r\nX-WR-CALDESC:${yearList[0]}~${yearList.at( -1)}年${item.title}。更新时间：${nowTime}\r\nBEGIN:VTIMEZONE\r\nTZID:Asia/Shanghai\r\nX-LIC-LOCATION:Asia/Shanghai\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${calenderOption[item.key]()}END:VCALENDAR`
  })
  // console.log(calendarList)
}
