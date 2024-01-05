const { readdirSync } = require('fs')
const { resolve } = require('path')
const { writeReadme, writeCalendar, writeSolarTerms } = require('./models/writeFile')

globalThis.uName = 'yangh9'
globalThis.nowDate = new Date()
globalThis.nowTime = globalThis.nowDate.toFormat('YYYY-MM-DD')
globalThis.nowTimeReg = /\d{4}-\d{2}-\d{2}/
globalThis.modified = globalThis.nowDate.toFormat()
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

// 完整日历
// 节假日日历
// 节日纪念日
// 24节气
// 天干地支农历
// 勿忘国耻
const calendarList = [
  { title: '中华人民共和国节日、纪念日、假日调休、24节气、天干地支农历日历', key: 'cal' },
  { title: '中华人民共和国节假日日历', key: 'cal_holidays' },
  { title: '中华人民共和国节日纪念日日历', key: 'cal_festival' },
  { title: '中华人民共和国24节气日历', key: 'cal_solarTerms' },
  { title: '中华人民共和国农历日历', key: 'cal_lunar' },
  { title: '中华人民共和国天干地支日历', key: 'cal_stemsAndBranches' },
  { title: '中华人民共和国勿忘国耻日历', key: 'cal_neverForgetNationalShame' }
]

writeCalendar()
writeSolarTerms()
writeReadme()
