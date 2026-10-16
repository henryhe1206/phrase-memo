// 例句格式：[英文, 中文]
export type Example = [en: string, zh: string];

export interface GrammarUse {
  /** 搭配结构，如 "at + 具体时刻" */
  pattern: string;
  meaning: string;
  examples: Example[];
}

export interface Preposition {
  word: string;
  summary: string;
  uses: GrammarUse[];
}

export interface Collocation {
  pattern: string;
  /** 点击这些词时会显示本条搭配（使用原形） */
  words: string[];
  meaning: string;
  note?: string;
  example: Example;
}

export const PREPOSITIONS: Preposition[] = [
  {
    word: 'at',
    summary: '把时间或地点当作"一个点"',
    uses: [
      {
        pattern: 'at + 具体时刻',
        meaning: '在某个钟点或时间点',
        examples: [
          ['The meeting starts at 3 p.m.', '会议下午三点开始。'],
          ['I usually go to bed at midnight.', '我通常半夜才睡。'],
        ],
      },
      {
        pattern: 'at + 地点（作为一个点）',
        meaning: '在某处（车站、门口、家、公司等）',
        examples: [
          ["I'll wait for you at the bus stop.", '我在公交站等你。'],
          ['She is at work right now.', '她现在在上班。'],
        ],
      },
      {
        pattern: 'look / smile / laugh / shout / aim + at + 对象',
        meaning: '朝着、对着某个目标',
        examples: [
          ['Look at this picture.', '看这张图片。'],
          ["Don't laugh at him.", '不要嘲笑他。'],
        ],
      },
      {
        pattern: 'at + 价格 / 速度 / 水平',
        meaning: '以……的价格、速度',
        examples: [['The car was going at 100 km per hour.', '这辆车正以每小时 100 公里行驶。']],
      },
      {
        pattern: 'be good / bad / excellent at + 名词 / 动名词',
        meaning: '擅长（或不擅长）某事',
        examples: [['She is good at speaking English.', '她擅长说英语。']],
      },
    ],
  },
  {
    word: 'in',
    summary: '较长的时间段，或较大的空间、范围之内',
    uses: [
      {
        pattern: 'in + 月份 / 年份 / 季节 / 一天中的时段',
        meaning: '在某个较长的时间段内（in the morning / afternoon / evening）',
        examples: [
          ['I was born in 1998.', '我出生于 1998 年。'],
          ['See you in the morning.', '明早见。'],
        ],
      },
      {
        pattern: 'in + 一段时间',
        meaning: '……之后（从现在算起）',
        examples: [['The train leaves in ten minutes.', '火车十分钟后开。']],
      },
      {
        pattern: 'in + 较大的地点 / 空间',
        meaning: '在国家、城市、房间、容器等内部',
        examples: [
          ['She lives in Shanghai.', '她住在上海。'],
          ['Your keys are in the box.', '你的钥匙在盒子里。'],
        ],
      },
      {
        pattern: 'in + 语言 / 颜色 / 衣着 / 材料',
        meaning: '用某种语言、穿着某种颜色或衣服',
        examples: [
          ['Say it in English.', '用英语说。'],
          ['Who is the woman in red?', '那个穿红衣服的女人是谁？'],
        ],
      },
      {
        pattern: 'in + 状态 / 情形',
        meaning: 'in trouble / in love / in a hurry / in a good mood',
        examples: [["I'm in a hurry.", '我很赶时间。']],
      },
      {
        pattern: 'be interested in + 名词 / 动名词',
        meaning: '对……感兴趣',
        examples: [["He's interested in music.", '他对音乐感兴趣。']],
      },
    ],
  },
  {
    word: 'on',
    summary: '具体的某一天，或表面、接触、主题',
    uses: [
      {
        pattern: 'on + 具体某一天',
        meaning: '星期、日期、某天的某个时段（on Monday morning）',
        examples: [
          ["I'll see you on Monday.", '周一见。'],
          ['We have a party on my birthday.', '我生日那天我们开派对。'],
        ],
      },
      {
        pattern: 'on + 表面',
        meaning: '在……上面（接触表面）',
        examples: [['The book is on the desk.', '书在桌子上。']],
      },
      {
        pattern: 'on + 公共交通 / 可站立的交通工具',
        meaning: 'on the bus / train / plane / on foot（小轿车、出租车用 in）',
        examples: [['I met her on the bus.', '我在公交车上遇见了她。']],
      },
      {
        pattern: 'on + 主题',
        meaning: '关于（偏专业、较正式）',
        examples: [['He gave a talk on climate change.', '他做了一场关于气候变化的演讲。']],
      },
      {
        pattern: 'on + 状态',
        meaning: 'on sale / on time / on holiday / on duty / on the phone',
        examples: [
          ['These shoes are on sale.', '这双鞋在打折。'],
          ['The train arrived on time.', '火车准时到达。'],
        ],
      },
      {
        pattern: 'depend / rely / focus / insist + on + 名词 / 动名词',
        meaning: '依赖、依靠、专注于、坚持',
        examples: [['It depends on the weather.', '这取决于天气。']],
      },
    ],
  },
  {
    word: 'for',
    summary: '持续时间、目的、对象和原因',
    uses: [
      {
        pattern: 'for + 一段时间',
        meaning: '持续了多长时间',
        examples: [["I've lived here for five years.", '我在这里住了五年了。']],
      },
      {
        pattern: 'for + 目的 / 用途',
        meaning: '为了、用来',
        examples: [
          ['We went for a walk.', '我们去散了步。'],
          ['This knife is for cutting bread.', '这把刀是用来切面包的。'],
        ],
      },
      {
        pattern: 'for + 对象',
        meaning: '给某人、替某人',
        examples: [['This gift is for you.', '这份礼物是给你的。']],
      },
      {
        pattern: 'thank / sorry / famous / responsible + for + 名词 / 动名词',
        meaning: '表示原因：因为……',
        examples: [
          ['Thank you for coming.', '谢谢你来。'],
          ["I'm sorry for being late.", '抱歉我迟到了。'],
        ],
      },
      {
        pattern: 'for + 价格',
        meaning: '以……的价钱（买、卖）',
        examples: [['I bought it for $20.', '我花 20 美元买的。']],
      },
      {
        pattern: 'wait / look / ask / pay / apply + for + 名词',
        meaning: '等待、寻找、请求、支付、申请',
        examples: [["I'm waiting for a friend.", '我在等一个朋友。']],
      },
    ],
  },
  {
    word: 'to',
    summary: '方向、对象；注意它也可以是不定式的标记',
    uses: [
      {
        pattern: 'to + 地点',
        meaning: '到……去（方向、到达）',
        examples: [["I'm going to the airport.", '我要去机场。']],
      },
      {
        pattern: 'talk / listen / belong / give ... + to + 对象',
        meaning: '对某人说、听、属于、给某人',
        examples: [
          ['Can I talk to you for a minute?', '我能跟你聊一会儿吗？'],
          ['Please give it to me.', '请把它给我。'],
        ],
      },
      {
        pattern: 'to + 动词原形（不定式）',
        meaning: '这里的 to 不是介词，后面接动词原形',
        examples: [['I want to go home.', '我想回家。']],
      },
      {
        pattern: '介词 to + 名词 / 动名词',
        meaning: 'look forward to / be used to / pay attention to / in addition to 后面接 -ing',
        examples: [
          ["I'm looking forward to meeting you.", '我期待见到你。'],
          ["I'm used to getting up early.", '我习惯早起。'],
        ],
      },
      {
        pattern: 'from A to B',
        meaning: '从 A 到 B（地点或时间）；差几分钟到几点用 "分钟 + to + 钟点"',
        examples: [
          ['I work from Monday to Friday.', '我周一到周五上班。'],
          ["It's ten to six.", '差十分钟六点。'],
        ],
      },
    ],
  },
  {
    word: 'with',
    summary: '陪伴、工具、具有和伴随状态',
    uses: [
      {
        pattern: 'with + 人',
        meaning: '和某人一起',
        examples: [['I went shopping with my sister.', '我和姐姐去买东西了。']],
      },
      {
        pattern: 'with + 工具 / 手段',
        meaning: '用……（做某事）',
        examples: [['He cut the cake with a knife.', '他用刀切蛋糕。']],
      },
      {
        pattern: '名词 + with + 名词',
        meaning: '带有、具有',
        examples: [['I want a house with a garden.', '我想要一栋带花园的房子。']],
      },
      {
        pattern: 'with + 名词（伴随状态）',
        meaning: '带着某种表情、情绪或情形',
        examples: [['She said goodbye with a smile.', '她微笑着道别。']],
      },
      {
        pattern: 'agree / deal / help sb / be busy / be satisfied + with + 名词',
        meaning: '同意、处理、帮助某人做某事、忙于、对……满意',
        examples: [
          ['I agree with you.', '我同意你的看法。'],
          ['Can you help me with this?', '你能帮我弄一下这个吗？'],
        ],
      },
    ],
  },
  {
    word: 'of',
    summary: '所属、部分、材料和内容',
    uses: [
      {
        pattern: '名词 + of + 名词',
        meaning: '……的（所属、部分）',
        examples: [
          ['The door of the room is open.', '房间的门开着。'],
          ['He is one of my friends.', '他是我的朋友之一。'],
        ],
      },
      {
        pattern: '数量词 / 容器 + of + 名词',
        meaning: '表示数量、容器里的东西',
        examples: [
          ['a cup of tea', '一杯茶'],
          ['a piece of cake', '一块蛋糕'],
        ],
      },
      {
        pattern: 'be afraid / proud / tired / full / capable + of + 名词 / 动名词',
        meaning: '害怕、自豪、厌倦、充满、有能力',
        examples: [
          ["I'm proud of you.", '我为你感到骄傲。'],
          ['The room is full of people.', '房间里挤满了人。'],
        ],
      },
      {
        pattern: 'think / dream / take care / because + of + 名词',
        meaning: '想到、梦想、照顾、因为',
        examples: [
          ['What do you think of this idea?', '你觉得这个主意怎么样？'],
          ['We stayed home because of the rain.', '因为下雨，我们待在家里。'],
        ],
      },
    ],
  },
  {
    word: 'by',
    summary: '方式、截止时间、执行者和靠近',
    uses: [
      {
        pattern: 'by + 交通方式（不加冠词）',
        meaning: 'by bus / car / train / air / subway',
        examples: [['I go to work by subway.', '我坐地铁上班。']],
      },
      {
        pattern: 'by + 时间点',
        meaning: '不迟于、到……为止',
        examples: [['Please finish it by Friday.', '请在周五前完成。']],
      },
      {
        pattern: 'by + 执行者（被动语态）',
        meaning: '被、由',
        examples: [['The book was written by Mark Twain.', '这本书是马克·吐温写的。']],
      },
      {
        pattern: 'by + 方式 / by + 动名词',
        meaning: '通过某种方法或手段',
        examples: [
          ['You can pay by credit card.', '你可以刷信用卡付款。'],
          ['She improved her English by reading every day.', '她通过每天阅读提高了英语。'],
        ],
      },
      {
        pattern: 'by + 地点',
        meaning: '在……旁边',
        examples: [['I like to sit by the window.', '我喜欢坐在窗边。']],
      },
      {
        pattern: 'by + 差额 / 程度',
        meaning: '相差、增加了……',
        examples: [['Prices rose by 10%.', '价格上涨了 10%。']],
      },
    ],
  },
  {
    word: 'from',
    summary: '起点、来源、区别和分离',
    uses: [
      {
        pattern: 'from + 地点',
        meaning: '从某地；来自某地',
        examples: [["I'm from China.", '我来自中国。']],
      },
      {
        pattern: 'from + 起始时间',
        meaning: '从某个时间开始',
        examples: [
          ['I work from 9 to 5.', '我从九点工作到五点。'],
          ['From now on, I will get up earlier.', '从现在起，我要早点起床。'],
        ],
      },
      {
        pattern: 'from + 来源',
        meaning: '来自、出自',
        examples: [['I got a letter from my mom.', '我收到了妈妈的一封信。']],
      },
      {
        pattern: 'different / far / away + from + 名词',
        meaning: '与……不同、离……很远',
        examples: [['This is different from what I expected.', '这和我预想的不一样。']],
      },
      {
        pattern: 'stop / prevent / protect / keep + 宾语 + from + 动名词',
        meaning: '阻止、防止、保护某人（不）做某事',
        examples: [['The rain stopped us from going out.', '下雨使我们没能出门。']],
      },
      {
        pattern: 'suffer / recover / borrow + from + 名词',
        meaning: '遭受、从……恢复、向……借',
        examples: [['She is recovering from a cold.', '她感冒正在恢复。']],
      },
    ],
  },
  {
    word: 'about',
    summary: '关于、大约和"即将"',
    uses: [
      {
        pattern: 'about + 话题',
        meaning: '关于（较口语）',
        examples: [['This is a book about animals.', '这是一本关于动物的书。']],
      },
      {
        pattern: 'talk / think / worry / care / ask + about + 名词 / 动名词',
        meaning: '谈论、考虑、担心、在乎、询问',
        examples: [
          ["Don't worry about it.", '别担心。'],
          ["What are you thinking about?", '你在想什么？'],
        ],
      },
      {
        pattern: 'how / what about + 名词 / 动名词',
        meaning: '……怎么样？（提建议、征求意见）',
        examples: [
          ['How about going for a walk?', '去散步怎么样？'],
          ['What about you?', '你呢？'],
        ],
      },
      {
        pattern: 'be about to + 动词原形',
        meaning: '即将、正要做某事',
        examples: [['The train is about to leave.', '火车马上要开了。']],
      },
      {
        pattern: 'about + 数字',
        meaning: '大约（此时 about 是副词）',
        examples: [['About 20 people came to the party.', '大约 20 个人来参加了聚会。']],
      },
    ],
  },
  {
    word: 'into',
    summary: '由外向内的运动，或变成另一种状态',
    uses: [
      {
        pattern: '动作 + into + 地点',
        meaning: '进入（强调从外到内的运动）；静止在里面用 in',
        examples: [['She walked into the room.', '她走进了房间。']],
      },
      {
        pattern: 'turn / change / translate / cut + into + 名词',
        meaning: '变成、翻译成、切成',
        examples: [
          ['Please translate this into Chinese.', '请把这个翻译成中文。'],
          ['Cut the apple into pieces.', '把苹果切成块。'],
        ],
      },
      {
        pattern: 'look / run / get + into',
        meaning: 'look into 调查；run into 偶遇；get into trouble 惹上麻烦',
        examples: [
          ['I ran into an old friend yesterday.', '我昨天偶遇了一位老朋友。'],
          ["We'll look into the problem.", '我们会调查这个问题。'],
        ],
      },
      {
        pattern: 'be into + 名词（口语）',
        meaning: '迷上、热衷于',
        examples: [["I'm really into jazz these days.", '我最近特别迷爵士乐。']],
      },
    ],
  },
  {
    word: 'over',
    summary: '在上方、越过、超过和期间',
    uses: [
      {
        pattern: 'over + 地点',
        meaning: '在……正上方（不接触）；越过',
        examples: [
          ['There is a bridge over the river.', '河上有一座桥。'],
          ['He climbed over the wall.', '他翻过了墙。'],
        ],
      },
      {
        pattern: 'over + 数量',
        meaning: '超过',
        examples: [['Over 100 people attended.', '超过 100 人出席了。']],
      },
      {
        pattern: 'over + 一段时间 / 一顿饭',
        meaning: '在……期间',
        examples: [
          ["Let's talk about it over dinner.", '我们边吃晚饭边聊这件事。'],
          ['I stayed there over the weekend.', '我在那里待了一个周末。'],
        ],
      },
      {
        pattern: 'argue / fight + over + 名词',
        meaning: '为……争吵',
        examples: [['They argued over money.', '他们为钱吵架。']],
      },
      {
        pattern: 'get over / think over',
        meaning: '从……中恢复；仔细考虑',
        examples: [['It took me a week to get over the flu.', '我花了一周才从流感中恢复过来。']],
      },
    ],
  },
  {
    word: 'through',
    summary: '从内部穿过、贯穿全程',
    uses: [
      {
        pattern: 'through + 地点',
        meaning: '穿过（从一头到另一头）',
        examples: [['We walked through the park.', '我们穿过公园。']],
      },
      {
        pattern: 'walk / go / read + 宾语 + through',
        meaning: '从头到尾过一遍、带某人了解一遍',
        examples: [
          ['Could you walk me through it?', '你能带我过一遍吗？'],
          ['I went through the report twice.', '我把报告过了两遍。'],
        ],
      },
      {
        pattern: 'through + 时间段',
        meaning: '自始至终、整个期间',
        examples: [['It rained through the night.', '雨下了一整夜。']],
      },
      {
        pattern: 'through + 方式 / 经历',
        meaning: '通过某种途径；get through 度过、接通',
        examples: [
          ['She learned English through practice.', '她通过练习学会了英语。'],
          ['I finally got through to him.', '我终于打通了他的电话。'],
        ],
      },
    ],
  },
  {
    word: 'between',
    summary: '两者之间（三者及以上用 among）',
    uses: [
      {
        pattern: 'between A and B',
        meaning: '在 A 和 B 之间（时间、位置、数量）',
        examples: [
          ['Call me between 5 and 6 p.m.', '下午五点到六点之间给我打电话。'],
          ['He sat between Tom and Mary.', '他坐在汤姆和玛丽中间。'],
        ],
      },
      {
        pattern: 'choose / difference + between A and B',
        meaning: '在两者之间选择；两者的区别',
        examples: [['What is the difference between these two words?', '这两个词有什么区别？']],
      },
      {
        pattern: 'between + 双方',
        meaning: '双方之间的关系或协议',
        examples: [["Let's keep this between you and me.", '这事就咱俩知道。']],
      },
    ],
  },
];

