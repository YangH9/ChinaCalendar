const fs = require('fs')
const path = require('path')

module.exports = {
  writeReadme: () => {
    const data = `# ChinaHolidayCalender\n\n# 中国节日、纪念日和假日调休、补班日历\n\n日历订阅链接：[https://yangh9.github.io/ChinaHolidayCalender/cal.ics](https://yangh9.github.io/ChinaHolidayCalender/cal.ics)\n\n> https://yangh9.github.io/ChinaHolidayCalender/cal.ics\n\n更新时间：${globalThis.nowTime}\n`
    const readmeData = `${data}\n[使用说明](https://yangh9.github.io/ChinaHolidayCalender/)\n`
    const docsReadmeData = `${data}\n### 订阅方式\n\n#### 苹果设备订阅\n\n* iPhone订阅(iOS13以上) **[设置-日历-账户-添加账户-其他-添加已订阅的日历]**\n* iPhone订阅(iOS13以下) **[设置-密码与账户-添加账户-其他-添加已订阅的日历]**\n* Mac订阅 **[日历-文件-新建日历订阅]**\n\n#### 安卓设备订阅\n\n* 小米手机订阅 **[日历-设置-日程导入-URL导入]**\n\n> 其他机型订阅方式持续补充中……\n\n[ics文件文档](./iCalendar.md)\n\n[ics文件官方文档](./iCalendar.txt)\n`
    // 写入文件
    fs.writeFileSync(path.join(path.resolve('README.md')), readmeData)
    fs.writeFileSync(path.join(path.resolve('docs'), 'README.md'), docsReadmeData)
  }
}
