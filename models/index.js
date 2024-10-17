const dayjs = require('dayjs')
const isLeapYear = require('dayjs/plugin/isLeapYear')
const { writeFileSync, readFileSync, existsSync, mkdirSync } = require('fs')
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
  const { dataPath, uName, modified } = globalThis
  return yearList
    .map(year => {
      const { list, govUrl } = require(join(dataPath, `${year}.js`))
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
  const { dataPath, uName, modified } = globalThis
  const { list } = require(join(dataPath, 'ChineseFestival.js'))
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

/**
 * @description: 农历
 * @returns {String} 日历数据
 */
const lunarBody = (yearList, calDesc, all) => {
  let keyId = 1
  const { uName, modified } = globalThis
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
exports.calendarGenerate = () => {
  const calendarPath = resolve('submodule-branch-pages')
  const historyPath = resolve('submodule-store-calendar')
  const { uName, yearList, nowTime, calendarList } = globalThis
  // 正常订阅日历，两年时间范围
  ;(() => {
    calendarList.forEach(item => {
      const calDesc = `${yearList.at(-2)}~${yearList.at(-1)}年${item.title}。更新时间：${nowTime}`
      // prettier-ignore
      const calText = `BEGIN:VCALENDAR\nPRODID:-//${uName}//China Calendar//CN\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:${item.title}\nX-WR-TIMEZONE:Asia/Shanghai\nX-WR-CALDESC:${calDesc}\nBEGIN:VTIMEZONE\nTZID:Asia/Shanghai\nX-LIC-LOCATION:Asia/Shanghai\nBEGIN:STANDARD\nTZOFFSETFROM:+0800\nTZOFFSETTO:+0800\nTZNAME:CST\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\n${calendarOption[item.key](yearList.slice(-2), calDesc)}END:VCALENDAR`
      writeFileSync(join(calendarPath, item.file), calText)
    })
  })()

  // 历史年份日历
  ;(() => {
    calendarList
      .filter(i => i.key !== 'all')
      .forEach(item => {
        yearList.slice(0, -1).forEach(year => {
          const calDesc = `${year}年${item.title}。更新时间：${nowTime}`
          // prettier-ignore
          const calText = `BEGIN:VCALENDAR\nPRODID:-//${uName}//China Calendar//CN\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:${item.title}\nX-WR-TIMEZONE:Asia/Shanghai\nX-WR-CALDESC:${calDesc}\nBEGIN:VTIMEZONE\nTZID:Asia/Shanghai\nX-LIC-LOCATION:Asia/Shanghai\nBEGIN:STANDARD\nTZOFFSETFROM:+0800\nTZOFFSETTO:+0800\nTZNAME:CST\nDTSTART:19700101T000000\nEND:STANDARD\nEND:VTIMEZONE\n${calendarOption[item.key]([year], calDesc)}END:VCALENDAR`
          !existsSync(join(historyPath, item.key)) && mkdirSync(join(historyPath, item.key), { recursive: true })
          writeFileSync(join(historyPath, item.key, `${year}.ics`), calText)
        })
        writeFileSync(join(historyPath, item.key, item.title), '')
      })
  })()

  // 历史日历列表
  ;(() => {
    const historyCalendarReg = /<!-- \[calendar list start\] -->[\s\S]*<!-- \[calendar list end\] -->/
    const calendarListText = `<!-- [calendar list start] -->\n${calendarList
      .filter(i => i.key !== 'all')
      .map(
        item =>
          `#### ${item.title}\n${yearList
            .slice(0, -1)
            .map(year => `* [${year}年](./${item.key}/${year}.ics)`)
            .join('\n')}`
      )
      .join('\n')}\n<!-- [calendar list end] -->`
    const data = readFileSync(join(historyPath, 'README.md'), 'utf-8').replace(historyCalendarReg, calendarListText)
    writeFileSync(join(historyPath, 'README.md'), data)
  })()

  // 修改介绍文件的 更新时间
  ;(() => {
    const writePathList = [join(resolve('README.md')), join(calendarPath, 'README.md'), join(historyPath, 'README.md'), join(calendarPath, 'index.html')]
    const nowTimeReg = /<!-- \[update time start\] -->(.|\n|\r)*<!-- \[update time end\] -->/
    writePathList.forEach(path => {
      const nowTimeText = `<!-- [update time start] -->更新时间：${nowTime}<!-- [update time end] -->`
      const data = readFileSync(path, 'utf-8').replace(nowTimeReg, nowTimeText)
      writeFileSync(path, data)
    })
  })()
}
