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
      title:'民间节日',
      timeList:[],
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
          description: '全国性哀悼日（4月4日[2020年起]），全国各族人民对抗击新冠肺炎疫情斗争牺牲烈士和逝世同胞的深切哀悼',
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
      ]
    }
  ]
}
