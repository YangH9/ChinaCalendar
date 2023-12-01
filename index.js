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
globalThis.calDesc = `${globalThis.yearList[0]}~${globalThis.yearList.at( -1)}年中国人民共和国节日、纪念日和假日调休、补班日历。更新时间：${globalThis.nowTime}`

writeCalendar()
writeSolarTerms()
writeReadme()
