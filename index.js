const fs = require('fs')
const path = require('path')
const { listFormat } = require('./models')

globalThis.uName = 'yangh9'
globalThis.nowDate = new Date()
globalThis.nowTime = globalThis.nowDate.toFormat('yyyy-MM-dd hh:mm:ss')
globalThis.modified = globalThis.nowDate.toFormat()
globalThis.calName = '中国节日、节假日日历'
globalThis.calDesc = `2020~2023年中国放假、调休和补班日历 更新时间 ${globalThis.nowTime}`

var filePath = path.resolve('data')

const body = fs
  .readdirSync(filePath)
  ?.map((fileName) => {
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
