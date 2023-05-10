// 当前年份
// 农历时间计算当前月份，修改到下一年
const getYear = (month) =>
  globalThis.nowDate.getFullYear() + +(globalThis.nowDate.getMonth() + 1 > +month)

// 法定节日、公祭日、活动日

// 2020年4月4

// 二七纪念日、五卅纪念日、七七抗战纪念日、九三抗战胜利纪念日、九一八纪念日、教师节、护士节、记者节、植树节等其他节日、纪念日

// 中国人民丰收节、老年节

/**
 * 民间节日
农历正月初七人日、农历正月十五元宵节
农历二月初二龙抬头、社日节、花朝节
农历三月初三上巳节
清明节前1、2日寒食节
农历七月初七七夕节 农历七月十五中元节
农历九月初九重阳节
农历十月初一寒衣节 十月十五下元节
12月21-23日交节冬至节
农历十二月初八腊八节 农历十二月二十四前后小年 农历年最后一天除夕等
 */

/**
 * 现代流行节日
2月14日情人节
5月的第二个星期日母亲节
6月的第三个星期日父亲节等
 */

module.exports = {
  list: [
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
          time: ``,
          summary: '情人节',
          description: '2月14日情人节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '母亲节',
          description: '5月的第二个星期日母亲节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '父亲节',
          description: '6月的第三个星期日父亲节',
          type: 'festival'
        },
      ]
    },
    {
      title: '民间传统节日',
      timeList: [
        {
          time: ``,
          summary: '元宵节',
          description: '农历正月十五元宵节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '龙抬头、社日节、花朝节',
          description: '农历二月初二龙抬头、社日节、花朝节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '七夕节',
          description: '农历七月初七七夕节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '重阳节',
          description: '农历九月初九重阳节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '腊八节',
          description: '农历十二月初八腊八节',
          type: 'festival'
        },
        {
          time: ``,
          summary: '小年',
          description: '农历十二月二十四前后小年',
          type: 'festival'
        },
        {
          time: ``,
          summary: '除夕',
          description: '农历年最后一天除夕',
          type: 'festival'
        },
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
          time: `${getYear(5)}/5/21`,
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
          time: `${getYear(6)}/6/10`,
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
          time: `${getYear(9)}/9/16`,
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
