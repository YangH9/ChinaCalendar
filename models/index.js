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
 * @description: 法定节假日（时间段版本，节假日连续天数使用一个时间段
 * @returns {String} 日历数据
 */
const holiday_1_Body = (yearList, calDesc, all) => {
  let keyId = 1
  const { dataPath, uName, modified } = globalThis
  return yearList
    .map(year => {
      const { list, govUrl } = require(join(dataPath, `${year}.js`))
      return list
        .map(item => {
          let hnum = 0
          let cnum = 0
          const { hsum, csum, newList } = item.timeList.reduce(
            (total, item) => {
              const obj = {
                hsum: total.hsum + (item.type === 'holiday'),
                csum: total.csum + (item.type === 'compensateday'),
                newList: total.newList
              }
              if (obj.newList.at(-1)?.type === item.type) {
                let time = new Date(item.time) - new Date(obj.newList.at(-1).endTime)
                if (time === 24 * 60 * 60 * 1000) {
                  obj.newList.at(-1).endTime = item.time
                }
              } else {
                obj.newList.push({ ...item, endTime: item.time })
              }
              return obj
            },
            { hsum: 0, csum: 0, newList: [] }
          )
          return newList
            .map(i => {
              const { timeTS, timeTE, timeT, time09, time18 } = calendarTimeCreate(i.time)
              const { timeTS: timeTS_E, timeTE: timeTE_E, timeT: timeT_E, time09: time09_E, time18: time18_E } = calendarTimeCreate(i.endTime)
              const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
              if (i.type === 'holiday') {
                hnum++
                // 法定休假日
                // prettier-ignore
                return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE_E}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:「${item.summary} ${i.name}」 ${time09 === time09_E ? `第${hnum}天/` : ''}共${hsum}天\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
              }
              cnum++
              // 法定补班日
              // prettier-ignore
              return `BEGIN:VEVENT\nDTSTART:${time09}\nDTEND:${time18_E}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:「${item.summary} ${i.name}」 ${time09 === time09_E ? `第${cnum}天/` : ''}共${csum}天\nDESCRIPTION:${item.description}\\n\\n放假通知：${govUrl}\\n\\n${calDesc}\nSTATUS:TENTATIVE\nTRANSP:OPAQUE\nSEQUENCE:1\nBEGIN:VALARM\nTRIGGER:-PT60M\nACTION:DISPLAY\nEND:VALARM\nEND:VEVENT\n`
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
      // 冬至日，数九天
      const dongzhi = dayjs(`${year - 1}/${12}/${getSolarTerm(year - 1, 24)}`)
      const shujiu = ['冬一九', '冬二九', '冬三九', '冬四九', '冬五九', '冬六九', '冬七九', '冬八九', '冬九九']
      // 三伏天，夏至、立秋
      const gan = ['', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己', '庚']
      const xiazhi = dayjs(`${year}/${6}/${getSolarTerm(year, 12)}`)
      const liqiu = dayjs(`${year}/${8}/${getSolarTerm(year, 15)}`)
      const xiazhiGz = 10 - gan.indexOf(solarToLunar(xiazhi.year(), xiazhi.month() + 1, xiazhi.date()).gzDay[0])
      const liqiuGz = 10 - gan.indexOf(solarToLunar(liqiu.year(), liqiu.month() + 1, liqiu.date()).gzDay[0])
      return (
        list(year)
          .map(i => {
            const { timeTS, timeTE, timeT } = calendarTimeCreate(i.time)
            const UID = `${timeT}_${i.type}_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
            return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:『${i.summary}』\nDESCRIPTION:${i.description}\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
          })
          .join('') +
        Array.from({ length: 9 }, (_, i) => {
          const startDate = dongzhi.add(i * 9, 'day')
          const endDate = dongzhi.add(i * 9 + 8, 'day')
          const { timeTS, timeT } = calendarTimeCreate(startDate)
          const { timeTE: timeTE_E } = calendarTimeCreate(endDate)
          const summary = `『${shujiu[i]}』${startDate.format('M月D')}~${endDate.format('M月D')}`
          const description = `${shujiu[i]}，数九天，${startDate.format('YYYY年MM月DD日')}~${endDate.format('YYYY年MM月DD日')}。\\n`
          const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
          // prettier-ignore
          return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE_E}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:${summary}\nDESCRIPTION:${description}“数九”的正确算法是从冬至后第一个壬日算起，故，“九”在每个年份中具体日期是不固定的，须视冬至后第一个壬日在哪一天而定。另有认为“数九”是从冬至这天算起的，从冬至这天算起那么每年“九”的具体时间是固定的，每个“九”都固定在冬至后第9天、第18天、第27天…。“数九”从冬至这天算起的算法是不太准确的。\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
        }).join('') +
        (() => {
          // 三伏天
          // 夏至后第三个庚日为初伏，第四个庚日为中伏，立秋后的第一个庚日为末伏。
          return (
            (() => {
              // 初伏
              const startDate = xiazhi.add(xiazhiGz + 20, 'day')
              const endDate = xiazhi.add(xiazhiGz + 30 - 1, 'day')
              const { timeTS, timeT } = calendarTimeCreate(startDate)
              const { timeTE: timeTE_E } = calendarTimeCreate(endDate)
              const summary = `『初伏』${startDate.format('M月D')}~${endDate.format('M月D')}`
              const description = `初伏，${startDate.format('YYYY年MM月DD日')}~${endDate.format('YYYY年MM月DD日')}。\\n`
              const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
              // prettier-ignore
              return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE_E}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:${summary}\nDESCRIPTION:${description}初伏，是“三伏”之第一伏。其日期从夏至后的第三个庚日起，至夏至后第四个庚前一天这段时间。因为每个庚日之间相隔10天，所以初伏时间是10天。\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
            })() +
            (() => {
              // 中伏
              const startDate = xiazhi.add(xiazhiGz + 30, 'day')
              const endDate = liqiu.add(liqiuGz - 1, 'day')
              const { timeTS, timeT } = calendarTimeCreate(startDate)
              const { timeTE: timeTE_E } = calendarTimeCreate(endDate)
              const summary = `『中伏』${startDate.format('M月D')}~${endDate.format('M月D')}`
              const description = `中伏，${startDate.format('YYYY年MM月DD日')}~${endDate.format('YYYY年MM月DD日')}。\\n`
              const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
              // prettier-ignore
              return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE_E}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:${summary}\nDESCRIPTION:${description}中伏，“三伏”之第二伏，即夏至后的第四个庚日起始，至立秋后第一个庚日这段时间。中伏的天数有长有短，可能是10天，也可能是20天，这取决于每年夏至节气后第3个庚日（初伏）出现日期的迟早。\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
            })() +
            (() => {
              // 末伏
              const startDate = liqiu.add(liqiuGz, 'day')
              const endDate = liqiu.add(liqiuGz + 10 - 1, 'day')
              const { timeTS, timeT } = calendarTimeCreate(startDate)
              const { timeTE: timeTE_E } = calendarTimeCreate(endDate)
              const summary = `『末伏』${startDate.format('M月D')}~${endDate.format('M月D')}`
              const description = `末伏${startDate.format('YYYY年MM月DD日')}~${endDate.format('YYYY年MM月DD日')}。\\n`
              const UID = `${timeT}_solarTerm_${all ? `all_${AllKeyId++}` : keyId++}@${uName}`
              // prettier-ignore
              return `BEGIN:VEVENT\nDTSTART;${timeTS}\nDTEND;${timeTE_E}\nUID:${UID}\nCREATED:${timeT}\nLAST-MODIFIED:${modified}\nSUMMARY:${summary}\nDESCRIPTION:${description}末伏，“三伏”之第三伏，是指立秋后第一个庚日至立秋后第二个庚日前一天这时段，共10天。末伏是三伏天中的最后一伏，俗称秋老虎。末伏早晚较凉快，白天阳光依然剧烈。\\n\\n${calDesc}\nSTATUS:CONFIRMED\nTRANSP:TRANSPARENT\nSEQUENCE:1\nEND:VEVENT\n`
            })()
          )
        })()
      )
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

/**
 * @description: 全部日历汇总(时间段版本)
 * @returns {String} 日历数据
 */
const all_1Body = (year, calDesc) => {
  return `${holiday_1_Body(year, calDesc, true)}${festivalBody(year, calDesc, true)}${solarTermBody(year, calDesc, true)}`
}

const calendarOption = {
  all: allBody,
  holiday: holidayBody,
  all_1: all_1Body,
  holiday_1: holiday_1_Body,
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
    calendarList.forEach(item => {
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