export const COLLOCATIONS: Collocation[] = [
  // 形容词 + 介词
  { pattern: 'be allergic to + 名词', words: ['allergic'], meaning: '对……过敏', example: ["I'm allergic to peanuts.", '我对花生过敏。'] },
  { pattern: 'be interested in + 名词 / 动名词', words: ['interested'], meaning: '对……感兴趣', example: ["I'm interested in learning Spanish.", '我对学西班牙语感兴趣。'] },
  { pattern: 'be good at + 名词 / 动名词', words: ['good'], meaning: '擅长', example: ["She's good at cooking.", '她擅长烹饪。'] },
  { pattern: 'be afraid of + 名词 / 动名词', words: ['afraid'], meaning: '害怕', example: ["I'm afraid of flying.", '我怕坐飞机。'] },
  { pattern: 'be proud of + 名词 / 动名词', words: ['proud'], meaning: '为……自豪', example: ["I'm proud of you.", '我为你骄傲。'] },
  { pattern: 'be tired of + 名词 / 动名词', words: ['tired'], meaning: '厌倦', note: 'be tired from 表示"因……而疲劳"', example: ["I'm tired of waiting.", '我等烦了。'] },
  { pattern: 'be famous for + 名词', words: ['famous'], meaning: '因……而出名', example: ['Paris is famous for its food.', '巴黎以美食闻名。'] },
  { pattern: 'be used to + 名词 / 动名词', words: ['used'], meaning: '习惯于', note: '注意区别：used to + 动词原形 表示"过去常常"', example: ["I'm used to working late.", '我习惯加班。'] },
  { pattern: 'be satisfied with + 名词', words: ['satisfied'], meaning: '对……满意', example: ["I'm satisfied with the result.", '我对结果很满意。'] },
  { pattern: 'be busy with + 名词 / busy doing', words: ['busy'], meaning: '忙于', example: ["I'm busy with my homework.", '我在忙作业。'] },
  { pattern: 'be responsible for + 名词', words: ['responsible'], meaning: '对……负责', example: ["She's responsible for the budget.", '她负责预算。'] },
  { pattern: 'be different from + 名词', words: ['different'], meaning: '与……不同', example: ['This one is different from that one.', '这个和那个不一样。'] },
  { pattern: 'be familiar with + 名词', words: ['familiar'], meaning: '熟悉', example: ["I'm not familiar with this software.", '我不熟悉这个软件。'] },
  { pattern: 'be worried about + 名词', words: ['worried'], meaning: '担心', example: ["I'm worried about the exam.", '我担心考试。'] },
  { pattern: 'be excited / nervous about + 名词', words: ['excited', 'nervous'], meaning: '对……感到兴奋 / 紧张', example: ["I'm nervous about the interview.", '我对面试感到紧张。'] },
  { pattern: 'be late for + 名词', words: ['late'], meaning: '……迟到', example: ["Don't be late for class.", '上课别迟到。'] },
  { pattern: 'be ready for + 名词 / be ready to + 动词原形', words: ['ready'], meaning: '准备好', example: ["Are you ready for the test?", '你准备好考试了吗？'] },
  { pattern: 'be surprised at / by + 名词', words: ['surprised'], meaning: '对……感到惊讶', example: ["I was surprised at the news.", '我对这个消息感到惊讶。'] },
  { pattern: 'be married to + 人', words: ['married'], meaning: '与……结婚（状态）', example: ['She is married to a doctor.', '她嫁给了一位医生。'] },

  // 动词 + 介词
  { pattern: 'look forward to + 名词 / 动名词', words: ['forward'], meaning: '期待', note: '这里的 to 是介词，后面接 -ing', example: ["I'm looking forward to seeing you.", '我期待见到你。'] },
  { pattern: 'look at / look for / look after / look up / look into / look out', words: ['look'], meaning: 'look at 看；look for 寻找；look after 照顾；look up 查（词典等）；look into 调查；look out 当心', example: ["I'm looking for my keys.", '我在找我的钥匙。'] },
  { pattern: 'depend on + 名词', words: ['depend'], meaning: '取决于、依赖', example: ['It depends on the situation.', '这要看情况。'] },
  { pattern: 'rely on + 名词', words: ['rely'], meaning: '依靠', example: ['You can rely on me.', '你可以靠我。'] },
  { pattern: 'focus on + 名词 / 动名词', words: ['focus'], meaning: '专注于', example: ['Please focus on your work.', '请专注于你的工作。'] },
  { pattern: 'insist on + 名词 / 动名词', words: ['insist'], meaning: '坚持', example: ['He insisted on paying.', '他坚持要付钱。'] },
  { pattern: 'wait for + 名词', words: ['wait'], meaning: '等待', example: ['Wait for me here.', '在这里等我。'] },
  { pattern: 'ask for / apply for / pay for / search for + 名词', words: ['ask', 'apply', 'pay', 'search'], meaning: '请求 / 申请 / 支付 / 搜寻', example: ["I'd like to apply for this job.", '我想申请这份工作。'] },
  { pattern: 'talk to sb about sth', words: ['talk'], meaning: '和某人谈某事', example: ['I need to talk to you about something.', '我有件事想跟你谈谈。'] },
  { pattern: 'listen to + 名词', words: ['listen'], meaning: '听（有意去听）', example: ['I like listening to music.', '我喜欢听音乐。'] },
  { pattern: 'belong to + 名词', words: ['belong'], meaning: '属于', example: ['This bag belongs to her.', '这个包是她的。'] },
  { pattern: 'agree with sb / agree to sth', words: ['agree'], meaning: '同意某人 / 同意某事', example: ['I agree with you.', '我同意你。'] },
  { pattern: 'deal with + 名词', words: ['deal'], meaning: '处理、应对', example: ['How do you deal with stress?', '你怎么应对压力？'] },
  { pattern: 'help sb with sth / help sb (to) do sth', words: ['help'], meaning: '帮助某人做某事', example: ['Can you help me with my luggage?', '你能帮我拿行李吗？'] },
  { pattern: 'think of / think about', words: ['think'], meaning: 'think of 想到、认为；think about 考虑', example: ['What do you think of this movie?', '你觉得这部电影怎么样？'] },
  { pattern: 'walk sb through sth', words: ['walk'], meaning: '带某人把某事过一遍', example: ['Let me walk you through the steps.', '我带你把步骤过一遍。'] },
  { pattern: 'run out of / run into', words: ['run'], meaning: 'run out of 用完；run into 偶遇', example: ["We've run out of milk.", '我们的牛奶喝完了。'] },
  { pattern: 'get along with / get on with', words: ['get'], meaning: '与……相处；继续做', example: ['I get along well with my roommate.', '我和室友相处得很好。'] },
  { pattern: 'catch up with + 人 / 事', words: ['catch'], meaning: '赶上；（与朋友）叙旧', example: ["Let's catch up over coffee.", '我们边喝咖啡边叙叙旧。'] },
  { pattern: 'come up with + 想法', words: ['come'], meaning: '想出（主意、办法）', example: ['She came up with a great idea.', '她想出了一个好主意。'] },
  { pattern: 'keep in touch with + 人', words: ['touch'], meaning: '与……保持联系', example: ["Let's keep in touch.", '我们保持联系。'] },
  { pattern: 'stop / prevent / keep + 宾语 + from + 动名词', words: ['stop', 'prevent'], meaning: '阻止某人做某事', example: ['Nothing can stop me from trying.', '什么都不能阻止我尝试。'] },
  { pattern: 'suffer from / recover from', words: ['suffer', 'recover'], meaning: '遭受（疾病等）/ 从……中恢复', example: ['He suffers from headaches.', '他饱受头痛之苦。'] },
  { pattern: 'take care of + 名词', words: ['care'], meaning: '照顾；处理', example: ['Please take care of yourself.', '请照顾好自己。'] },
  { pattern: 'thank sb for + 名词 / 动名词', words: ['thank'], meaning: '为……感谢某人', example: ['Thank you for your help.', '谢谢你的帮助。'] },
  { pattern: 'apologize to sb for + 名词 / 动名词', words: ['apologize'], meaning: '为……向某人道歉', example: ['I apologize for the delay.', '对于延误我深表歉意。'] },
  { pattern: 'spend + 时间 / 金钱 + on sth / (in) doing sth', words: ['spend'], meaning: '花时间或金钱做某事', example: ['I spent two hours on this report.', '我在这份报告上花了两小时。'] },

  // 固定句型
  { pattern: 'enjoy / finish / avoid / practice / suggest / mind / keep + 动名词（-ing）', words: ['enjoy', 'finish', 'avoid', 'practice', 'suggest', 'mind', 'keep'], meaning: '这些动词后面直接接动名词，不接 to do', note: 'Do you mind + 动名词 / Do you mind if I + 动词（一般现在时）', example: ['Do you mind if I open the window?', '你介意我开窗吗？'] },
  { pattern: 'want / need / decide / hope / plan / manage / expect + to + 动词原形', words: ['want', 'need', 'decide', 'hope', 'plan', 'manage', 'expect'], meaning: '这些动词后面接动词不定式', example: ['I decided to stay home.', '我决定待在家里。'] },
  { pattern: 'let / make / have + 宾语 + 动词原形', words: ['let', 'make', 'have'], meaning: '让某人做某事（不带 to）', example: ['Let me know when you arrive.', '到了告诉我一声。'] },
  { pattern: 'would like to + 动词原形 / would like + 名词', words: ['would', 'like'], meaning: '想要（比 want 更礼貌）', example: ["I'd like to book a table for two.", '我想订一张两人桌。'] },
  { pattern: 'Could / Can / Would you + 动词原形', words: ['could', 'can', 'would'], meaning: '礼貌地请求别人做某事', example: ['Could you take a picture of us?', '你能帮我们拍张照吗？'] },
  { pattern: 'be going to + 动词原形', words: ['going'], meaning: '打算、即将发生', example: ["It's going to rain.", '要下雨了。'] },
];

