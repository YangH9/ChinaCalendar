/**
 * @description: 获取几月的第几个星期几
 * @param {Number} year 年份
 * @param {Number} month 月份
 * @param {Number} num 第几个
 * @param {Number} week 周几
 * @returns {String} 时间 year/month/date
 */
const getWeekDay = (year, month, ordinal, dayOfWeek) => {
  const date = new Date(year, month - 1) // Date 构造函数中月份是从 0 开始的
  let count = 0
  while (date.getMonth() === month - 1) {
    if (date.getDay() === dayOfWeek) {
      count++
      if (count === ordinal) {
        return `${year}/${month}/${date.getDate()}`
      }
    }
    date.setDate(date.getDate() + 1)
  }
  return null // 没有找到匹配的日期
}

/**
 * @description: 转换农历时间
 * @param {Number} year 年份
 * @param {Number} month 月份
 * @param {Number} date 日期
 * @returns {String} 时间 year/month/date
 */
const getLunar2Solar = (year, month, date) => {
  // prettier-ignore
  let lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, // 2040-2049
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, // 2050-2059
    0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, // 2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, // 2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, // 2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, // 2090-2099
    0x0d520 // 2100
  ]
  const lYearDays = (y) => {
    let i
    let sum = 348
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
    let day = monthDays(y, m)
    let _day = day
    if (y < 1900 || y > 2100 || d > _day) {
      return -1
    }
    let offset = 0
    for (let i = 1900; i < y; i++) {
      offset += lYearDays(i)
    }
    let leap = 0
    let isAdd = false
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
    let stmap = Date.UTC(1900, 1, 30, 0, 0, 0)
    let calObj = new Date((offset + d - 31) * 86400000 + stmap)
    let cY = calObj.getUTCFullYear()
    let cM = calObj.getUTCMonth() + 1
    let cD = calObj.getUTCDate()
    return { year: cY, month: cM, day: cD }
  }
  const cal = lunar2solar(year, month, date)
  return `${cal.year}/${cal.month}/${cal.day}`
}

