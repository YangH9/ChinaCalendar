const { readFileSync, writeFileSync } = require('fs')
const { join, resolve } = require('path')

/**
 * @description: 写入日历文件
 */
exports.writeCalendar = () => {
  const { calendarList } = globalThis
  calendarList.forEach((item) => {
    writeFileSync(join(resolve('docs'), item.file), item.main)
  })
}

/**
 * @description: 写入Readme文件
 */
exports.writeReadme = () => {
  const { nowTimeReg, nowTime } = globalThis
  const writePathList = [join(resolve('README.md')), join(resolve('docs'), 'index.html')]
  writePathList.forEach((path) => {
    const data = readFileSync(path, 'utf-8').replace(nowTimeReg, nowTime)
    writeFileSync(path, data)
  })
}
