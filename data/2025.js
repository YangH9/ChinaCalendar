/**

https://www.gov.cn/zhengce/content/202411/content_6986382.htm

一、元旦：1月1日（周三）放假1天，不调休。

二、春节：1月28日（农历除夕、周二）至2月4日（农历正月初七、周二）放假调休，共8天。1月26日（周日）、2月8日（周六）上班。

三、清明节：4月4日（周五）至6日（周日）放假，共3天。

四、劳动节：5月1日（周四）至5日（周一）放假调休，共5天。4月27日（周日）上班。

五、端午节：5月31日（周六）至6月2日（周一）放假，共3天。

六、国庆节、中秋节：10月1日（周三）至8日（周三）放假调休，共8天。9月28日（周日）、10月11日（周六）上班。

 */


exports.govUrl = 'https://www.gov.cn/zhengce/content/202411/content_6986382.htm'
exports.list = [
  {
    summary: '元旦',
    description: '一、元旦：1月1日（周三）放假1天，不调休。',
    timeList: [
      { time: '2025/01/01', name: '假期', type: 'holiday' },
    ]
  },
  {
    summary: '春节',
    description: '二、春节：1月28日（农历除夕、周二）至2月4日（农历正月初七、周二）放假调休，共8天。1月26日（周日）、2月8日（周六）上班。',
    timeList: [
      { time: '2025/01/26', name: '补班', type: 'compensateday' },
      { time: '2025/01/28', name: '假期', type: 'holiday' },
      { time: '2025/01/29', name: '假期', type: 'holiday' },
      { time: '2025/01/30', name: '假期', type: 'holiday' },
      { time: '2025/01/31', name: '假期', type: 'holiday' },
      { time: '2025/02/01', name: '假期', type: 'holiday' },
      { time: '2025/02/02', name: '假期', type: 'holiday' },
      { time: '2025/02/03', name: '假期', type: 'holiday' },
      { time: '2025/02/04', name: '假期', type: 'holiday' },
      { time: '2025/02/08', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '清明节',
    description: '三、清明节：4月4日（周五）至6日（周日）放假，共3天。',
    timeList: [
      { time: '2025/04/04', name: '假期', type: 'holiday' },
      { time: '2025/04/05', name: '假期', type: 'holiday' },
      { time: '2025/04/06', name: '假期', type: 'holiday' },
    ]
  },
  {
    summary: '劳动节',
    description: '四、劳动节：5月1日（周四）至5日（周一）放假调休，共5天。4月27日（周日）上班。',
    timeList: [
      { time: '2025/04/27', name: '补班', type: 'compensateday' },
      { time: '2025/05/01', name: '假期', type: 'holiday' },
      { time: '2025/05/02', name: '假期', type: 'holiday' },
      { time: '2025/05/03', name: '假期', type: 'holiday' },
      { time: '2025/05/04', name: '假期', type: 'holiday' },
      { time: '2025/05/05', name: '假期', type: 'holiday' },
    ]
  },
  {
    summary: '端午节',
    description: '五、端午节：5月31日（周六）至6月2日（周一）放假，共3天。',
    timeList: [
      { time: '2025/05/31', name: '假期', type: 'holiday' },
      { time: '2025/06/01', name: '假期', type: 'holiday' },
      { time: '2025/06/02', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '国庆节、中秋节',
    description: '六、国庆节、中秋节：10月1日（周三）至8日（周三）放假调休，共8天。9月28日（周日）、10月11日（周六）上班。',
    timeList: [
      { time: '2025/09/28', name: '补班', type: 'compensateday' },
      { time: '2025/10/01', name: '假期', type: 'holiday' },
      { time: '2025/10/02', name: '假期', type: 'holiday' },
      { time: '2025/10/03', name: '假期', type: 'holiday' },
      { time: '2025/10/04', name: '假期', type: 'holiday' },
      { time: '2025/10/05', name: '假期', type: 'holiday' },
      { time: '2025/10/06', name: '假期', type: 'holiday' },
      { time: '2025/10/07', name: '假期', type: 'holiday' },
      { time: '2025/10/08', name: '假期', type: 'holiday' },
      { time: '2025/10/11', name: '补班', type: 'compensateday' }
    ]
  }
]
