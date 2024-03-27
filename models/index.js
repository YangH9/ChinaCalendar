const dayjs = require('dayjs')
const isLeapYear = require('dayjs/plugin/isLeapYear')
const { writeFileSync, readFileSync } = require('fs')
const { join, resolve } = require('path')
const { solarToLunar, getSolarTerm, solarTerms, ganList, zhiList } = require('./calendar')

dayjs.extend(isLeapYear)

const calendarTimeCreate = time => {
  const itemTime = dayjs(time)
  return {
    timeDate: `VALUE=DATE:${itemTime.format('YYYYMMDD')}`,
    timeTS: `VALUE=DATE:${itemTime.format('YYYYMMDD')}`,
    timeTE: `VALUE=DATE:${itemTime.add(1, 'day').format('YYYYMMDD')}`,
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
    .map(year => {
      const { list, govUrl } = require(join(filePath, `${year}.js`))
      return list.map(item => {
        let hnum = 0
        let cnum = 0
        const { hsum, csum } = item.timeList.reduce(
          (total, item) => ({
            hsum: total.hsum + (item.type === 'holiday'),
            csum: total.csum + (item.type === 'compensateday')
          }),
          { hsum: 0, csum: 0 }
        )
        return item.timeList.map(i => {
          const { timeTS, timeTE, timeT, time09, time18 } = calendarTimeCreate(i.time)
          const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
          if (i.type === 'holiday') {
            hnum++
            // 法定休假日
            // prettier-ignore
            return `BEGIN:VEVENT\r\nDTSTART;${timeTS}\r\nDTEND;${timeTE}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:「${item.summary} ${i.name}」 第${hnum}天/共${hsum}天\r\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
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
    .map(year => {
      return list(year).map(i => {
        const { timeTS, timeTE, timeT } = calendarTimeCreate(i.time)
        const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        return `BEGIN:VEVENT\r\nDTSTART;${timeTS}\r\nDTEND;${timeTE}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${i.summary}』\r\nDESCRIPTION:${i.description}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat()
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
    .map(year => {
      return Array.from({ length: 24 }, (_, i) => {
        const { timeTS, timeTE, timeT } = calendarTimeCreate(`${year}/${~~(i / 2) + 1}/${getSolarTerm(year, i + 1)}`)
        const summary = solarTerms[i]
        const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // prettier-ignore
        return `BEGIN:VEVENT\r\nDTSTART;${timeTS}\r\nDTEND;${timeTE}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${summary}』\r\nDESCRIPTION:${summary}，${year}年第${i + 1}个节气\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat()
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
    .map(i => {
      let item = dayjs().year(i).startOf('year')
      return Array.from({ length: 365 + item.isLeapYear() }, (_, index) => {
        const time = item.add(index, 'day')
        const { timeTS, timeTE, timeT } = calendarTimeCreate(time.format('YYYYMMDD'))
        const lunarData = solarToLunar(time.year(), time.month() + 1, time.date())
        const summary = `${lunarData.IMonthCn} ${lunarData.IDayCn} ${lunarData.lYear}年`
        const location = `${lunarData.gzYear} ${lunarData.Animal}年 ${lunarData.gzMonth}月 ${lunarData.gzDay}日`
        const description = `${lunarData.lYear}年 ${lunarData.IMonthCn} ${lunarData.IDayCn}`
        const solarDate = time.format('日期：YYYY年MM月DD日')
        const UID = `${timeT}_lunar_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // prettier-ignore
        return `BEGIN:VEVENT\r\nDTSTART;${timeTS}\r\nDTEND;${timeTE}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${summary}』\r\nLOCATION:${location}\r\nDESCRIPTION:${description}\\n${location}\\n${solarDate}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
      })
    })
    .flat()
    .join('')
}

/**
 * @description: 天干地支、生辰八字
 * @returns {String} 日历数据
 */
const trunkBranchBody = (calDesc, all) => {
  let keyId = 1
  const { uName, yearList, modified } = globalThis
  return yearList
    .slice(-2)
    .map(i => {
      let item = dayjs().year(i).startOf('year')
      return Array.from({ length: 365 + item.isLeapYear() }, (_, index) => {
        const time = item.add(index, 'day')
        const lunarData = solarToLunar(time.year(), time.month() + 1, time.date())
        const ganIndex = ganList.findIndex(i => i === lunarData.gzDay.slice(0, 1))
        return Array.from({ length: 12 }, (_, index) => {
          const start = time.add(index * 2 - 1, 'hour')
          const ganzhi = `${ganList[(ganIndex * 2 + index) % 10]}${zhiList[index]}`
          const timeT = start.second(1).format('YYYYMMDDTHHmmss')
          const timeStart = start.format('YYYYMMDDTHHmmss')
          const timeEnd = start.add(1, 'hour').endOf('hour').format('YYYYMMDDTHHmmss')
          const summary = `${ganzhi}时 ${lunarData.gzDay}日 ${lunarData.gzMonth}月 ${lunarData.gzYear}${lunarData.Animal}年`
          const location = `${lunarData.gzYear} ${lunarData.gzMonth} ${lunarData.gzDay} ${ganzhi}`
          const description = `${lunarData.gzYear}${lunarData.Animal}年 ${lunarData.gzMonth}月 ${lunarData.gzDay}日 ${ganzhi}时`
          const UID = `${timeT}_ganzhi_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
          // prettier-ignore
          return `BEGIN:VEVENT\r\nDTSTART:${timeStart}\r\nDTEND:${timeEnd}\r\nDTSTAMP:${timeT}\r\nUID:${UID}\r\nCREATED:${timeT}\r\nSUMMARY:『${summary}』\r\nLOCATION:${location}\r\nDESCRIPTION:${description}\\n${location}\\n\\n${calDesc}\r\nLAST-MODIFIED:${modified}\r\nSTATUS:CONFIRMED\r\nTRANSP:TRANSPARENT\r\nSEQUENCE:1\r\nEND:VEVENT\r\n`
        })
      })
    })
    .flat(2)
    .join('')
}

/**
 * @description: 全部日历汇总
 * @returns {String} 日历数据
 */
const allBody = calDesc => {
  return `${holidayBody(calDesc, true)}${festivalBody(calDesc, true)}${solarTermBody(calDesc, true)}`
}

const calenderOption = {
  all: allBody,
  holiday: holidayBody,
  festival: festivalBody,
  solarTerm: solarTermBody,
  lunar: lunarBody,
  trunkBranch: trunkBranchBody
}

/**
 * @description: 生成各种日历数据
 * @param {}
 * @returns {Object}
 */
exports.calenderInit = () => {
  const { uName, yearList, nowTime, calendarList } = globalThis
  calendarList.map(item => {
    const calDesc = `${yearList[0]}~${yearList.at(-1)}年${item.title}。更新时间：${nowTime}`
    // prettier-ignore
    item.main = `BEGIN:VCALENDAR\r\nPRODID:-//${uName}//China Public Holidays//CN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:${item.title}\r\nX-WR-TIMEZONE:Asia/Shanghai\r\nX-WR-CALDESC:${calDesc}\r\nBEGIN:VTIMEZONE\r\nTZID:Asia/Shanghai\r\nX-LIC-LOCATION:Asia/Shanghai\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${calenderOption[item.key](calDesc)}END:VCALENDAR`
  })
  trunkBranchBody()
}

/**
 * @description: 写入日历文件
 */
exports.writeCalendar = () => {
  const { calendarList, nowTimeReg, nowTime } = globalThis

  calendarList.forEach(item => {
    writeFileSync(join(resolve('docs'), item.file), item.main)
  })

  const writePathList = [join(resolve('README.md')), join(resolve('docs'), 'index.html')]
  writePathList.forEach(path => {
    const data = readFileSync(path, 'utf-8').replace(nowTimeReg, nowTime)
    writeFileSync(path, data)
  })
}
