const fs = require('fs')
const path = require('path')

exports.writeReadme = () => {
  const writePathList = [
    path.join(path.resolve('README.md')),
    path.join(path.resolve('docs'), 'README.md'),
    path.join(path.resolve('docs'), 'index.html')
  ]

  writePathList.forEach((path) => {
    const data = fs.readFileSync(path, 'utf-8').replace(globalThis.nowTimeReg, globalThis.nowTime)
    fs.writeFileSync(path, data)
  })
}
