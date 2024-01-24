/**

https://www.gov.cn/zhengce/content/2019-11/21/content_5454164.htm

一、元旦：2020年1月1日放假，共1天。

二、春节：1月24日至30日放假调休，共7天。1月19日（星期日）、2月1日（星期六）上班。

三、清明节：4月4日至6日放假调休，共3天。

四、劳动节：5月1日至5日放假调休，共5天。4月26日（星期日）、5月9日（星期六）上班。

五、端午节：6月25日至27日放假调休，共3天。6月28日（星期日）上班。

六、国庆节、中秋节：10月1日至8日放假调休，共8天。9月27日（星期日）、10月10日（星期六）上班。

 */

exports.govUrl = 'https://www.gov.cn/zhengce/content/2019-11/21/content_5454164.htm'
exports.list = [
  {
    summary: '元旦',
    description: '一、元旦：2020年1月1日放假，共1天。',
    timeList: [{ time: '2020/01/01', name: '假期', type: 'holiday' }]
  },
  {
    summary: '春节',
    description: '二、春节：1月24日至30日放假调休，共7天。1月19日（星期日）、2月1日（星期六）上班。',
    timeList: [
      { time: '2020/01/19', name: '补班', type: 'compensateday' },
      { time: '2020/01/24', name: '假期', type: 'holiday' },
      { time: '2020/01/25', name: '假期', type: 'holiday' },
      { time: '2020/01/26', name: '假期', type: 'holiday' },
      { time: '2020/01/27', name: '假期', type: 'holiday' },
      { time: '2020/01/28', name: '假期', type: 'holiday' },
      { time: '2020/01/29', name: '假期', type: 'holiday' },
      { time: '2020/01/30', name: '假期', type: 'holiday' },
      { time: '2020/02/01', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '清明节',
    description: '三、清明节：4月4日至6日放假调休，共3天。',
    timeList: [
      { time: '2020/04/04', name: '假期', type: 'holiday' },
      { time: '2020/04/05', name: '假期', type: 'holiday' },
      { time: '2020/04/06', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '劳动节',
    description: '四、劳动节：5月1日至5日放假调休，共5天。4月26日（星期日）、5月9日（星期六）上班。',
    timeList: [
      { time: '2020/04/26', name: '补班', type: 'compensateday' },
      { time: '2020/05/01', name: '假期', type: 'holiday' },
      { time: '2020/05/02', name: '假期', type: 'holiday' },
      { time: '2020/05/03', name: '假期', type: 'holiday' },
      { time: '2020/05/04', name: '假期', type: 'holiday' },
      { time: '2020/05/05', name: '假期', type: 'holiday' },
      { time: '2020/05/09', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '端午节',
    description: '五、端午节：6月25日至27日放假调休，共3天。6月28日（星期日）上班。',
    timeList: [
      { time: '2020/06/25', name: '假期', type: 'holiday' },
      { time: '2020/06/26', name: '假期', type: 'holiday' },
      { time: '2020/06/27', name: '假期', type: 'holiday' },
      { time: '2020/06/28', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '国庆节、中秋节',
    description: '六、国庆节、中秋节：10月1日至8日放假调休，共8天。9月27日（星期日）、10月10日（星期六）上班。',
    timeList: [
      { time: '2020/09/27', name: '补班', type: 'compensateday' },
      { time: '2020/10/01', name: '假期', type: 'holiday' },
      { time: '2020/10/02', name: '假期', type: 'holiday' },
      { time: '2020/10/03', name: '假期', type: 'holiday' },
      { time: '2020/10/04', name: '假期', type: 'holiday' },
      { time: '2020/10/05', name: '假期', type: 'holiday' },
      { time: '2020/10/06', name: '假期', type: 'holiday' },
      { time: '2020/10/07', name: '假期', type: 'holiday' },
      { time: '2020/10/08', name: '假期', type: 'holiday' },
      { time: '2020/10/10', name: '补班', type: 'compensateday' }
    ]
  }
]
