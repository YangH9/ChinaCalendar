const { readdirSync } = require('fs')
const { resolve } = require('path')
const { calenderInit, writeCalendar } = require('./models')
const dayjs = require('dayjs')

globalThis.uName = 'yangh9'
globalThis.nowDate = dayjs()
globalThis.nowTime = globalThis.nowDate.format('YYYY-MM-DD')
globalThis.nowTimeReg = /\d{4}-\d{2}-\d{2}/
globalThis.modified = globalThis.nowDate.format('YYYYMMDDTHHmmss')
globalThis.yearList = []
globalThis.filePath = resolve('data')

// 读取生成部分数据
let min = 0
let max = 0
readdirSync(globalThis.filePath).forEach((fileName) => {
  let num = parseInt(fileName)
  if (!isNaN(num)) {
    min = !min ? num : min < num ? min : num
    max = !max ? num : max > num ? max : num
    globalThis.yearList.push(num)
  }
})
globalThis.yearList.push(globalThis.yearList.at(-1) + 1)
// prettier-ignore
globalThis.calDesc = `${globalThis.yearList[0]}~${globalThis.yearList.at( -1)}年中华人民共和国节日、纪念日和假日调休、补班日历。更新时间：${globalThis.nowTime}`

globalThis.calendarList = [
  { title: '中华人民共和国节日、纪念日、假日调休、二十四节气、农历天干地支日历', key: 'all', file: 'calender.ics' },
  { title: '中华人民共和国节假日日历', key: 'holiday', file: 'cal_holiday.ics' },
  { title: '中华人民共和国节日纪念日日历', key: 'festival', file: 'cal_festival.ics' },
  { title: '中华人民共和国二十四节气日历', key: 'solarTerm', file: 'cal_solarTerm.ics' },
  { title: '中华人民共和国农历、天干地支日历', key: 'lunar', file: 'cal_lunar.ics' },
  { title: '中华人民共和国天干地支八字日历', key: 'trunkBranch', file: 'cal_trunkBranch.ics' }
  // ,{ title: '中华人民共和国勿忘国耻日历', key: 'nationalShame', file: 'cal_nationalShame.ics' }
]

calenderInit()
writeCalendar()