// 清明节日期
const getQingMing = (year) => {
  const leapYear = (year) => (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
  return leapYear(year) || leapYear(year - 1) ? '4' : '5'
}
// 秋分日期
const getQiuFen = (year) => {
  const leapYear = (year) => (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
  return leapYear(year) ? '22' : '23'
}

// 除夕日期
const getChuXi = (year) =>
  getLunar2Solar(year, 12, 30) === 'undefined/undefined/undefined'
    ? getLunar2Solar(year, 12, 29)
    : getLunar2Solar(year, 12, 30)

// 按年份数据生成多年的固定节日表
exports.list = globalThis.yearList
  .map((year) => [
    {
      title: '全体公民放假的节日',
      timeList: [
        {
          time: `${year}/1/1`,
          summary: '元旦',
          description:
            '元旦（1月1日）。\\n元旦，即公历的1月1日，是世界多数国家通称的“新年”。元，谓“始”，凡数之始称为“元”；旦，谓“日”；“元旦”即“初始之日”的意思。“元旦”通常指历法中的首月首日。\\n在我国，“元旦”一词古已有之，在文学作品中最早见于《晋书》。我国历史上的“元旦”指的是“正月一日”，“正月”的计算方法，在汉武帝时期以前是很不统一的，历代的元旦（首月首日）日期并不一致。\\n辛亥革命后，为了“行夏正，所以顺农时，从西历，所以便统计”，民国元年决定使用公历（实际使用是1912年），并规定阳历1月1日为“新年”，但并不叫“元旦”。1949年中华人民共和国以公历1月1日为元旦，因此“元旦”在中国也被称为“阳历年”、“新历年”或“公历年”。',
          type: 'CitizenHoliday'
        },
        {
          time: `${getLunar2Solar(year, 1, 1)}`,
          summary: '春节',
          description:
            '春节（农历正月初一）。\\n春节（Spring Festival），即中国农历新年（Chinese New Year），俗称“新春”“新岁”“岁旦”等，又称“过年”“过大年”，是集除旧布新、拜神祭祖、祈福辟邪、亲朋团圆、欢庆娱乐和饮食为一体的民俗大节。\\n春节历史悠久，起源于早期人类的原始信仰与自然崇拜，由上古时代岁首祈岁祭祀演变而来。万物本乎天、人本乎祖，祈岁祭祀、敬天法祖，报本反始也。春节的起源蕴含着深邃的文化内涵，在传承发展中承载了丰厚的历史文化底蕴。在春节期间，全国各地均有举行各种庆贺新春活动，带有浓郁的各地地方特色。\\n在早期观象授时时代，依据斗转星移定岁时，“斗柄回寅”为岁首。“斗柄回寅”春回大地、终而复始、万象更新，新的轮回由此开启。在传统的农耕社会，春回大地的岁首具有重要意义，衍生了大量与之相关的岁首节俗文化。在历史发展中虽然使用历法不同而岁首节庆日期不同，但是其节庆框架以及许多民俗沿承了下来。在现代，人们把春节定于农历正月初一，但一般至少要到正月十五新年才算结束。\\n百节年为首、四季春为先，春节是中华民族最隆重的传统佳节。受到中华文化的影响，世界上一些国家和地区也有庆贺新春的习俗。据不完全统计，已有近20个国家和地区把中国春节定为整体或者所辖部分城市的法定节假日。春节与清明节、端午节、中秋节并称为中国四大传统节日。\\n春节民俗经国务院批准列入第一批国家级非物质文化遗产名录。',
          type: 'CitizenHoliday'
        },
        {
          time: `${year}/4/${getQingMing(year)}`,
          summary: '清明节',
          description:
            '清明节（4月4~6日）。\\n清明节，又称踏青节、行清节、三月节、祭祖节等，节期在仲春与暮春之交。清明节源自早期人类的祖先信仰，是中华民族最隆重盛大的祭祖大节。清明节兼具自然与人文两大内涵，既是自然节气点，也是传统节日。扫墓祭祖与踏青郊游是清明节的两大礼俗主题，这两大传统礼俗在中国自古传承，至今不辍。',
          type: 'CitizenHoliday'
        },
        {
          time: `${year}/5/1`,
          summary: '劳动节',
          description:
            "劳动节（5月1日）。\\n国际劳动节又称“五一国际劳动节”“国际示威游行日”（英语：International Workers' Day，May Day），是世界上80多个国家的全国性节日。定在每年的五月一日。它是全世界劳动人民共同拥有的节日。\\n1889年7月，由弗里德里希·恩格斯领导的第二国际在巴黎举行代表大会。会议通过决议，规定1890年5月1日国际劳动者举行游行，并决定把5月1日这一天定为国际劳动节。中央人民政府政务院于1949年12月作出决定，将5月1日确定为劳动节。1989年后，国务院基本上每5年表彰一次全国劳动模范和先进工作者，每次表彰3000人左右。",
          type: 'CitizenHoliday'
        },
        {
          time: `${getLunar2Solar(year, 5, 5)}`,
          summary: '端午节',
          description:
            '端午节（农历五月初五）。\\n端午节，又称端阳节、龙舟节、重午节、重五节、天中节等，日期在每年农历五月初五，是集拜神祭祖、祈福辟邪、欢庆娱乐和饮食为一体的民俗大节。端午节源于自然天象崇拜，由上古时代祭龙演变而来。仲夏端午，苍龙七宿飞升于正南中央，处在全年最“中正”之位，正如《易经·乾卦》第五爻：“飞龙在天”。端午是“飞龙在天”吉祥日，龙及龙舟文化始终贯穿在端午节的传承历史中。\\n端午节是流行于中国以及汉字文化圈诸国的传统文化节日，传说战国时期的楚国诗人屈原在五月初五跳汨罗江自尽，后人亦将端午节作为纪念屈原的节日；也有纪念伍子胥、曹娥及介子推等说法。端午节的起源涵盖了古老星象文化、人文哲学等方面内容，蕴含着深邃丰厚的文化内涵，在传承发展中杂糅了多种民俗为一体，各地因地域文化不同而又存在着习俗内容或细节上的差异。\\n端午节与春节、清明节、中秋节并称为中国四大传统节日。端午文化在世界上影响广泛，世界上一些国家和地区也有庆贺端午的活动。2006年5月，国务院将其列入首批国家级非物质文化遗产名录；自2008年起，被列为国家法定节假日。2009年9月，联合国教科文组织正式批准将其列入《人类非物质文化遗产代表作名录》，端午节成为中国首个入选世界非遗的节日。',
          type: 'CitizenHoliday'
        },
        {
          time: `${getLunar2Solar(year, 8, 15)}`,
          summary: '中秋节',
          description:
            '中秋节（农历八月十五）。\\n中秋节，又称祭月节、月光诞、月夕、秋节、仲秋节、拜月节、月娘节、月亮节、团圆节等，是中国民间传统节日。中秋节源自对天象的崇拜，由上古时代秋夕祭月演变而来。中秋节自古便有祭月、赏月、吃月饼、看花灯、赏桂花、饮桂花酒等民俗，流传至今，经久不息。\\n中秋节起源于上古时代，普及于汉代，定型于唐代。中秋节是秋季时令习俗的综合，其所包含的节俗因素，大都有古老的渊源。祭月作为民间过节的重要习俗之一，逐渐演化为赏月、颂月等活动。中秋节以月之圆兆人之团圆，为寄托思念故乡，思念亲人之情，祈盼丰收、幸福，成为丰富多彩、弥足珍贵的文化遗产。\\n最初“祭月节”的节期是在干支历二十四节气“秋分”这天，后来才调至农历八月十五日。中秋节与春节、清明节、端午节并称为中国四大传统节日。受中华文化的影响，中秋节也是东亚和东南亚一些国家尤其是当地的华人华侨的传统节日。\\n2006年5月20日，国务院将其列入首批国家级非物质文化遗产名录。自2008年起中秋节被列为国家法定节假日。',
          type: 'CitizenHoliday'
        },
        {
          time: `${year}/10/1`,
          summary: '国庆节',
          description:
            '国庆节（10月1日）。\\n国庆节是由一个国家制定的用来纪念国家本身的法定假日。它们通常是这个国家的独立、宪法的签署、元首诞辰或其他有重大纪念意义的周年纪念日；也有些是这个国家守护神的圣人节。虽然绝大部分国家都有类似的纪念日，但是由于复杂的政治关系，部分国家的这一节日不能够称为国庆日，比如美国只有独立日，没有国庆日，但是两者意义相同。而中国古代把皇帝即位、诞辰称为“国庆”。如今，中华人民共和国国庆节特指中华人民共和国正式成立的纪念日-10月1日。世界历史上最悠久的国庆节是圣马力诺的国庆节，远在公元301年，圣马力诺就把9月3日定为自己的国庆节。',
          type: 'CitizenHoliday'
        }
      ]
    },
    {
      title: '部分公民放假的节日及纪念日',
      timeList: [
        {
          time: `${year}/03/08`,
          summary: '妇女节 部分公民假期',
          description:
            "妇女节（3月8日），妇女放假半天。\\n国际劳动妇女节（International Working Women's Day，简写IWD），又被称为“国际妇女节”、“三八节”和“三八妇女节”，是在每年的3月8日为庆祝妇女在经济、政治和社会等领域作出的重要贡献和取得的巨大成就而设立的节日。主要代表人物有克拉拉·蔡特金、何香凝、金学曙等。",
          type: 'PartialCitizenHoliday'
        },
        {
          time: `${year}/05/04`,
          summary: '青年节 部分公民假期',
          description:
            '青年节（5月4日），14周岁以上的青年放假半天。\\n五四青年节源于中国1919年反帝爱国的“五四运动”，五四爱国运动是一次彻底的反对帝国主义和封建主义的爱国运动，也是中国新民主主义革命的开始。1939年，陕甘宁边区西北青年救国联合会规定5月4日为中国青年节。\\n青年节期间，中国各地都要举行丰富多彩的纪念活动，青年们还要集中进行各种社会志愿和社会实践活动，还有许多地方在青年节期间举行成人仪式。',
          type: 'PartialCitizenHoliday'
        },
        {
          time: `${year}/06/01`,
          summary: '儿童节 部分公民假期',
          description:
            "儿童节（6月1日），不满14周岁的少年儿童放假1天。\\n国际儿童节（又称儿童节，International Children's Day）定于每年的6月1日。为了悼念1942年6月10日的利迪策惨案和全世界所有在战争中死难的儿童，反对虐杀和毒害儿童，以及保障儿童权利。\\n1949年11月，国际民主妇女联合会在莫斯科举行理事会议，中国和其他国家的代表愤怒地揭露了帝国主义分子和各国反动派残杀、毒害儿童的罪行。会议决定以每年的6月1日为国际儿童节。它是为了保障世界各国儿童的生存权、保健权和受教育权，抚养权，为了改善儿童的生活，为了反对虐杀儿童和毒害儿童而设立的节日。世界上许多国家都将6月1日定为儿童的节日。",
          type: 'PartialCitizenHoliday'
        },
        {
          time: `${year}/08/01`,
          summary: '建军节 部分公民假期',
          description:
            '中国人民解放军建军纪念日（8月1日），现役军人放假半天。\\n八一建军节（Army Day）是中国人民解放军建军纪念日，定为每年的八月一日，由中国人民革命军事委员会设立，为纪念中国工农红军成立的节日。\\n1933年7月11日，中华苏维埃共和国临时中央政府根据中央革命军事委员会6月30日的建议，决定8月1日为中国工农红军成立纪念日。1949年6月15日，中国人民革命军事委员会发布命令，以“八一”两字作为中国人民解放军军旗和军徽的主要标志。中华人民共和国成立后，将此纪念日改称为中国人民解放军建军节。',
          type: 'PartialCitizenHoliday'
        }
      ]
    },
    {
      title: '法定节日（补充',
      timeList: [
        {
          time: `${year}/01/10`,
          summary: '中国人民警察节',
          description:
            '中国人民警察节，1月10日（2021年起）\\n“中国人民警察节”是在国家层面专门为人民警察队伍设立的节日，是对人民警察队伍为党和人民利益英勇奋斗的充分肯定。\\n2020年7月21日，《国务院关于同意设立“中国人民警察节”的批复》发布，同意自2021年起，将每年1月10日设立为“中国人民警察节”。',
          type: 'festival'
        },
        {
          time: `${year}/03/12`,
          summary: '植树节',
          description:
            '植树节，3月12日。\\n植树节是按照法律规定宣传保护树木，并组织动员群众积极参加以植树造林为活动内容的节日。按时间长短可分为植树日、植树周和植树月，共称为国际植树节。提倡通过这种活动，激发人们爱林造林的热情、意识到环保的重要性。\\n中国的植树节由凌道扬和韩安、裴义理等林学家于1915年倡议设立，最初将时间确定在每年清明节。1928年，国民政府为纪念孙中山逝世三周年，将植树节改为3月12日。新中国成立后的1979年，在邓小平提议下，第五届全国人大常委会第六次会议决定将每年的3月12日定为植树节。\\n2020年7月1日起，施行新修订的《中华人民共和国森林法》，明确每年3月12日为植树节。',
          type: 'festival'
        },
        {
          time: `${year}/5/12`,
          summary: '护士节',
          description:
            '护士节，5月12日。\\n国际护士节是每年的5月12日，是国际护士理事会为纪念现代护理学科的创始人弗洛伦斯·南丁格尔于1912年设立的节日。其基本宗旨是倡导、继承和弘扬南丁格尔不畏艰险、甘于奉献、救死扶伤、勇于献身的人道主义精神。',
          type: 'festival'
        },
        {
          time: `${year}/5/31`,
          summary: '全国科技工作者日',
          description:
            '全国科技工作者日，5月30日（2017年起）。\\n全国科技工作者日，于2016年11月25日设立，时间为每年5月30日，中国科技界第一次拥有属于科技工作者自己的节日，旨在鼓励广大科技工作者牢记使命责任，切实担负起支撑发展的第一资源作用，紧紧围绕党和国家的中心任务，瞄准建设世界科技强国的宏伟目标，创新报国，引领发展。',
          type: 'festival'
        },
        {
          time: `${year}/8/19`,
          summary: '中国医师节',
          description:
            '中国医师节，8月19日（2018年起）。\\n2017年11月3日，国务院通过了卫计委（今卫健委）关于“设立中国医师节”的申请，同意自2018年起，将每年的8月19日设立为“中国医师节”。中国医师节是经国务院同意设立的卫生与健康工作者的节日，体现了党和国家对1100多万卫生与健康工作者的关怀和肯定。\\n2021年8月20日举行的十三届全国人大常委会第三十次会议表决通过《中华人民共和国医师法》，其中明确规定每年8月19日为中国医师节。',
          type: 'festival'
        },
        {
          time: `${year}/9/10`,
          summary: '教师节',
          description:
            '教师节，9月10日。\\n教师节，旨在肯定教师为教育事业所做的贡献。在中国近现代史上有多个日期曾作为教师节。直至1985年，第六届全国人大常委会第九次会议通过了国务院关于建立教师节的议案，才真正确定了1985年9月10日为中国第一个教师节。',
          type: 'festival'
        },
        {
          time: `${year}/9/${getQiuFen(year)}`,
          summary: '中国农民丰收节',
          description:
            '中国农民丰收节，公历9月22-24日，24节气。\\n中国农民丰收节，是第一个在国家层面专门为农民设立的节日，于2018年设立（国函〔2018〕80号），节日时间为每年“秋分”。设立“中国农民丰收节”，将极大调动起亿万农民的积极性、主动性、创造性，提升亿万农民的荣誉感、幸福感、获得感。举办“中国农民丰收节”可以展示农村改革发展的巨大成就，同时也展现了中国自古以来以农为本的传统。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 9, 9)}`,
          summary: '重阳节（老年节）',
          description:
            '重阳节（老年节），农历九月初九。\\n重阳节，是中国民间传统节日，日期在每年农历九月初九。“九”数在《易经》中为阳数，“九九”两阳数相重，故曰“重阳”；因日与月皆逢九，故又称为“重九”。九九归真，一元肇始，古人认为九九重阳是吉祥的日子。古时民间在重阳节有登高祈福、拜神祭祖及饮宴祈寿等习俗。传承至今，又添加了敬老等内涵。登高赏秋与感恩敬老是当今重阳节日活动的两大重要主题。',
          type: 'festival'
        },
        {
          time: `${year}/11/8`,
          summary: '记者节',
          description:
            '记者节，11月8日（2000年起）。\\n记者节，有些国家又称新闻节、出版节。每年的11月8日是中国记者节。\\n2000年，国务院正式批复中国记协《关于确定“记者节”具体日期的请示》，同意将中国记协的成立日11月8日定为记者节。按照国务院的规定，记者节是一个不放假的工作节日。',
          type: 'festival'
        }
      ]
    },
    {
      title: '现代流行节日',
      timeList: [
        {
          time: `${year}/2/14`,
          summary: '情人节',
          description:
            '情人节（2月14日）。\\n情人节，又称圣瓦伦丁节或圣华伦泰节，日期在每年公历的2月14日，是西方国家的传统节日之一，起源于基督教。如今已经成为全世界著名的浪漫节日，但是不同国家的人们表达爱意的方式却各不相同。\\n情人节是一个关于爱、浪漫以及花、巧克力、贺卡的节日，男女在这一天互送礼物用以表达爱意或友好。情人节的晚餐约会通常代表了情侣关系的发展关键。',
          type: 'festival'
        },
        {
          time: `${getWeekDay(year, 5, 2, 0)}`,
          summary: '母亲节',
          description:
            "母亲节（5月的第二个星期日）。\\n母亲节（Mother's Day），是一个感谢母亲的节日。现代的母亲节起源于美国，是每年5月的第二个星期日。母亲们在这一天通常会收到礼物，康乃馨被视为献给母亲的花，而中国的母亲花是萱草花，又叫忘忧草。",
          type: 'festival'
        },
        {
          time: `${getWeekDay(year, 6, 3, 0)}`,
          summary: '父亲节',
          description:
            "父亲节（6月的第三个星期日）。\\n父亲节（Father's Day），顾名思义是感恩父亲的节日。约始于二十世纪初，起源于美国，现已广泛流传于世界各地，节日日期因地域而存在差异。",
          type: 'festival'
        }
      ]
    },
    {
      title: '民间传统节日',
      timeList: [
        {
          time: `${getLunar2Solar(year, 1, 15)}`,
          summary: '元宵节',
          description:
            '元宵节（农历正月十五）\\n元宵节，又称上元节、小正月、元夕或灯节，时间为每年农历正月十五。\\n正月是农历的元月，古人称“夜”为“宵”，正月十五是一年中第一个月圆之夜，所以称正月十五为“元宵节”。根据道教“三元”的说法，正月十五又称为“上元节”。元宵节习俗自古以来就以热烈喜庆的观灯习俗为主。\\n元宵节的形成有一个较长的过程，根源于民间开灯祈福古俗。据一般的资料与民俗传说，正月十五在西汉已经受到重视，不过正月十五元宵节真正作为全国民俗节日是在汉魏之后。\\n正月十五燃灯习俗的兴起也与佛教东传有关，唐朝时佛教大兴，仕官百姓普遍在正月十五这一天“燃灯供佛”，于是佛家灯火遍布民间，从唐代起，元宵张灯即成为法定之事。\\n元宵节是中国的传统节日之一。元宵节主要有元宵灯节、赏花灯、吃汤圆、吃元宵、猜灯谜、放烟花等一系列传统民俗活动。此外，不少地方元宵节还增加了游龙灯、舞狮子、踩高跷、划旱船、扭秧歌、打太平鼓等传统民俗表演。2008年6月，元宵节被选入第二批国家级非物质文化遗产。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 2, 2)}`,
          summary: '龙抬头',
          description:
            '龙抬头（农历二月初二）\\n龙抬头，又称春耕节、农事节、青龙节、春龙节等，是中国民间传统节日。“龙”指的是二十八宿中的东方苍龙七宿星象，每岁仲春卯月（斗指正东）之初，“龙角星”就从东方地平线上升起，故称“龙抬头”。苍龙七宿的出没与降雨相互对应，古人认为是龙掌管着降雨，而降雨又决定着农耕收成，农耕的收成则决定着人们的生活水平，龙成了农耕社会最主要的“图腾”。在农耕文化中，“龙抬头”标示着阳气生发，雨水增多，万物生机盎然。自古以来人们亦将龙抬头日作为一个祈求风调雨顺、驱邪攘灾、纳祥转运的日子。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 2, 2)}`,
          summary: '社日节',
          description:
            '社日节（农历二月初二）\\n社日节，中国传统节日，又称土地诞，是古老的中国传统节日，社日分为春社和秋社。古时代的社日节期依据干支历法来定，后来因历法变动改用阴历定节期。春社按立春后第五个戊日推算，一般在农历二月初二前后，秋社按立秋后第五个戊日，约新谷登场的农历八月。古代把土地神和祭祀土地神的地方都叫"社"，按照中国民间的习俗，每到播种或收获的季节，农民们都要立社祭祀，祈求或酬报土地神。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 2, 2)}`,
          summary: '花朝节',
          description:
            '花朝节（农历二月初二）\\n花朝节，是指中国百花的生日，简称花朝，也称“花神节”、“百花生日”、“花神生日”、“挑菜节”，汉族传统节日，流行于东北、华北、华东、中南等地，一般于农历二月初二、二月十二或二月十五、二月二十五举行。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 3, 3)}`,
          summary: '上巳节',
          description:
            '上巳（sì）节，俗称三月三，是汉民族传统节日，该节日在汉代以前定为三月上旬的巳日，后来固定在夏历三月初三。上巳节是古代举行“祓除畔浴”活动中最重要的节日，人们结伴去水边沐浴，称为“祓禊”，此后又增加了祭祀宴饮、曲水流觞、郊外游春等内容。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 7, 7)}`,
          summary: '七夕节',
          description:
            '七夕节（农历七月初七）\\n七夕节，又称七巧节、七姐节、女儿节、乞巧节、七娘会、七夕祭、牛公牛婆日、巧夕等，是中国民间的传统节日。七夕节由星宿崇拜演化而来，为传统意义上的七姐诞，因拜祭“七姐”活动在七月七晩上举行，故名“七夕”。拜七姐，祈福许愿、乞求巧艺、坐看牵牛织女星、祈祷姻缘、储七夕水等，是七夕的传统习俗。经历史发展，七夕被赋予了“牛郎织女”的美丽爱情传说，使其成为了象征爱情的节日，从而被认为是中国最具浪漫色彩的传统节日，在当代更是产生了“中国情人节”的文化含义。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 7, 15)}`,
          summary: '中元节',
          description:
            '中元节（农历七月十五），是道教名称，民间世俗称为七月半，佛教则称为盂兰盆节。节日习俗主要有祭祖、放河灯、祀亡魂、焚纸锭、祭祀土地等。它的诞生可追溯到上古时代的祖灵崇拜以及相关时祭。七月乃吉祥月、孝亲月，七月半是民间初秋庆贺丰收、酬谢大地的节日，有若干农作物成熟，民间按例要祀祖，用新稻米等祭供，向祖先报告秋成。它是追怀先人的一种文化传统节日，其文化核心是敬祖尽孝。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 9, 9)}`,
          summary: '重阳节',
          description:
            '重阳节（农历九月初九），是中国民间传统节日，日期在每年农历九月初九。“九”数在《易经》中为阳数，“九九”两阳数相重，故曰“重阳”；因日与月皆逢九，故又称为“重九”。九九归真，一元肇始，古人认为九九重阳是吉祥的日子。古时民间在重阳节有登高祈福、拜神祭祖及饮宴祈寿等习俗。传承至今，又添加了敬老等内涵。登高赏秋与感恩敬老是当今重阳节日活动的两大重要主题。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 10, 15)}`,
          summary: '下元节',
          description:
            '下元节（农历十月十五），中国传统节日，亦称“下元日”、“下元”。是中国民间传统节日之一。十月十五中国称下元节，祭祀祖先。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 12, 8)}`,
          summary: '腊八节',
          description:
            '腊八节（农历十二月初八）\\n腊八节，即每年农历十二月初八，又称为“法宝节”“佛成道节”“成道会”等。本为佛教纪念释迦牟尼佛成道之节日，后逐渐也成为民间节日。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 12, 23)}`,
          summary: '北小年',
          description:
            '北方小年（农历十二月二十三）\\n小年，中国传统节日，也称“交年节”、“灶神节”、“祭灶节”等。小年的民俗活动主要有扫尘、祭灶等。中国幅员辽阔，各地风俗有很大的差异，由于各地风俗不同，被称为“小年”的日子也不尽相同。南方大部分地区是腊月二十四，北方大部分地区地区是腊月二十三。江浙沪地区把“腊月廿四”和“除夕前一夜”都称为小年；南京地区称正月十五的元宵节为小年；云南部分地区小年日期是正月十六；西南和北方个别地区小年日期是除夕。',
          type: 'festival'
        },
        {
          time: `${getLunar2Solar(year, 12, 24)}`,
          summary: '南小年',
          description:
            '南方小年（农历十二月二十四）\\n小年，中国传统节日，也称“交年节”、“灶神节”、“祭灶节”等。小年的民俗活动主要有扫尘、祭灶等。中国幅员辽阔，各地风俗有很大的差异，由于各地风俗不同，被称为“小年”的日子也不尽相同。南方大部分地区是腊月二十四，北方大部分地区地区是腊月二十三。江浙沪地区把“腊月廿四”和“除夕前一夜”都称为小年；南京地区称正月十五的元宵节为小年；云南部分地区小年日期是正月十六；西南和北方个别地区小年日期是除夕。',
          type: 'festival'
        },
        {
          time: `${getChuXi(year)}`,
          summary: '除夕',
          description:
            '除夕（农历年最后一天）\\n除夕，为岁末的最后一天夜晚。岁末的最后一天称为“岁除”，意为旧岁至此而除，另换新岁。除，即去除之意；夕，指夜晚。“除夕”是岁除之夜的意思，又称大年夜、除夕夜、除夜等，时值年尾的最后一个晚上。除夕是除旧布新、阖家团圆、祭祀祖先的日子，与清明节、七月半、重阳节同是中国民间传统的祭祖大节。除夕，在国人心中是具有特殊意义的，这个年尾最重要的日子，漂泊再远的游子也是要赶着回家去和家人团聚，在除夕，辞旧岁，迎新春。',
          type: 'festival'
        }
      ]
    },
    {
      title: '纪念日、公祭日、活动日',
      timeList: [
        {
          time: `${year}/2/7`,
          summary: '"二七"纪念日',
          description:
            '"二七"纪念日（2月7日）\\n1923年2月1日，京汉铁路工人在郑州举行京汉铁路总工会成立大会。但在开会前夕，直系军阀吴佩孚下令禁止开会，工人们对军阀的无理行动，表示极大的愤慨，决定照常召开成立大会。\\n二七纪念塔，位于郑州市中心二七广场。为纪念“二七”大罢工而建。1923年2月1日，京汉铁路工人在中国共产党领导下，在郑州普乐园（今二七纪念堂址）举行京汉铁路总工会成立大会，遭到军阀吴佩孚的武力阻挠。2月4日总工会举行全线总罢工。2月7日吴佩孚在帝国主义支持下，残酷镇压郑州、汉口江岸、北京长辛店等地的罢工工人，共产党员林祥谦、施洋等英勇就义。其后又在长春桥（今二七纪念塔址）杀害郑州分工会负责人汪胜友、司文德。',
          type: 'festival'
        },
        {
          time: `${year}/4/4`,
          summary: '全国性哀悼日',
          description:
            '全国性哀悼日（4月4日[2020年起]），全国各族人民对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼',
          type: 'festival'
        },
        {
          time: `${year}/4/15`,
          summary: '全民国家安全教育日',
          description:
            '全民国家安全教育日（4月15日[2015年起]）\\n全民国家安全教育日(英语：National Security Education Day)是为了增强全民国家安全意识，维护国家安全而设立的节日。2015年7月1日，全国人大常委会通过的《中华人民共和国国家安全法》第十四条规定，每年4月15日为全民国家安全教育日。',
          type: 'festival'
        },
        {
          time: `${year}/4/24`,
          summary: '中国航天日',
          description:
            '中国航天日（4月24日[2016年起]）\\n中国航天日（Space Day of China），是为了纪念中国航天事业成就，发扬中国航天精神而计划设立的一个纪念日。主旨是要铭记历史、传承精神，激发全民尤其是青少年崇尚科学、探索未知、敢于创新的热情，为实现中华民族伟大复兴的中国梦凝聚强大力量。\\n2016年3月8日，国务院批复同意将每年4月24日设立为“中国航天日”。首个中国航天日将以“中国梦，航天梦”为主题，国防科工局已会同有关部门筹划部署“开放日”“科普周”等系列宣传和科普活动。设立“中国航天日”，旨在宣传中国和平利用外层空间的一贯宗旨，大力弘扬航天精神，科学普及航天知识，激发全民族探索创新热情，唱响“探索浩瀚宇宙、发展航天事业、建设航天强国”的主旋律，凝聚实现中国梦航天梦的强大力量。',
          type: 'festival'
        },
        {
          time: `${year}/5/10`,
          summary: '中国品牌日',
          description:
            '中国品牌日（5月10日[2017年起]）\\n“中国品牌日”指的是国务院鼓励各级电视台、广播电台以及平面、网络等媒体，在重要时段、重要版面安排的自主品牌公益宣传，旨在讲好中国品牌故事。',
          type: 'festival'
        },
        {
          time: `${year}/5/12`,
          summary: '全国防灾减灾日',
          description:
            '全国防灾减灾日（5月12日[2009年起]）\\n全国防灾减灾日经国务院批准而设立，自2009年起，定于每年的5月12日。设立“防灾减灾日”一方面顺应社会各界对中国防灾减灾关注的诉求，另一方面提醒国民前事不忘、后事之师，更加重视防灾减灾，努力减少灾害损失。\\n防灾减灾日的图标以彩虹、伞、人为基本元素，雨后天晴的彩虹寓意着美好、未来和希望，伞的弧形形象代表着保护、呵护之意，两个人代表着一男一女、一老一少，两人相握之手与下面的两个人的腿共同构成一个“众”字，寓意大家携手，众志成城，共同防灾减灾。整个标识体现出积极向上的思想和保障人民群众生命财产安全之意。',
          type: 'festival'
        },
        {
          time: `${year}/5/19`,
          summary: '中国旅游日',
          description:
            '中国旅游日（5月19日[2011年起]）\\n中国旅游日，是由国务院批复同意设立的节日，节期是每年的5月19日。',
          type: 'festival'
        },
        {
          time: `${getWeekDay(year, 5, 3, 0)}`,
          summary: '全国助残日',
          description:
            '全国助残日（5月的第三个星期日）\\n中国全国助残日是中国残疾人节日。1990年12月28日第七届全国人民代表大会常务委员会第十七次会议审议通过的《中华人民共和国残疾人保障法》第14条规定：“每年五月第三个星期日，为全国助残日。”',
          type: 'festival'
        },
        {
          time: `${year}/5/30`,
          summary: '五卅纪念日',
          description:
            '五卅纪念日（5月30日）\\n五卅纪念日是纪念五卅运动在上海爆发的节日。节期:公历5 月30日。\\n1925年5月30日,五卅运动在上海爆发,迅即席卷全国,震惊中外。中国共产党领导下的这一群众性反帝爱国运动,标志大革命高潮的到来,严重打击了帝国主义,大大提高了中国人民的觉悟，让中国人民变得更加团结、坚强。\\n中华人民共和国成立后，每年5月30日例行各种纪念活动。',
          type: 'festival'
        },
        {
          time: `${year}/6/5`,
          summary: '世界环境日',
          description:
            '世界环境日为每年的6月5日，反映了世界各国人民对环境问题的认识和态度，表达了人类对美好环境的向往和追求，是联合国鼓励全世界对环境的认识和行动的主要工具，也是联合国促进全球环境意识、提高对环境问题的注意并采取行动的主要媒介之一。世界环境日自1973年以来每年举办一次，该日也成为促进可持续发展目标环境方面进展的重要平台。在联合国环境规划署（UNEP）的领导下，每年有150多个国家参加。来自世界各地的大公司、非政府组织、社区、政府和名人采用世界环境日品牌来倡导环境事业。\\n联合国环境规划署在每年6月5日选择一个成员国举行“世界环境日”纪念活动，发表《环境现状的年度报告书》及表彰“全球500佳”，并根据当年的世界主要环境问题及环境热点，有针对性地制定“世界环境日”主题，总称世界环境保护日。',
          type: 'festival'
        },
        {
          time: `${getWeekDay(year, 6, 2, 6)}`,
          summary: '文化和自然遗产日',
          description:
            '文化和自然遗产日（6月的第二个星期六[2017年起]）\\n文化和自然遗产日源自文化遗产日，是每年6月的第二个星期六，为中国文化建设重要主题之一，体现了党和国家对保护文化遗产的高度重视和战略远见。目的是营造保护文化遗产的良好氛围，提高人民群众对文化遗产保护重要性的认识，动员全社会共同参与、关注和保护文化遗产，增强全社会的文化遗产保护意识。',
          type: 'festival'
        },
        {
          time: `${year}/6/25`,
          summary: '全国土地日',
          description:
            '全国土地日是每年6月25日，是国务院确定的第一个全国纪念宣传日，中国是世界上第一个为保护土地而设立专门纪念日的国家。1986年6月25日，第六届全国人民代表大会常务委员会第十六次会议通过并颁布中国第一部专门调整土地关系的大法——《中华人民共和国土地管理法》。为纪念这一天，1991年5月24日国务院第83次常务会议决定，从1991年起，把每年的6月25日，即《土地管理法》颁布的日期确定为全国土地日。',
          type: 'festival'
        },
        {
          time: `${year}/6/26`,
          summary: '国际禁毒日',
          description:
            '国际禁毒日（6月26日）\\n国际禁毒日（International Day Against Drug Abuse and illicit Trafficking），全称是禁止药物滥用和非法贩运国际日，即国际反毒品日，为每年的6月26日。\\n1987年6月12日至26日，联合国在维也纳召开由138个国家的3000多名代表参加的麻醉品滥用和非法贩运问题部长级会议，会议提出了“爱生命，不吸毒”的口号。议会代表一致同意6月26日定为“国际禁毒日”，以引起世界各国对毒品问题的重视，同时号召全球人民共同来解决及宣传毒品问题。\\n每年的“6.26”国际禁毒日前后，各级政府都会通过报刊、广播、电视等新闻媒介及其他多种形式集中开展禁毒宣传活动。',
          type: 'festival'
        },
        {
          time: `${year}/7/7`,
          summary: `七七抗战纪念日·${year - 1937}周年`,
          description:
            '七七抗战纪念日（7月7日）\\n七七事变，又称卢沟桥事变，发生于1937年7月7日。\\n1937年7月7日夜，卢沟桥的日本驻军在未通知中国地方当局的情况下，径自在中国驻军阵地附近举行所谓军事演习，并诡称有一名日军士兵失踪，要求进入北平西南的宛平县城搜查，被中国驻军严词拒绝，日军随即向宛平城和卢沟桥发动进攻。中国驻军第29军37师219团奋起还击，进行了顽强的抵抗。\\n“七七事变”揭开了全国抗日战争的序幕。',
          type: 'festival'
        },
        {
          time: `${year}/7/11`,
          summary: '中国航海日',
          description:
            '中国航海日（7月11日[2005年起]）\\n2005年7月11日，中国航海日正式启动，当天也是中国航海家郑和下西洋600周年纪念日。郑和七下西洋拉开了人类走向远洋的序幕，2005年4月25日，中国政府决定把每年的7月11日定为航海日，同时也作为世界海事日在中国的实施日期。航海日当天，各地会举办多种庆祝活动，相关船舶都要统一鸣笛一分钟。',
          type: 'festival'
        },
        {
          time: `${year}/8/8`,
          summary: '全民健身日',
          description:
            '全民健身日（8月8日[2009年起]）\\n为了满足广大人民群众日益增长的体育需求，为了纪念北京奥运会成功举办，国务院批准，从2009年起，每年8月8日为“全民健身日”。',
          type: 'festival'
        },
        {
          time: `${year}/8/15`,
          summary: `日本宣布无条件投降${year - 1945}年`,
          description:
            '1945年8月15日，日本宣布无条件投降！勿忘国耻，吾辈自强！\\n日本投降（Japanese surrender）是第二次世界大战结束的标志。1945年8月15日正午，日本天皇向全日本广播，接受中美英三国促令日本投降之波茨坦公告、实行无条件投降，结束战争。1945年9月2日上午9时，标志着第二次世界大战结束的日本投降的签字仪式，在停泊在东京湾的密苏里号主甲板上举行。\\n1945年8月21日今井武夫飞抵芷江洽降。1945年9月2日上午9时，日本外相重光葵代表日本天皇和政府、陆军参谋长梅津美治郎代表日军大本营在投降书上签字。',
          type: 'festival'
        },
        {
          time: `${year}/8/25`,
          summary: '全国残疾预防日',
          description:
            '全国残疾预防日是每年8月25日，由国务院于2017年6月24日，《国务院关于同意设立“残疾预防日”的批复》设立。',
          type: 'festival'
        },
        {
          time: `${year}/9/3`,
          summary: `中国人民抗日战争胜利纪念日·${year - 1945}周年`,
          description: `中国人民抗日战争胜利纪念日（9月3日）\\n1945年9月2日，日本向盟军投降仪式在东京湾密苏里号战列舰上举行。在包括中国在内的9个受降国代表注视下，日本在投降书上签字。这是中国近代以来反侵略历史上的第一次全面胜利，也为世界反法西斯战争的胜利做出了巨大贡献。之后每年的9月3日，被确定为中国人民抗日战争胜利纪念日。\\n2014年2月27日下午，十二届全国人大常委会第七次会议经表决通过，将9月3日确定为中国人民抗日战争胜利纪念日。\\n${year}年9月3日是中国人民抗日战争暨世界反法西斯战争胜利${
            year - 1945
          }周年。`,
          type: 'festival'
        },
        {
          time: `${year}/9/5`,
          summary: '中华慈善日',
          description:
            '中华慈善日（9月5日）\\n“中华慈善日”于2015年11月在审议《中华人民共和国慈善法》草案时提出。慈善法规定9月5日为“中华慈善日”是和“国际慈善日”进行接轨。',
          type: 'festival'
        },
        {
          time: `${year}/9/18`,
          summary: `九一八纪念日·${year - 1931}周年`,
          description:
            '九一八纪念日（9月18日）\\n1931年，“九一八”事变爆发，又称奉天事变、柳条湖事件。九·一八事变是由日本蓄意制造并发动的侵华战争，是日本帝国主义企图以武力征服中国的开端，是中国抗日战争的起点，标志着中国局部抗战的开始，揭开了第二次世界大战东方战场的序幕。九一八事变后，中国人民的局部抗战也标志着世界反法西斯战争的起点。\\n为铭记历史，警醒人民勿忘国耻、居安思危，也为了增强大家的国防观念和防空意识。每年的9月18日，全国很多城市都会拉响防空警报。\\n早在1995年，沈阳就有了在9月18日这天鸣响防空警报的习惯，时间为3分钟。目前，国内已有北京、哈尔滨、长春等百余座城市选在每年9月18日进行防空警报鸣放。',
          type: 'festival'
        },
        {
          time: `${getWeekDay(year, 9, 3, 6)}`,
          summary: '全民国防教育日',
          description:
            '全民国防教育日（9月的第三个星期六）\\n全民国防教育日（Nationwide National Defense Education Day），是国家设定的对全民进行大规模国防教育的主题活动日。群众性国防教育活动的形式之一。全民国防教育日是每年9月的第三个星期六。',
          type: 'festival'
        },
        {
          time: `${year}/9/30`,
          summary: '烈士纪念日',
          description:
            '烈士纪念日（9月30日）\\n烈士纪念日，是指纪念本国英雄的法定纪念日。世界上许多国家有自己法定的烈士纪念日，每年这些国家都要在本国法定纪念日举行隆重的公祭仪式，纪念本国英雄。中国烈士纪念日为每年9月30日。',
          type: 'festival'
        },
        {
          time: `${year}/10/13`,
          summary: '国际减轻自然灾害日',
          description:
            '国际减轻自然灾害日(每年10月13日)。\\n国际减轻自然灾害日是由联合国大会1989年定于每年十月的第二个星期三。2009年，联合国大会通过决议改为每年10月13日国际减轻自然灾害日，简称“国际减灾日”。\\n自然灾害是当今世界面临的重大问题之一，严重影响经济、社会的可持续发展和威胁人类的生存。联合国于1987年12月11日确定20世纪90年代为“国际减轻自然灾害十年”(IDNDR)。所谓“减轻自然灾害”，一般是指减轻由潜在的自然灾害可能造成对社会及环境影响的程度，即最大限度地减少人员伤亡和财产损失，使公众的社会和经济结构在灾害中受到的破坏得以减轻到最低程度。',
          type: 'festival'
        },
        {
          time: `${year}/10/16`,
          summary: '世界粮食日',
          description:
            '世界粮食日（World Food Day），10月16日，起始于1981年10月16日，是世界各国政府每年在10月16日围绕发展粮食和农业生产举行纪念活动的日子，其宗旨在于唤起全世界对发展粮食和农业生产的高度重视。\\n每年世界粮食日，包括粮农组织在内的国际机构、各国政府及民间组织都会开展各种宣传与纪念活动。\\n2022年世界粮食日的主题是“不让任何人掉队。更好生产、更好营养、更好环境、更好生活。',
          type: 'festival'
        },
        {
          time: `${year}/10/17`,
          summary: '国家扶贫日',
          description:
            '国家扶贫日（10月17日[2014年起]）\\n2014年8月1日，国务院决定从2014年起，将每年10月17日设立为“扶贫日”，具体活动由扶贫办有关部门共同组织实施。\\n设立“扶贫日”充分体现了党中央、国务院对于扶贫开发构成的高度重视，也充分体现了对于贫困地区贫困群众的格外关心，所以设立“扶贫日”是继续向贫困宣战的一个重要的举措，也是广泛动员社会各方面力量参与扶贫开发的一项重要的制度安排。',
          type: 'festival'
        },
        {
          time: `${year}/12/2`,
          summary: '全国交通安全日',
          description:
            '全国交通安全日（12月12日[2012年起]）\\n“全国交通安全日”为每年12月2日，确定12月2日为“全国交通安全日”，主要考虑数字“122”作为我国道路交通事故报警电话，于1994年开通并投入使用，群众对此认知度高，方便记忆和宣传。',
          type: 'festival'
        },
        {
          time: `${year}/12/4`,
          summary: '国家宪法日',
          description:
            '国家宪法日（12月4日[2014年起]）\\n国家宪法日（National Constitution Day）是为了增强全社会的宪法意识、弘扬宪法精神、加强宪法实施、全面推进依法治国，而在每年的12月4日设立的节日。',
          type: 'festival'
        },
        {
          time: `${year}/12/4`,
          summary: '全国法制宣传日',
          description:
            '全国法制宣传日（12月4日[2001年起]）\\n中国的“全国法制宣传日”是每年的12月4日。2001年12月04日是第一届全国法制宣传日。同时该日期也是国家宪法日，国家将通过多种形式开展宪法宣传教育活动。',
          type: 'festival'
        },
        {
          time: `${year}/12/13`,
          summary: `南京大屠杀死难者国家公祭日·${year - 1937}周年`,
          description:
            '南京大屠杀死难者国家公祭日（12月13日）南京大屠杀死难者国家公祭日是中国政府设立的纪念日，以国家公祭的方式，祭奠在南京大屠杀中死亡的30多万同胞。\\n2014年2月27日，十二届全国人大常委会第七次会议通过决定，以立法形式将12月13日设立为南京大屠杀死难者国家公祭日。决议的通过，使得对南京大屠杀遇难者的纪念上升为国家层面，表明了中国人民反对侵略战争、捍卫人类尊严、维护世界和平的坚定立场。\\n2014年12月13日，中国共产党和国家主要领导人出席首个国家公祭日。国家主席习近平在公祭日上讲到：南京大屠杀惨案铁证如山、不容篡改。为南京大屠杀死难者举行公祭仪式，是要唤起每一个善良的人们对和平的向往和坚守，而不是要延续仇恨。中国人民要庄严昭告国际社会：今天的中国，是世界和平的坚决倡导者和有力捍卫者，中国人民将坚定不移维护人类和平与发展的崇高事业，愿同各国人民真诚团结起来，为建设一个持久和平、共同繁荣的世界而携手努力。\\n根据国务院批复，自2014年起，每年12月13日在南京大屠杀死难者国家公祭仪式主会场下半旗。',
          type: 'festival'
        }
      ]
    }
  ])
  .flat(1)
