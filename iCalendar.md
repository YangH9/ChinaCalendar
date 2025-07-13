### 概述

有时收到一些会议邀请邮件时会收到一个以 `.ics` 为后缀的附件，这个文件执行后能够在本地的日历中添加一个事件提醒。这篇文章介绍了 ics 文件的概念，介绍了 ics 文件内容以及编写 ics 文件。

### ICS文件是什么

ICS `(Internet Calendaring and Scheduling)` 文件是以iCalendar 标准编写的文本文件，可用于共享日历事件信息(标题、摘要、开始时间、结束时间等)，一般通过电子邮件给他人以共享会议请求或待办事项，收件人可以直接导入到自己的日历软件。iCalendar 是日历数据交换标准，通常以 `.ics` 或 `.ifb` 为后缀的文本文件保存。

### 协议

#### 邮件头格式

通常 iCalendar 使用UTF-8字符编码，所以可以使用中文。也可以在MIME中的charset参数来指定其他字符编码。iCalendar的MIME 类型是 text/calendar 。Header示例如下：

```
Content-Type: text/calendar; method="REQUEST"; name="Appointment.ics"
MIME-Version: 1.0
Content-Transfer-Encoding: base64
Content-Description: attachment; filename="Appointment.ics"
Content-class: urn:content-classes:calendarmessage
Filename: Appointment.ics
Path: Appointment.ics
```

#### iCalendar格式

iCalendar每一行必须以换行（CR+LF） 结尾，每一行不得超过 75 字节，如果超过限制，必须换行，后面一行使用空格符或制表符作开始，标识本行是上一行内容的继续，内容数据中的换行符可以反斜杠符 `\` 后跟数字（UTF-8中为 `5C6E` 或 `5C4E` ）来表示。

所有属性名、属性参数、枚举的属性值和属性参数值不区分大小写，其他属性值区分大小写（除非单独约定）。属性名和属性值以 : 分隔，中间无空格，如 `DTSTAMP:20210108T220000Z` 。

所有时间类属性的格式都遵循 ISO 8601 标准。时间格式为：`yyyyMMdd'T'HHmmssZ` ，如 `20210108T220000Z` ，日期和时间之间使用 `T` 分隔，最后的 `Z` 表示使用 UTC 时间。

持续时间值以 `P` 开头，每个持续时间段由一个整数表示，后面跟一个周期标识符，如果包含时间元素，需要使用 `T` 分隔，如 `P1D` 、`P2W` 、`P1Y2D` 、`P1DT12H` 、`PT3600S` 。

| 周期标识符 |                描述                |
| :--------: | :--------------------------------: |
|     Y     |                 年                 |
|     M     |                 月                 |
|     D     |                 日                 |
|     W     | 周(将被转成D，因此不能与D同时使用) |
|     H     |                 时                 |
|     M     |                 分                 |
|     S     |                 秒                 |

可以使用 `#` 或 `//` 添加注释，注意不能在其他元素行尾使用，只能注释整行。

##### 内容组成

iCalendar 中顶级元素是日历和计划核心对象，一组日历和计划信息。通常指包含单一的 iCalendar 对象，但可以在一个组中声明多个 iCalendar 对象。

> 第一行必须是 `BEGIN:VCALENDAR` ，最后一行必须是 `END:VCALENDAR` ，这两行之间的数据称为 icalbody。

icalbody 由一系列日历属性和一个或以上数量的日历组件组成。日历属性作用于整个日历，日历组件则是若干日历属性构成。日历组件可以指定一个事件（VEVENT）、一个待办事项列表（VTODO）、一个旅行事项（VJOURNAL）、时区信息（VZONE）、繁忙/空闲时间信息（VFREEBUSY），或者一个警报（VALARM）。其中警报可以包含于其他组件中。

##### 日历属性

日历属性中必须包含 `PRODID` 和 `VERSION` 两个属性。

VERSION 遵循的 iCalendar 版本号，目前是 `2.0` ，老版本的值为 `1.0`
PRODID 创建该 iCalendar 的软件的标识信息，如 `-//Google Inc//Google Calendar 70.9054//EN`
CALSCALE 历法， `GREGORIAN` - 公历
METHOD 方法， `PUBLISH` - 公开， `REQUEST` - 请求

##### 时区VTIMEZONE

VTIMEZONE 用于存储时区在任何给定时间点（即夏令时和标准时间）的 UTC 偏移量的特定规则。由于UTC时间存在边界问题，对于周期性的规则不适用。

