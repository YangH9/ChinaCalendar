/**
 * @description: 计算日期年份，自动后延
 * @param {Number} month 月份
 * @returns {Number} year 年份
 */
const getYear = (month) =>
  globalThis.nowDate.getFullYear() + +(globalThis.nowDate.getMonth() + 1 > +month)

/**
 * @description: 获取几月的第几个星期几
 * @param {Number} week 周几
 * @param {Number} num 第几个
 * @param {Number} month 月份
 * @param {Number} year 年份（可不传，自动计算
 * @returns {String} 时间 year/month/date
 */
const getWeekDay = (week, num, month, year = getYear(month)) => {
  const firstWeek = new Date(year, month - 1, 1).getDay()
  const date = week - firstWeek + num * 7 + 1
  return `${year}/${month}/${date}`
}

/**
 * @description: 转换农历时间
 * @param {Number} month 月份
 * @param {Number} date 日期
 * @returns {String} 时间 year/month/date
 */
const getLunar2Solar = (month, date) => {
  // prettier-ignore
  var lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2, // 1900-1909
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977, // 1910-1919
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970, // 1920-1929
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950, // 1930-1939
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557, // 1940-1949
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0, // 1950-1959
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0, // 1960-1969
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6, // 1970-1979
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570, // 1980-1989
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0, // 1990-1999
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5, // 2000-2009
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930, // 2010-2019
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530, // 2020-2029
    0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45, // 2030-2039
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0, // 2040-2049
    0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0, // 2050-2059
    0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4, // 2060-2069
    0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0, // 2070-2079
    0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160, // 2080-2089
    0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252, // 2090-2099
    0x0d520
  ] // 2100
  const lYearDays = (y) => {
    var i
    var sum = 348
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += lunarInfo[y - 1900] & i ? 1 : 0
    }
    return sum + leapDays(y)
  }
  const leapMonth = (y) => {
    return lunarInfo[y - 1900] & 0xf
  }
  const leapDays = (y) => {
    if (leapMonth(y)) {
      return lunarInfo[y - 1900] & 0x10000 ? 30 : 29
    }
    return 0
  }
  const monthDays = (y, m) => {
    if (m > 12 || m < 1) {
      return -1
    }
    return lunarInfo[y - 1900] & (0x10000 >> m) ? 30 : 29
  }
  const lunar2solar = (y, m, d) => {
    // 参数区间1900.1.31~2100.12.1
    if ((y === 2100 && m === 12 && d > 1) || (y === 1900 && m === 1 && d < 31)) {
      return -1
    }
    var day = monthDays(y, m)
    var _day = day
    if (y < 1900 || y > 2100 || d > _day) {
      return -1
    }
    var offset = 0
    for (var i = 1900; i < y; i++) {
      offset += lYearDays(i)
    }
    var leap = 0
    var isAdd = false
    for (i = 1; i < m; i++) {
      leap = leapMonth(y)
      if (!isAdd) {
        if (leap <= i && leap > 0) {
          offset += leapDays(y)
          isAdd = true
        }
      }
      offset += monthDays(y, i)
    }
    var stmap = Date.UTC(1900, 1, 30, 0, 0, 0)
    var calObj = new Date((offset + d - 31) * 86400000 + stmap)
    var cY = calObj.getUTCFullYear()
    var cM = calObj.getUTCMonth() + 1
    var cD = calObj.getUTCDate()
    return { year: cY, month: cM, day: cD }
  }
  const cal = lunar2solar(getYear(month), month, date)
  return `${cal.year}/${cal.month}/${cal.day}`
}

