const fs = require('fs')
const path = require('path')

exports.writeReadme = () => {
  const readmePath = path.join(path.resolve('README.md'))
  const docsReadmePath = path.join(path.resolve('docs'), 'README.md')

  const readmeData = fs
    .readFileSync(readmePath, 'utf-8')
    .replace(globalThis.nowTimeReg, globalThis.nowTime)
  const docsReadmeData = fs
    .readFileSync(docsReadmePath, 'utf-8')
    .replace(globalThis.nowTimeReg, globalThis.nowTime)

  fs.writeFileSync(readmePath, readmeData)
  fs.writeFileSync(docsReadmePath, docsReadmeData)
}