VTIMEZONE属性:

* DTSTART：表示转换时区的开始时间，格式为 `YYYYMMDDTHHMMSS` 。
* TZOFFSETFROM：表示转换前的时区偏移量，格式为 `±HHMM` 。
* TZOFFSETTO：表示转换后的时区偏移量，格式为 `±HHMM` 。
* TZNAME：表示时区的名称。

##### 事件EVENT

事件（VEVENT）是日历上一系列计划好的时间点。如果用户接受一个日历事件，则认为用户在该时间段是忙碌的。也可以应用在没有具体时间的日历事件上，如周年纪念、每日提醒。

VEVENT 的属性：

* DTSTART 开始时间，如果是循环事件，则为第一个事件的开始时间
* DTEND 结束时间
* SUMMARY 概要，标题
* DESCRIPTION 详情描述，可用 html 语法
* DTSTAMP 时间戳，表示事件的创建时间或更新时间
* UID 唯一标识，取消与更新事件时用来找到唯一的日历事件
* METHOD 操作，如果要取消事件，该值为 `CANCEL`
* STATUS 事件状态， `TENTATIVE` - 试探、 `CONFIRMED` - 确认、 `CANCELLED` 取消
* SEQUENCE 序列号，更新事件时需要指定新的序列号，如第一次更新指定 `SEQUENCE:1`
* CLASS 保密类型， `PRIVATE` - 私有
* CREATED 创建时间
* LAST-MODIFIED 最后修改时间
* LOCATION 地址
* TRANSP 对于忙闲状态查询是否透明， `OPAQUE` - 不透明、 `TRANSPARENT` - 透明
* VALARM 警报对象

##### 待办事项 VTODO

不是所有软件都支持待办事项的，如 Outlook 就不能导出 VTODO 记录，导入时 VTODO 也会忽略。

待办事项中的属性：

* ACTION 动作，要执行的动作
* TRIGGER 触发时间，数据格式与 DURATION 一致，如果是提前触发，需要在值前加负号 `-` ，如提前一天触发 `-PT1440M`
* REPEAT 重复次数
* DURATION 持续时间

##### 旅行事项 VJOURNAL

旅行事项（VJOURNAL）将一段描述文字关联到一个详细的日历日期上，可用于记录活动或成长日志，或描述待办事项的进展。旅行事项不会影响日历上的时间状态，不影响空闲和繁忙状态。实际上只有少量程序支持 VJOURNAL 。

##### 扩展属性

iCalendar 支持软件私有的扩展属性，这些属性只在特定软件中生效，在属性名前加 X- 前缀表示扩展属性。如：

* X-MICROSOFT-CDO-BUSYSTATUS 忙碌状态
* X-MICROSOFT-CDO-IMPORTANCE 重要程度
* X-WR-CALNAM 通用扩展属性，表示本日历名称
* X-WR-TIMEZONE 通用扩展属性，表示时区，值如：`Asia/Shanghai`

#### 示例格式

```
BEGIN:VCALENDAR #日历开始
PRODID:-//Google Inc//Google Calendar 70.9054//EN #软件信息
VERSION:2.0 #遵循的 iCalendar 版本号
CALSCALE:GREGORIAN #历法：公历
METHOD:PUBLISH #方法：公开 也可以是 REQUEST 等用于日历间的信息沟通方法
X-WR-CALNAME:日历 #这是一个通用扩展属性 表示本日历的名称
X-WR-TIMEZONE:Asia/Shanghai #通用扩展属性，表示时区
BEGIN:VEVENT #事件开始
DTSTART:20090305T112200Z #开始的日期时间
DTEND:20090305T122200Z #结束的日期时间
DTSTAMP:20140613T033914Z #有Method 属性时表示 实例创建时间，没有时表示最后修订的日期时间
UID:9r5p7q78uohmk1bbt0iedof9s4@google.com #UID
CLASS:PRIVATE #保密类型
CREATED:20090305T092105Z #创建的日期时间
DESCRIPTION:test #描述
LAST-MODIFIED:20090305T092130Z #最后修改日期时间
LOCATION:test #地址
SEQUENCE:1 #排列序号
STATUS:CONFIRMED #状态 TENTATIVE 试探 CONFIRMED 确认 CANCELLED 取消
SUMMARY: test #简介 一般是标题
TRANSP:OPAQUE #对于忙闲查询是否透明 OPAQUE 不透明 TRANSPARENT 透明
END:VEVENT #事件结束
END:VCALENDAR #日历结束
```