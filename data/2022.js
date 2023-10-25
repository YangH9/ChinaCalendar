/**

https://www.gov.cn/zhengce/content/2021-10/25/content_5644835.htm

一、元旦：2022年1月1日至3日放假，共3天。

二、春节：1月31日至2月6日放假调休，共7天。1月29日（星期六）、1月30日（星期日）上班。

三、清明节：4月3日至5日放假调休，共3天。4月2日（星期六）上班。

四、劳动节：4月30日至5月4日放假调休，共5天。4月24日（星期日）、5月7日（星期六）上班。

五、端午节：6月3日至5日放假，共3天。

六、中秋节：9月10日至12日放假，共3天。

七、国庆节：10月1日至7日放假调休，共7天。10月8日（星期六）、10月9日（星期日）上班。

 */

exports.govUrl = 'https://www.gov.cn/zhengce/content/2021-10/25/content_5644835.htm'
exports.list = [
  {
    summary: '元旦',
    description: '一、元旦：2020年1月1日放假，共1天。',
    timeList: [{ time: '2022/01/01', name: '假期', type: 'holiday' }]
  },
  {
    summary: '春节',
    description:
      '二、春节：1月31日至2月6日放假调休，共7天。1月29日（星期六）、1月30日（星期日）上班。',
    timeList: [
      { time: '2022/01/29', name: '补班', type: 'compensateday' },
      { time: '2022/01/30', name: '补班', type: 'compensateday' },
      { time: '2022/01/31', name: '假期', type: 'holiday' },
      { time: '2022/02/01', name: '假期', type: 'holiday' },
      { time: '2022/02/02', name: '假期', type: 'holiday' },
      { time: '2022/02/03', name: '假期', type: 'holiday' },
      { time: '2022/02/04', name: '假期', type: 'holiday' },
      { time: '2022/02/05', name: '假期', type: 'holiday' },
      { time: '2022/02/06', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '清明节',
    description: '三、清明节：4月3日至5日放假调休，共3天。4月2日（星期六）上班。',
    timeList: [
      { time: '2022/04/02', name: '补班', type: 'compensateday' },
      { time: '2022/04/03', name: '假期', type: 'holiday' },
      { time: '2022/04/04', name: '假期', type: 'holiday' },
      { time: '2022/04/05', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '劳动节',
    description:
      '四、劳动节：4月30日至5月4日放假调休，共5天。4月24日（星期日）、5月7日（星期六）上班。',
    timeList: [
      { time: '2022/04/24', name: '补班', type: 'compensateday' },
      { time: '2022/04/30', name: '假期', type: 'holiday' },
      { time: '2022/05/01', name: '假期', type: 'holiday' },
      { time: '2022/05/02', name: '假期', type: 'holiday' },
      { time: '2022/05/03', name: '假期', type: 'holiday' },
      { time: '2022/05/04', name: '假期', type: 'holiday' },
      { time: '2022/05/07', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '端午节',
    description: '五、端午节：6月3日至5日放假，共3天。',
    timeList: [
      { time: '2022/06/03', name: '假期', type: 'holiday' },
      { time: '2022/06/04', name: '假期', type: 'holiday' },
      { time: '2022/06/05', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '中秋节',
    description: '六、中秋节：9月10日至12日放假，共3天。',
    timeList: [
      { time: '2022/09/10', name: '假期', type: 'holiday' },
      { time: '2022/09/11', name: '假期', type: 'holiday' },
      { time: '2022/09/12', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '国庆节',
    description:
      '七、国庆节：10月1日至7日放假调休，共7天。10月8日（星期六）、10月9日（星期日）上班。',
    timeList: [
      { time: '2022/10/01', name: '假期', type: 'holiday' },
      { time: '2022/10/02', name: '假期', type: 'holiday' },
      { time: '2022/10/03', name: '假期', type: 'holiday' },
      { time: '2022/10/04', name: '假期', type: 'holiday' },
      { time: '2022/10/05', name: '假期', type: 'holiday' },
      { time: '2022/10/06', name: '假期', type: 'holiday' },
      { time: '2022/10/07', name: '假期', type: 'holiday' },
      { time: '2022/10/08', name: '补班', type: 'compensateday' },
      { time: '2022/10/09', name: '补班', type: 'compensateday' }
    ]
  }
]
