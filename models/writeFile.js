const { readFileSync, writeFileSync } = require('fs')
const { join, resolve } = require('path')
const { calenderBody, solarTermsBody } = require('./index')

/**
 * @description: 写入日历文件
 */
exports.writeCalendar = () => {
  const { uName, calDesc } = globalThis
  // prettier-ignore
  const main = `BEGIN:VCALENDAR\r\nPRODID:-//${uName}//China Public Holidays//CN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:中国节日、纪念日、假日日历\r\nX-WR-TIMEZONE:Asia/Shanghai\r\nX-WR-CALDESC:${calDesc}\r\nBEGIN:VTIMEZONE\r\nTZID:Asia/Shanghai\r\nX-LIC-LOCATION:Asia/Shanghai\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${calenderBody()}END:VCALENDAR`
  writeFileSync(join(resolve('docs'), 'cal.ics'), main)
}

/**
 * @description: 写入24节气
 */
exports.writeSolarTerms = () => {
  const { uName, yearList, nowTime } = globalThis
  // prettier-ignore
  const solarTerms = `BEGIN:VCALENDAR\r\nPRODID:-//${uName}//China Public Holidays//CN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:二十四节气日历\r\nX-WR-TIMEZONE:Asia/Shanghai\r\nX-WR-CALDESC:${yearList[0]}~${yearList.at( -1)}年二十四节气日历。更新时间：${nowTime}\r\nBEGIN:VTIMEZONE\r\nTZID:Asia/Shanghai\r\nX-LIC-LOCATION:Asia/Shanghai\r\nBEGIN:STANDARD\r\nTZOFFSETFROM:+0800\r\nTZOFFSETTO:+0800\r\nTZNAME:CST\r\nDTSTART:19700101T000000\r\nEND:STANDARD\r\nEND:VTIMEZONE\r\n${solarTermsBody()}\r\nEND:VCALENDAR`
  writeFileSync(join(resolve('docs'), 'solarTerms.ics'), solarTerms)
}

/**
 * @description: 写入Readme文件
 */
exports.writeReadme = () => {
  const { nowTimeReg, nowTime } = globalThis
  const writePathList = [
    join(resolve('README.md')),
    join(resolve('docs'), 'README.md'),
    join(resolve('docs'), 'index.html')
  ]
  writePathList.forEach((path) => {
    const data = readFileSync(path, 'utf-8').replace(nowTimeReg, nowTime)
    writeFileSync(path, data)
  })
}
