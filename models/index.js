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
const holidayBody = (yearList, calDesc, all) => {
  let keyId = 1
  const { filePath, uName, modified } = globalThis
  return yearList
    .map(year => {
      const { list, govUrl } = require(join(filePath, `${year}.js`))
      return list
        .map(item => {
          let hnum = 0
          let cnum = 0
          const { hsum, csum } = item.timeList.reduce(
            (total, item) => ({
              hsum: total.hsum + (item.type === 'holiday'),
              csum: total.csum + (item.type === 'compensateday')
            }),
            { hsum: 0, csum: 0 }
          )
          return item.timeList
            .map(i => {
              const { timeTS, timeTE, timeT, time09, time18 } = calendarTimeCreate(i.time)
              const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
              if (i.type === 'holiday') {
                hnum++
                // 法定休假日
                // prettier-ignore
                return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:「${item.summary} ${i.name}」 第${hnum}天/共${hsum}天\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
              }
              cnum++
              // 法定补班日
              // prettier-ignore
              return `BEGIN:VEVENT\nDTSTART:${time09}\nDTEND:${time18}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:「${item.summary} ${i.name}」 第${cnum}天/共${csum}天\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\nSTATUS:TENTATIVE\nTRANSP:OPAQUE\nSEQUENCE:1\nBEGIN:VALARM\nTRIGGER:-PT60M\nACTION:DISPLAY\nEND:VALARM\nEND:VEVENT\n`
            })
            .join('')
        })
        .join('')
    })
    .join('')
}

/**
 * @description: 节日
 * @returns {String} 日历数据
 */
const festivalBody = (yearList, calDesc, all) => {
  let keyId = 1
  const { filePath, uName, modified } = globalThis
  const { list } = require(join(filePath, 'ChineseFestival.js'))
  return yearList
    .map(year => {
      return list(year)
        .map(i => {
          const { timeTS, timeTE, timeT } = calendarTimeCreate(i.time)
          const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
          return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:『${i.summary}』\nDESCRIPTION:${i.description}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
        })
        .join('')
    })
    .join('')
}

/**
 * @description: 二十四节气
 * @returns {String} 日历数据
 */
const solarTermBody = (yearList, calDesc, all) => {
  let keyId = 1
  const { uName, modified } = globalThis
  return yearList
    .map(year => {
      return Array.from({ length: 24 }, (_, i) => {
        const { timeTS, timeTE, timeT } = calendarTimeCreate(`${year}/${~~(i / 2) + 1}/${getSolarTerm(year, i + 1)}`)
        const summary = solarTerms[i]
        const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // prettier-ignore
        return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:『${summary}』\nDESCRIPTION:${summary}，${year}年第${i + 1}个节气\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
      }).join('')
    })
    .join('')
}

// 黄道吉日 auspiciousday
// https://lunisolar.js.org/
const auspiciousDay = (yearList, calDesc, all) => {
  let keyId = 1
  const { uName, modified } = globalThis
  return [yearList[0]]
    .map(i => {
      let item = dayjs().year(i).startOf('year')
      return Array.from({ length: 12 + item.isLeapYear() }, (_, index) => {
        const time = item.add(index, 'day')
        const { timeTS, timeTE, timeT } = calendarTimeCreate(time.format('YYYYMMDD'))
        const lunarData = solarToLunar(time.year(), time.month() + 1, time.date())
        const summary = `${lunarData.IMonthCn} ${lunarData.IDayCn} ${lunarData.lYear}年`
        const location = `${lunarData.gzYear} ${lunarData.Animal}年 ${lunarData.gzMonth}月 ${lunarData.gzDay}日`
        const description = `${lunarData.lYear}年 ${lunarData.IMonthCn} ${lunarData.IDayCn}`
        const solarDate = time.format('日期：YYYY年MM月DD日')
        const UID = `${timeT}_lunar_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
        // console.log(lunarData)
        // 子日青龙，丑日明堂
        // 寅日天刑，卯日朱雀
        // 辰日金匮，巳日天德
        // 午日白虎，未日玉堂
        // 申日天牢，酉日玄武
        // 戌日司命，亥日勾陈

        // 青龙，天德，玉堂，司命，明堂，金匮      黄道吉日

        // 农历 八月初七
        // 甲辰 [龙] 年
        // 癸酉月 丙子日
        // 宜：沐浴 入殓 移柩 除服 成服 破土 平治道涂
        // 忌：嫁娶 移徙 入宅 开市

        // prettier-ignore
        // return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:『${summary}』\nLOCATION:${location}\nDESCRIPTION:${description}\\n${location}\\n${solarDate}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
      })
    })
    .flat()
    .join('')
}

/**
 * @description: 农历
 * @returns {String} 日历数据
 */
const lunarBody = (yearList, calDesc, all) => {
  let keyId = 1
  const { nowDate, uName, modified } = globalThis
  return yearList
    .map(year => {
      let item = dayjs().year(year).startOf('year')
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
        return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:『${summary}』\nLOCATION:${location}\nDESCRIPTION:${description}\\n${location}\\n${solarDate}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
      }).join('')
    })
    .join('')
}

/**
 * @description: 天干地支、生辰八字
 * @returns {String} 日历数据
 */
const trunkBranchBody = (yearList, calDesc, all) => {
  let keyId = 1
  const { uName, modified } = globalThis
  return yearList
    .map(year => {
      let item = dayjs().year(year).startOf('year')
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
          return `BEGIN:VEVENT\nDTSTART:${timeStart}\nDTEND:${timeEnd}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:『${summary}』\nLOCATION:${location}\nDESCRIPTION:${description}\\n${location}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
        }).join('')
      }).join('')
    })
    .join('')
}

/**
 * @description: 全部日历汇总
 * @returns {String} 日历数据
 */
const allBody = (year, calDesc) => {
  return `${holidayBody(year, calDesc, true)}${festivalBody(year, calDesc, true)}${solarTermBody(year, calDesc, true)}`
}

const calendarOption = {
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
exports.calendarInit = () => {
  const { uName, yearList, nowTime, calendarList } = globalThis
  calendarList.map(item => {
    const calDesc = `${yearList.at(-2)}~${yearList.at(-1)}年${item.title}。更新时间：${nowTime}`
    // prettier-ignore
    item.main = `BEGIN:VCALENDAR\nPRODID:-//${uName}//China Calendar//CN\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:${item.title}\nX-WR-TIMEZONE:Asia/Shanghai\nX-WR-CALDESC:${calDesc}\nBEGIN:VTIMEZONE\nTZID:Asia/Shanghai\nX-LIC-LOCATION:Asia/Shanghai\nBEGIN:STANDARD\nTZOFFSETFROM:+0800\nTZOFFSETTO:+0800\nTZNAME:CST\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\n${calendarOption[item.key](yearList.slice(-2), calDesc)}END:VCALENDAR`
  })
  // auspiciousDay()
}

/**
 * @description: 写入日历文件
 */
exports.writeCalendar = () => {
  const { calendarList, nowTimeReg, nowTime } = globalThis

  calendarList.forEach(item => {
    writeFileSync(join(resolve('submodule-branch-pages'), item.file), item.main)
  })

  const writePathList = [join(resolve('README.md')), join(resolve('submodule-branch-pages'), 'README.md'), join(resolve('submodule-branch-pages'), 'index.html')]
  writePathList.forEach(path => {
    const data = readFileSync(path, 'utf-8').replace(nowTimeReg, nowTime)
    writeFileSync(path, data)
  })
}
