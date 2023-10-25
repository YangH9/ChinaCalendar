/**

https://www.gov.cn/zhengce/content/2022-12/08/content_5730844.htm

一、元旦：2022年12月31日至2023年1月2日放假调休，共3天。

二、春节：1月21日至27日放假调休，共7天。1月28日（星期六）、1月29日（星期日）上班。

三、清明节：4月5日放假，共1天。

四、劳动节：4月29日至5月3日放假调休，共5天。4月23日（星期日）、5月6日（星期六）上班。

五、端午节：6月22日至24日放假调休，共3天。6月25日（星期日）上班。

六、中秋节、国庆节：9月29日至10月6日放假调休，共8天。10月7日（星期六）、10月8日（星期日）上班。

 */

exports.govUrl = 'https://www.gov.cn/zhengce/content/2022-12/08/content_5730844.htm'
exports.list = [
  {
    summary: '元旦',
    description: '一、元旦：2022年12月31日至2023年1月2日放假调休，共3天。',
    timeList: [
      { time: '2022/12/31', name: '假期', type: 'holiday' },
      { time: '2023/01/01', name: '假期', type: 'holiday' },
      { time: '2023/01/02', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '春节',
    description:
      '二、春节：1月21日至27日放假调休，共7天。1月28日（星期六）、1月29日（星期日）上班。',
    timeList: [
      { time: '2023/01/21', name: '假期', type: 'holiday' },
      { time: '2023/01/22', name: '假期', type: 'holiday' },
      { time: '2023/01/23', name: '假期', type: 'holiday' },
      { time: '2023/01/24', name: '假期', type: 'holiday' },
      { time: '2023/01/25', name: '假期', type: 'holiday' },
      { time: '2023/01/26', name: '假期', type: 'holiday' },
      { time: '2023/01/27', name: '假期', type: 'holiday' },
      { time: '2023/01/28', name: '补班', type: 'compensateday' },
      { time: '2023/01/29', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '清明节',
    description: '三、清明节：4月5日放假，共1天。',
    timeList: [{ time: '2023/04/05', name: '假期', type: 'holiday' }]
  },
  {
    summary: '劳动节',
    description:
      '四、劳动节：4月29日至5月3日放假调休，共5天。4月23日（星期日）、5月6日（星期六）上班。',
    timeList: [
      { time: '2023/04/23', name: '补班', type: 'compensateday' },
      { time: '2023/04/29', name: '假期', type: 'holiday' },
      { time: '2023/04/30', name: '假期', type: 'holiday' },
      { time: '2023/05/01', name: '假期', type: 'holiday' },
      { time: '2023/05/02', name: '假期', type: 'holiday' },
      { time: '2023/05/03', name: '假期', type: 'holiday' },
      { time: '2023/05/06', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '端午节',
    description: '五、端午节：6月22日至24日放假调休，共3天。6月25日（星期日）上班。',
    timeList: [
      { time: '2023/06/22', name: '假期', type: 'holiday' },
      { time: '2023/06/23', name: '假期', type: 'holiday' },
      { time: '2023/06/24', name: '假期', type: 'holiday' },
      { time: '2023/06/25', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '中秋节、国庆节',
    description:
      '六、中秋节、国庆节：9月29日至10月6日放假调休，共8天。10月7日（星期六）、10月8日（星期日）上班。',
    timeList: [
      { time: '2023/09/29', name: '假期', type: 'holiday' },
      { time: '2023/09/30', name: '假期', type: 'holiday' },
      { time: '2023/10/01', name: '假期', type: 'holiday' },
      { time: '2023/10/02', name: '假期', type: 'holiday' },
      { time: '2023/10/03', name: '假期', type: 'holiday' },
      { time: '2023/10/04', name: '假期', type: 'holiday' },
      { time: '2023/10/05', name: '假期', type: 'holiday' },
      { time: '2023/10/06', name: '假期', type: 'holiday' },
      { time: '2023/10/07', name: '补班', type: 'compensateday' },
      { time: '2023/10/08', name: '补班', type: 'compensateday' }
    ]
  }
]
