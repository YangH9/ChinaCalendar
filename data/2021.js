/**

http://www.gov.cn/zhengce/content/2020-11/25/content_5564127.htm

一、元旦：2021年1月1日至3日放假，共3天。

二、春节：2月11日至17日放假调休，共7天。2月7日（星期日）、2月20日（星期六）上班。

三、清明节：4月3日至5日放假调休，共3天。

四、劳动节：5月1日至5日放假调休，共5天。4月25日（星期日）、5月8日（星期六）上班。

五、端午节：6月12日至14日放假，共3天。

六、中秋节：9月19日至21日放假调休，共3天。9月18日（星期六）上班。

七、国庆节：10月1日至7日放假调休，共7天。9月26日（星期日）、10月9日（星期六）上班。

 */

module.exports = {
  govUrl: 'http://www.gov.cn/zhengce/content/2020-11/25/content_5564127.htm',
  list: [
    {
      summary: '元旦',
      description: '一、元旦：2021年1月1日至3日放假，共3天。',
      timeList: [
        { time: '2021/01/01', name: '假期', type: 'holiday' },
        { time: '2021/01/02', name: '假期', type: 'holiday' },
        { time: '2021/01/03', name: '假期', type: 'holiday' }
      ]
    },
    {
      summary: '春节',
      description:
        '二、春节：2月11日至17日放假调休，共7天。2月7日（星期日）、2月20日（星期六）上班。',
      timeList: [
        { time: '2021/02/07', name: '补班', type: 'compensateday' },
        { time: '2021/02/11', name: '假期', type: 'holiday' },
        { time: '2021/02/12', name: '假期', type: 'holiday' },
        { time: '2021/02/13', name: '假期', type: 'holiday' },
        { time: '2021/02/14', name: '假期', type: 'holiday' },
        { time: '2021/02/15', name: '假期', type: 'holiday' },
        { time: '2021/02/16', name: '假期', type: 'holiday' },
        { time: '2021/02/17', name: '假期', type: 'holiday' },
        { time: '2021/02/20', name: '补班', type: 'compensateday' }
      ]
    },
    {
      summary: '清明节',
      description: '三、清明节：4月3日至5日放假调休，共3天。',
      timeList: [
        { time: '2021/04/03', name: '假期', type: 'holiday' },
        { time: '2021/04/04', name: '假期', type: 'holiday' },
        { time: '2021/04/05', name: '假期', type: 'holiday' }
      ]
    },
    {
      summary: '劳动节',
      description:
        '四、劳动节：5月1日至5日放假调休，共5天。4月25日（星期日）、5月8日（星期六）上班。',
      timeList: [
        { time: '2021/04/25', name: '补班', type: 'compensateday' },
        { time: '2021/05/01', name: '假期', type: 'holiday' },
        { time: '2021/05/02', name: '假期', type: 'holiday' },
        { time: '2021/05/03', name: '假期', type: 'holiday' },
        { time: '2021/05/04', name: '假期', type: 'holiday' },
        { time: '2021/05/05', name: '假期', type: 'holiday' },
        { time: '2021/05/08', name: '补班', type: 'compensateday' }
      ]
    },
    {
      summary: '端午节',
      description: '五、端午节：6月12日至14日放假，共3天。',
      timeList: [
        { time: '2021/06/12', name: '假期', type: 'holiday' },
        { time: '2021/06/13', name: '假期', type: 'holiday' },
        { time: '2021/06/14', name: '假期', type: 'holiday' }
      ]
    },
    {
      summary: '中秋节',
      description: '六、中秋节：9月19日至21日放假调休，共3天。9月18日（星期六）上班。',
      timeList: [
        { time: '2021/09/18', name: '补班', type: 'compensateday' },
        { time: '2021/09/19', name: '假期', type: 'holiday' },
        { time: '2021/09/20', name: '假期', type: 'holiday' },
        { time: '2021/09/21', name: '假期', type: 'holiday' }
      ]
    },
    {
      summary: '国庆节',
      description:
        '七、国庆节：10月1日至7日放假调休，共7天。9月26日（星期日）、10月9日（星期六）上班。',
      timeList: [
        { time: '2021/09/26', name: '补班', type: 'compensateday' },
        { time: '2021/10/01', name: '假期', type: 'holiday' },
        { time: '2021/10/02', name: '假期', type: 'holiday' },
        { time: '2021/10/03', name: '假期', type: 'holiday' },
        { time: '2021/10/04', name: '假期', type: 'holiday' },
        { time: '2021/10/05', name: '假期', type: 'holiday' },
        { time: '2021/10/06', name: '假期', type: 'holiday' },
        { time: '2021/10/07', name: '假期', type: 'holiday' },
        { time: '2021/10/09', name: '补班', type: 'compensateday' }
      ]
    }
  ]
}
