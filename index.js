const fs = require('fs')
const path = require('path')
const { listFormat } = require('./models')
const { writeReadme } = require('./models/writeFile')

globalThis.uName = 'yangh9'
globalThis.nowDate = new Date()
globalThis.nowTime = globalThis.nowDate.toFormat('YYYY-MM-DD hh:mm')
globalThis.nowTimeReg = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
globalThis.modified = globalThis.nowDate.toFormat()
globalThis.calName = '中国节日、纪念日、假日日历'
globalThis.calDesc = `2020~2023年中国人民共和国节日、纪念日和假日调休、补班日历。更新时间：${globalThis.nowTime}`
globalThis.yearList = []

const filePath = path.resolve('data')

// 读取生成部分数据
let min = 0
let max = 0
fs.readdirSync(filePath).map((fileName) => {
  let num = parseInt(fileName)
  if (!isNaN(num)) {
    min = !min ? num : min < num ? min : num
    max = !max ? num : max > num ? max : num
    globalThis.yearList.push(num)
  }
})
globalThis.calDesc = globalThis.calDesc
  .replace(/\d{4}~\d{4}/, `${min}~${max}`)
  .replace(globalThis.nowTimeReg, globalThis.nowTime)
globalThis.yearList.push(globalThis.yearList.at(-1) + 1)

const body = fs
  .readdirSync(filePath)
  .map((fileName) => {
    if (/.js$/i.test(fileName)) {
      const fileDir = path.join(filePath, fileName)
      const model = require(fileDir)
      return listFormat(model.list, model.govUrl)
    } else {
      return ''
    }
  })
  .reverse()
  .join('')

const main = `BEGIN:VCALENDAR\r\nPRODID:-//${globalThis.uName}//China Public Holidays//CN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:${globalThis.calName}\r\nX-WR-TIMEZONE:Asia/Shanghai\r\nX-WR-CALDESC:${globalThis.calDesc}\r\nBEGIN:VTIMEZONE\r\nTZID:Asia/Shanghai\r\nX-LIC-LOCATION:Asia/Shanghai\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${body}END:VCALENDAR`

// 写入文件
fs.writeFileSync(path.join(path.resolve('docs'), 'cal.ics'), main)

writeReadme()