// 清明节日期
const getQingMing = (year) => {
  const leapYear = (year) => (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
  return leapYear(year) || leapYear(year - 1) ? '4' : '5'
}

// 除夕日期
const getChuXi = () => {
  getLunar2Solar(12, 30) === 'undefined/undefined/undefined'
    ? getLunar2Solar(12, 29)
    : getLunar2Solar(12, 30)
}

module.exports = {
  list: [
    {
      title: '全体公民放假的节日',
      timeList: [
        {
          time: `${getYear(1)}/1/1`,
          summary: '元旦',
          description: '元旦（1月1日）。',
          type: 'CitizenHoliday'
        },
        {
          time: `${getLunar2Solar(1, 1)}`,
          summary: '春节',
          description: '春节（农历正月初一）。',
          type: 'CitizenHoliday'
        },
        {
          time: `${getYear(4)}/4/${getQingMing(getYear(4))}`,
          summary: '清明节',
          description: '清明节（4月4~6日）24节气',
          type: 'CitizenHoliday'
        },
        {
          time: `${getYear(5)}/5/1`,
          summary: '劳动节',
          description: '劳动节（5月1日）',
          type: 'CitizenHoliday'
        },
        {
          time: `${getLunar2Solar(5, 5)}`,
          summary: '端午节',
          description: '端午节（农历五月初五）',
          type: 'CitizenHoliday'
        },
        {
          time: `${getLunar2Solar(8, 15)}`,
          summary: '中秋节',
          description: '中秋节（农历八月十五）',
          type: 'CitizenHoliday'
        },
        {
          time: `${getYear(10)}/10/1`,
          summary: '国庆节',
          description: '国庆节（10月1日）',
          type: 'CitizenHoliday'
        }
      ]
    },
    {
      title: '部分公民放假的节日及纪念日',
      timeList: [
        {
          time: `${getYear(3)}/03/08`,
          summary: '妇女节 部分公民假期',
          description: '妇女节（3月8日），妇女放假半天。',
          type: 'PartialCitizenHoliday'
        },
        {
          time: `${getYear(5)}/05/04`,
          summary: '青年节 部分公民假期',
          description: '青年节（5月4日），14周岁以上的青年放假半天。',
          type: 'PartialCitizenHoliday'
        },
        {
          time: `${getYear(6)}/06/01`,
          summary: '儿童节 部分公民假期',
          description: '儿童节（6月1日），不满14周岁的少年儿童放假1天。',
          type: 'PartialCitizenHoliday'
        },
        {
          time: `${getYear(8)}/08/01`,
          summary: '建军节 部分公民假期',
          description: '中国人民解放军建军纪念日（8月1日），现役军人放假半天。',
          type: 'PartialCitizenHoliday'
        }
      ]
    },
    {
      title: '法定节日（补充',
      timeList: [
        {
          time: `${getYear(1)}/01/10`,
          summary: '中国人民警察节',
          description: '中国人民警察节，1月10日（2021年起）',
          type: 'festival'
        },
        {
          time: `${getYear(3)}/03/12`,
          summary: '植树节',
          description: '植树节，3月12日。',
          type: 'festival'
        },
        {
          time: `${getYear(5)}/5/12`,
          summary: '护士节',
          description: '护士节，5月12日。',
          type: 'festival'
        },
        {
          time: `${getYear(5)}/5/31`,
          summary: '全国科技工作者日',
          description: '全国科技工作者日，5月30日（2017年起）。',
          type: 'festival'
        },
        {
          time: `${getYear(8)}/8/19`,
          summary: '中国医师节',
          description: '中国医师节，8月19日（2018年起）。',
          type: 'festival'
        },
        {
          time: `${getYear(9)}/9/10`,
          summary: '教师节',
          description: '教师节，9月10日。',
          type: 'festival'
        },
        {
          time: `${getYear(11)}/11/8`,
          summary: '记者节',
          description: '记者节，11月8日（2000年起）。',
          type: 'festival'
        }
      ]
    },
    {
      title: '现代流行节日',
      timeList: [
        {
          time: `${getYear(2)}/2/14`,
          summary: '情人节',
          description: '情人节（2月14日）',
          type: 'festival'
        },
        {
          time: `${getWeekDay(0, 2, 5)}`,
          summary: '母亲节',
          description: '母亲节（5月的第二个星期日）',
          type: 'festival'
        },
        {
          time: `${getWeekDay(0, 3, 6)}`,
          summary: '父亲节',
          description: '父亲节（6月的第三个星期日）',
          type: 'festival'
        }
      ]
    },
    {
      title: '民间传统节日',
      timeList: [
        {
          time: `${getLunar2Solar(1, 15)}`,
          summary: '元宵节',
          description: '元宵节（农历正月十五）',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(2, 2)}`,
          summary: '龙抬头、社日节、花朝节',
          description: '龙抬头、社日节、花朝节（农历二月初二）',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(7, 7)}`,
          summary: '七夕节',
          description: '七夕节（农历七月初七）',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(9, 9)}`,
          summary: '重阳节',
          description: '重阳节（农历九月初九）',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(12, 8)}`,
          summary: '腊八节',
          description: '腊八节（农历十二月初八）',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(12, 23)}`,
          summary: '北小年',
          description: '北方小年（农历十二月二十三）',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(12, 24)}`,
          summary: '南小年',
          description: '南方小年（农历十二月二十四）',
          type: 'festival'
        },
        {
          time: `${getChuXi()}`,
          summary: '除夕',
          description: '除夕（农历年最后一天）',
          type: 'festival'
        }
      ]
    },
    {
      title: '纪念日、公祭日、活动日',
      timeList: [
        {
          time: `${getYear(2)}/2/7`,
          summary: '二七纪念日',
          description: '二七纪念日（2月7日）',
          type: 'festival'
        },
        {
          time: `${getYear(4)}/4/4`,
          summary: '全国性哀悼日',
          description:
            '全国性哀悼日（4月4日[2020年起]），全国各族人民对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼',
          type: 'festival'
        },
        {
          time: `${getYear(4)}/4/15`,
          summary: '全民国家安全教育日',
          description: '全民国家安全教育日（4月15日[2015年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(4)}/4/24`,
          summary: '中国航天日',
          description: '中国航天日（4月24日[2016年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(5)}/5/10`,
          summary: '中国品牌日',
          description: '中国品牌日（5月10日[2017年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(5)}/5/12`,
          summary: '全国防灾减灾日',
          description: '全国防灾减灾日（5月12日[2009年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(5)}/5/19`,
          summary: '中国旅游日',
          description: '中国旅游日（5月19日[2011年起]）',
          type: 'festival'
        },
        {
          time: `${getWeekDay(0, 3, 5)}`,
          summary: '全国助残日',
          description: '全国助残日（5月的第三个星期日）',
          type: 'festival'
        },
        {
          time: `${getYear(5)}/5/30`,
          summary: '五卅纪念日',
          description: '五卅纪念日（5月30日）',
          type: 'festival'
        },
        {
          time: `${getYear(6)}/6/5`,
          summary: '环境日',
          description: '环境日（6月5日）',
          type: 'festival'
        },
        {
          time: `${getWeekDay(6, 2, 6)}`,
          summary: '文化和自然遗产日',
          description: '文化和自然遗产日（6月的第二个星期六[2017年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(6)}/6/25`,
          summary: '全国土地日',
          description: '全国土地日（6月25日[1991年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(7)}/7/7`,
          summary: '七七抗战纪念日',
          description: '七七抗战纪念日（7月7日）',
          type: 'festival'
        },
        {
          time: `${getYear(7)}/7/11`,
          summary: '中国航海日',
          description: '中国航海日（7月11日[2005年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(8)}/8/8`,
          summary: '全民健身日',
          description: '全民健身日（8月8日[2009年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(8)}/8/25`,
          summary: '残疾预防日',
          description: '残疾预防日（8月25日[2017年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(9)}/9/3`,
          summary: '中国人民抗日战争胜利纪念日',
          description: '中国人民抗日战争胜利纪念日（9月3日）',
          type: 'festival'
        },
        {
          time: `${getYear(9)}/9/5`,
          summary: '中华慈善日',
          description: '中华慈善日（9月5日）',
          type: 'festival'
        },
        {
          time: `${getYear(9)}/9/18`,
          summary: '九一八纪念日',
          description: '九一八纪念日（9月18日）',
          type: 'festival'
        },
        {
          time: `${getWeekDay(6, 3, 9)}`,
          summary: '全民国防教育日',
          description: '全民国防教育日（9月的第三个星期六）',
          type: 'festival'
        },
        {
          time: `${getYear(9)}/9/30`,
          summary: '烈士纪念日',
          description: '烈士纪念日（9月30日）',
          type: 'festival'
        },
        {
          time: `${getYear(10)}/10/17`,
          summary: '国家扶贫日',
          description: '国家扶贫日（10月17日[2014年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(12)}/12/2`,
          summary: '全国交通安全日',
          description: '全国交通安全日（12月12日[2012年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(12)}/12/4`,
          summary: '国家宪法日',
          description: '国家宪法日（12月4日）',
          type: 'festival'
        },
        {
          time: `${getYear(12)}/12/4`,
          summary: '全国法制宣传日',
          description: '全国法制宣传日（12月4日[2001年起]）',
          type: 'festival'
        },
        {
          time: `${getYear(12)}/12/13`,
          summary: '南京大屠杀死难者国家公祭日',
          description: '南京大屠杀死难者国家公祭日（12月13日）',
          type: 'festival'
        }
      ]
    }
  ]
}
