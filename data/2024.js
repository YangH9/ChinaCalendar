/**

https://www.gov.cn/zhengce/content/202310/content_6911527.htm

一、元旦：1月1日放假，与周末连休。

二、春节：2月10日至17日放假调休，共8天。2月4日（星期日）、2月18日（星期日）上班。鼓励各单位结合带薪年休假等制度落实，安排职工在除夕（2月9日）休息。

三、清明节：4月4日至6日放假调休，共3天。4月7日（星期日）上班。

四、劳动节：5月1日至5日放假调休，共5天。4月28日（星期日）、5月11日（星期六）上班。

五、端午节：6月10日放假，与周末连休。

六、中秋节：9月15日至17日放假调休，共3天。9月14日（星期六）上班。

七、国庆节：10月1日至7日放假调休，共7天。9月29日（星期日）、10月12日（星期六）上班。

 */

exports.govUrl = 'https://www.gov.cn/zhengce/content/202310/content_6911527.htm'
exports.list = [
  {
    summary: '元旦',
    description: '一、元旦：1月1日放假，与周末连休。',
    timeList: [
      { time: '2022/12/30', name: '假期', type: 'holiday' },
      { time: '2022/12/31', name: '假期', type: 'holiday' },
      { time: '2023/01/01', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '春节',
    description:
      '二、春节：2月10日至17日放假调休，共8天。2月4日（星期日）、2月18日（星期日）上班。鼓励各单位结合带薪年休假等制度落实，安排职工在除夕（2月9日）休息。',
    timeList: [
      { time: '2023/02/04', name: '补班', type: 'compensateday' },
      { time: '2023/02/10', name: '假期', type: 'holiday' },
      { time: '2023/02/11', name: '假期', type: 'holiday' },
      { time: '2023/02/12', name: '假期', type: 'holiday' },
      { time: '2023/02/13', name: '假期', type: 'holiday' },
      { time: '2023/02/14', name: '假期', type: 'holiday' },
      { time: '2023/02/15', name: '假期', type: 'holiday' },
      { time: '2023/02/16', name: '假期', type: 'holiday' },
      { time: '2023/02/17', name: '假期', type: 'holiday' },
      { time: '2023/02/18', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '清明节',
    description: '三、清明节：4月4日至6日放假调休，共3天。4月7日（星期日）上班。',
    timeList: [
      { time: '2023/04/04', name: '假期', type: 'holiday' },
      { time: '2023/04/05', name: '假期', type: 'holiday' },
      { time: '2023/04/06', name: '假期', type: 'holiday' },
      { time: '2023/04/07', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '劳动节',
    description:
      '四、劳动节：5月1日至5日放假调休，共5天。4月28日（星期日）、5月11日（星期六）上班。',
    timeList: [
      { time: '2023/04/28', name: '补班', type: 'compensateday' },
      { time: '2023/05/01', name: '假期', type: 'holiday' },
      { time: '2023/05/02', name: '假期', type: 'holiday' },
      { time: '2023/05/03', name: '假期', type: 'holiday' },
      { time: '2023/05/04', name: '假期', type: 'holiday' },
      { time: '2023/05/05', name: '假期', type: 'holiday' },
      { time: '2023/05/11', name: '补班', type: 'compensateday' }
    ]
  },
  {
    summary: '端午节',
    description: '五、端午节：6月10日放假，与周末连休。',
    timeList: [
      { time: '2023/06/08', name: '假期', type: 'holiday' },
      { time: '2023/06/09', name: '假期', type: 'holiday' },
      { time: '2023/06/10', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '中秋节',
    description: '六、中秋节：9月15日至17日放假调休，共3天。9月14日（星期六）上班。',
    timeList: [
      { time: '2023/09/14', name: '补班', type: 'compensateday' },
      { time: '2023/09/15', name: '假期', type: 'holiday' },
      { time: '2023/09/16', name: '假期', type: 'holiday' },
      { time: '2023/09/17', name: '假期', type: 'holiday' }
    ]
  },
  {
    summary: '国庆节',
    description:
      '七、国庆节：10月1日至7日放假调休，共7天。9月29日（星期日）、10月12日（星期六）上班。',
    timeList: [
      { time: '2023/09/29', name: '补班', type: 'compensateday' },
      { time: '2023/10/01', name: '假期', type: 'holiday' },
      { time: '2023/10/02', name: '假期', type: 'holiday' },
      { time: '2023/10/03', name: '假期', type: 'holiday' },
      { time: '2023/10/04', name: '假期', type: 'holiday' },
      { time: '2023/10/05', name: '假期', type: 'holiday' },
      { time: '2023/10/06', name: '假期', type: 'holiday' },
      { time: '2023/10/07', name: '假期', type: 'holiday' },
      { time: '2023/10/12', name: '补班', type: 'compensateday' }
    ]
  }
]
