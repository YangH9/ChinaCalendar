const { readdirSync } = require('fs')
const { resolve } = require('path')
const { calendarGenerate } = require('./models')
const dayjs = require('dayjs')

globalThis.uName = 'YangH9'
globalThis.nowDate = dayjs()
globalThis.nowTime = globalThis.nowDate.format('YYYY-MM-DD')
globalThis.modified = globalThis.nowDate.format('YYYYMMDDTHHmmss')
globalThis.yearList = []
globalThis.dataPath = resolve('data')

// 读取生成部分数据
let min = 0
let max = 0
readdirSync(globalThis.dataPath).forEach(fileName => {
  let num = parseInt(fileName)
  if (!isNaN(num)) {
    min = !min ? num : min < num ? min : num
    max = !max ? num : max > num ? max : num
    globalThis.yearList.push(num)
  }
})

globalThis.calendarList = [
  { title: '中华人民共和国节日、纪念日、法定节假日调休补班、二十四节气、农历天干地支日历', key: 'all', file: 'calendar.ics' },
  { title: '中华人民共和国法定节假日调休补班日历', key: 'holiday', file: 'cal_holiday.ics' },
  { title: '中华人民共和国节日纪念日日历', key: 'festival', file: 'cal_festival.ics' },
  { title: '中华人民共和国二十四节气日历', key: 'solarTerm', file: 'cal_solarTerm.ics' },
  { title: '中华人民共和国农历、天干地支日历', key: 'lunar', file: 'cal_lunar.ics' },
  { title: '中华人民共和国天干地支、生辰八字日历', key: 'trunkBranch', file: 'cal_trunkBranch.ics' }
]

calendarGenerate()