const PREPOSITION_BY_WORD = new Map(PREPOSITIONS.map((p) => [p.word, p]));
const COLLOCATIONS_BY_WORD = new Map<string, Collocation[]>();
for (const c of COLLOCATIONS) {
  for (const w of c.words) COLLOCATIONS_BY_WORD.set(w, [...(COLLOCATIONS_BY_WORD.get(w) ?? []), c]);
}

/** candidates 为该单词可能的原形（见 wordForms.ts），按顺序取第一个命中的 */
export function grammarFor(candidates: string[]): { preposition?: Preposition; collocations: Collocation[] } {
  const preposition = candidates.map((w) => PREPOSITION_BY_WORD.get(w)).find(Boolean);
  const collocations = [...new Set(candidates.flatMap((w) => COLLOCATIONS_BY_WORD.get(w) ?? []))];
  return { preposition, collocations };
}

export const TIME_PLACE_COMPARE = {
  time: [
    { prep: 'at', rule: '具体时刻、时间点', examples: 'at 7:30 / at noon / at night / at the moment' },
    { prep: 'on', rule: '具体的某一天', examples: 'on Monday / on May 1st / on my birthday' },
    { prep: 'in', rule: '较长的时间段', examples: 'in May / in 2026 / in summer / in the morning' },
  ],
  place: [
    { prep: 'at', rule: '把地点当作一个点', examples: 'at the station / at the door / at home / at work' },
    { prep: 'on', rule: '表面上', examples: 'on the table / on the wall / on the third floor' },
    { prep: 'in', rule: '空间内部、较大的范围', examples: 'in the room / in Shanghai / in China / in the box' },
  ],
};
