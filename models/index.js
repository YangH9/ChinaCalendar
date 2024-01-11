const dayjs = require('dayjs')
const isLeapYear = require('dayjs/plugin/isLeapYear')
const { writeFileSync, readFileSync } = require('fs')
const { join, resolve } = require('path')
const { solarToLunar, getSolarTerm, solarTerms } = require('./calendar')

dayjs.extend(isLeapYear)

const calendarTimeCreate = (time) => {
  const itemTime = dayjs(time)
  return {
    timeDate: `VALUE=DATE:${itemTime.format('YYYYMMDD')}`,
    timeT: itemTime.second(1).format('YYYYMMDDTHHmmss'),
    time09: itemTime.hour(9).format('YYYYMMDDTHHmmss'),
    time18: itemTime.hour(18).format('YYYYMMDDTHHmmss')
  }
}

let AllKeyId = 1

/**
 * @description: 法定节假日
 * @returns {String} 日历数据
 */
const holidayBody = (calDesc, all) => {
  let keyId = 1
  const { yearList, filePath, uName, modified } = globalThis
  return yearList
    .slice(0, -1)
    .map((year) => {
      const { list, govUrl } = require(join(filePath, `${year}.js`))
      return list.map((item) => {
        let hnum = 0
        let cnum = 0
        const { hsum, csum } = item.timeList.reduce(
          (total, item) => ({
            hsum: total.hsum + (item.type === 'holiday'),
            csum: total.csum + (item.type === 'compensateday')
          }),
          { hsum: 0, csum: 0 }
        )
        return item.timeList.map((i) => {
          const { timeDate, timeT, time09, time18 } = calendarTimeCreate(i.time)
          const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
          if (i.type === 'holiday') {
            hnum++
            // 法定休假日
            // prettier-ignore
            return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:「${item.summary} ${i.name}」 第${hnum}天/共${hsum}天\r\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
          }
          cnum++
          // 法定补班日
          // prettier-ignore
          return `BEGIN:VEVENT\r\nDTSTART:${time09}\r\nDTEND:${time18}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:「${item.summary} ${i.name}」 第${cnum}天/共${csum}天\r\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:TENTATIVE\r\nTRANSP:OPAQUE\r\nSEQUENCE:1\r\nBEGIN:VALARM\r\nTRIGGER:-PT60M\r\nACTION:DISPLAY\r\nEND:VALARM\r\nEND:VEVENT\r\n`
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
const festivalBody = (calDesc, all) => {
  let keyId = 1
  const { filePath, uName, yearList, modified } = globalThis
  const { list } = require(join(filePath, 'ChineseFestival.js'))
  return yearList
    .map((year) => {
      return list(year).map((i) => {
        const { timeDate, timeT } = calendarTimeCreate(i.time)
        const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${i.summary}』\r\nDESCRIPTION:${i.description}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 二十四节气
 * @returns {String} 日历数据
 */
const solarTermBody = (calDesc, all) => {
  let keyId = 1
  const { uName, yearList, modified } = globalThis
  return yearList
    .map((year) => {
      return Array.from({ length: 24 }, (_, i) => {
        const { timeDate, timeT } = calendarTimeCreate(`${year}/${~~(i / 2) + 1}/${getSolarTerm(year, i + 1)}`)
        const summary = solarTerms[i]
        const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // prettier-ignore
        return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${summary}』\r\nDESCRIPTION:${summary}，${year}年第${i + 1}个节气\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 农历
 * @returns {String} 日历数据
 */
const lunarBody = (calDesc, all) => {
  let keyId = 1
  const { uName, yearList, modified } = globalThis
  return yearList
    .map((i) => {
      let item = dayjs().year(i).startOf('year')
      return Array.from({ length: 365 + item.isLeapYear() }, (_, index) => {
        const time = item.add(index, 'day')
        const { timeDate, timeT } = calendarTimeCreate(time.format('YYYYMMDD'))
        const timeData = solarToLunar(time.year(), time.month() + 1, time.date())
        const summary = `${timeData.lYear}年 ${timeData.IMonthCn} ${timeData.IDayCn}`
        const location = `${timeData.gzYear} ${timeData.Animal}年 ${timeData.gzMonth}月 ${timeData.gzDay}日`
        const UID = `${timeT}_lunar_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // prettier-ignore
        return `BEGIN:VEVENT\r\nDTSTART;${timeDate}\r\nDTEND;${timeDate}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${summary}』\r\nLOCATION:「${location}」\r\nDESCRIPTION:${summary}\\n${location}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 全部日历汇总
 * @returns {String} 日历数据
 */
const allBody = (calDesc) => {
  return `${holidayBody(calDesc, true)}${festivalBody(calDesc, true)}${solarTermBody(calDesc, true)}`
}

const calenderOption = {
  all: allBody,
  holiday: holidayBody,
  festival: festivalBody,
  solarTerm: solarTermBody,
  lunar: lunarBody
}

/**
 * @description: 生成各种日历数据
 * @param {}
 * @returns {Object}
 */
exports.calenderInit = () => {
  const { uName, yearList, nowTime, calendarList } = globalThis
  calendarList.map((item) => {
    const calDesc = `${yearList[0]}~${yearList.at(-1)}年${item.title}。更新时间：${nowTime}`
    // prettier-ignore
    item.main = `BEGIN:VCALENDAR\r\nPRODID:-//${uName}//China Public Holidays//CN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:${item.title}\r\nX-WR-TIMEZONE:Asia/Shanghai\r\nX-WR-CALDESC:${calDesc}\r\nBEGIN:VTIMEZONE\r\nTZID:Asia/Shanghai\r\nX-LIC-LOCATION:Asia/Shanghai\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${calenderOption[item.key](calDesc)}END:VCALENDAR`
  })
  lunarBody()
}

/**
 * @description: 写入日历文件
 */
exports.writeCalendar = () => {
  const { calendarList, nowTimeReg, nowTime } = globalThis

  calendarList.forEach((item) => {
    writeFileSync(join(resolve('docs'), item.file), item.main)
  })

  const writePathList = [join(resolve('README.md')), join(resolve('docs'), 'index.html')]
  writePathList.forEach((path) => {
    const data = readFileSync(path, 'utf-8').replace(nowTimeReg, nowTime)
    writeFileSync(path, data)
  })
}
