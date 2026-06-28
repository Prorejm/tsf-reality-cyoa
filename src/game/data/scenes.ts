// ===== 场景定义 - 常識改変TSF × Monster Girl =====
// type: 'exploration' 普通探索 | 'event' 事件触发 | 'boss' BOSS区域 | 'safe' 安全区

export type SceneType = 'exploration' | 'event' | 'boss' | 'safe';

export interface Scene {
  id: string;
  nameCN: string;
  zone: string;
  description: {
    resident: string;
    truth: string;
  };
  connectedScenes: string[];
  type: SceneType;
  erosionThreshold?: number;  // 需要侵蚀率达到多少才能看到真实面
  timeVariants?: {
    morning?: { resident: string; truth: string };
    afternoon?: { resident: string; truth: string };
    evening?: { resident: string; truth: string };
    night?: { resident: string; truth: string };
  };
  specialFlags?: string[];  // 特殊标记（如：有怪物娘出没、有身份改写事件等）
}

export const scenes: Scene[] = [

  // ==================== 边界街区 ====================

  // --- 地铁站 ---
  {
    id: 'subway_station',
    nameCN: '地铁站',
    zone: 'border_district',
    description: {
      resident:
        '这是一座典型的城市地铁站，站台铺设着白色瓷砖，电子显示屏滚动着列车时刻信息。' +
        '早高峰时段人头攒动，晚高峰则略显疲惫。站内有一家小小的便利店和自动售票机。' +
        '广播里用标准的普通话报站，一切都井然有序。',
      truth:
        '电子显示屏上的文字偶尔会闪变成看不懂的符文。' +
        '隧道深处传来的不是列车的声音，而是某种低沉的呼吸声。' +
        '站台上的乘客中，有些人的影子与身体动作不一致——慢了半拍，或者方向相反。' +
        '最可怕的是，你注意到有几节车厢的门打开后，里面是完全不同的地方——' +
        '一片森林、一个图书馆，或者什么都没有的虚空。',
    },
    connectedScenes: ['convenience_store', 'central_district'],
    type: 'exploration',
    erosionThreshold: 15,
    timeVariants: {
      morning: {
        resident: '早高峰的地铁站挤满了通勤者，脚步匆忙，咖啡香气和汗水味混在一起。',
        truth: '拥挤的人群中，你分辨不出哪些是「人」。有些面孔不断变化，有些则根本没有五官。',
      },
      afternoon: {
        resident: '午后的站台乘客稀少，阳光从天窗斜射下来，在地面上投下温暖的光斑。',
        truth: '没有阳光。天窗透进来的是灰白色的光，没有来源，也不照亮任何东西。',
      },
      evening: {
        resident: '傍晚时分，夕阳的余晖染红了站台的瓷砖。下班的人们拖着疲惫的身体踏上归途。',
        truth: '夕阳是假的。那是一片覆盖了整个天空的巨大投影。真正的天空早已消失。',
      },
      night: {
        resident: '末班车过后，地铁站变得空旷安静，只有保洁员在打扫卫生。',
        truth: '深夜的站台是最危险的。你能听到铁轨深处传来少女的啜泣声和低语。不要看隧道。',
      },
    },
    specialFlags: ['tsf_event_zone', 'monster_girl_encounter_possible'],
  },

  // --- 便利店 ---
  {
    id: 'convenience_store',
    nameCN: '便利店',
    zone: 'border_district',
    description: {
      resident:
        '街角24小时营业的便利店，门头挂着暖黄色的招牌。' +
        '店内货架整齐排列，从饭团、便当到日用百货一应俱全。' +
        '收银台后面站着一位年轻的店员，总是笑容满面地迎接顾客。' +
        '这家店是街坊邻居经常光顾的地方。',
      truth:
        '货架上的商品标签偶尔会变——「饭团」会变成「■■肉块」然后又恢复。' +
        '冷柜里的盒饭发出微弱的心跳声。' +
        '那位店员的笑容——你仔细看——她的嘴角裂开的幅度超过了人类的极限。' +
        '店内有股若有若无的甜味，像是熟透的水果和铁锈的混合。',
    },
    connectedScenes: ['subway_station', 'residential_area'],
    type: 'exploration',
    erosionThreshold: 10,
    specialFlags: ['monster_girl_present'],
  },

  // --- 旧书店 ---
  {
    id: 'old_bookstore',
    nameCN: '旧书店',
    zone: 'border_district',
    description: {
      resident:
        '开在巷子深处的老书店，门面狭窄，店内堆满了各式各样的旧书。' +
        '空气中弥漫着纸张和油墨的独特香气。' +
        '店主是一位寡言的老人，戴着老花镜，很少主动和顾客攀谈。' +
        '偶尔有学生来这里找绝版的参考书，或者收藏家来淘旧版小说。',
      truth:
        '这些「书」的内容在你翻看时会发生变化。前一秒还是《近代史纲要》，' +
        '下一秒文字就变成了某种日记——笔迹潦草地记录着「她们」如何适应人类生活。' +
        '角落里有几本没有标题的书，封面是人的皮肤质感，摸上去还有温度。' +
        '那位「老人」——你注意到他镜片后面的眼睛，瞳孔是竖直的。',
    },
    connectedScenes: ['residential_area', 'library'],
    type: 'safe',
    erosionThreshold: 20,
    specialFlags: ['information_source'],
  },

  // --- 住宅区 ---
  {
    id: 'residential_area',
    nameCN: '住宅区',
    zone: 'border_district',
    description: {
      resident:
        '典型的城市住宅区，由几栋六层老式居民楼组成。' +
        '楼下有小花园和健身器材，退休的老人们喜欢在凉亭里下棋聊天。' +
        '阳台上晾晒着各式衣物，偶尔传来炒菜的香气和电视的声音。' +
        '入夜后，窗户里透出温暖的黄色灯光。',
      truth:
        '你数过，这里明明只有六栋楼，但无论怎么走都会经过第七栋——' +
        '那栋灰色的、窗户全部漆黑的大楼。' +
        '阳台上晾晒的「衣物」，有些长得不像人类的尺寸。' +
        '深夜从某个单元传出的不是电视声，而是多人（或非人）的合唱。' +
        '凉亭下的棋局，棋盘上的棋子是自己移动的。',
    },
    connectedScenes: ['convenience_store', 'old_bookstore', 'park'],
    type: 'exploration',
    erosionThreshold: 18,
    specialFlags: ['residential', 'identity_shift_possible'],
  },

  // --- 公园 ---
  {
    id: 'park',
    nameCN: '公园',
    zone: 'border_district',
    description: {
      resident:
        '社区中心的小公园，有一条鹅卵石步道环绕着中央喷泉。' +
        '长椅上坐着推婴儿车的妈妈、遛狗的老人、约会的年轻情侣。' +
        '公园角落有一个滑梯和秋千组成的儿童游乐区。' +
        '周末有时会有小型集市或社区活动。',
      truth:
        '喷泉里涌出的水泛着荧光，水底沉着不该属于这个世界的硬币和骨片。' +
        '那些「婴儿」——有些过于安静了，你走近时发现婴儿车里是蜷缩着的成年生物。' +
        '秋千在没有人的情况下自己前后摆动，轨迹完全不符合物理定律。' +
        '草坪上长出了不认识的花，花瓣是半透明的，花蕊像眼睛一样注视着你。',
    },
    connectedScenes: ['residential_area', 'flower_shop'],
    type: 'exploration',
    erosionThreshold: 15,
    timeVariants: {
      night: {
        resident: '夜晚的公园很安静，只有几盏路灯提供照明。偶尔有夜跑的人经过。',
        truth: '晚上的公园不属于人类。你能看到树影下有发光的轮廓在移动，似人非人。',
      },
    },
    specialFlags: ['monster_girl_encounter_possible'],
  },

  // ==================== 中央商业区 ====================

  // --- 学校 ---
  {
    id: 'school',
    nameCN: '学校',
    zone: 'central_district',
    description: {
      resident:
        '一座公立中学，有着红砖外墙和宽阔的操场。' +
        '教学楼共有五层，走廊两侧挂着学生的画作和名人名言。' +
        '课间时分，学生们在走廊和操场上嬉闹，充满了青春的活力。' +
        '学校的钟楼是这一带的标志性建筑。',
      truth:
        '课表上有些课程名称是你从未听说过的——「变身实技」「常识适应训练」「异种生物学」。' +
        '但所有学生都神色如常地走进这些教室。' +
        '走廊上的「画作」画的是长着触手的生物和半人半兽的存在，笔触熟练得不像学生作品。' +
        '操场上，一群女生的影子在黄昏时分变成了完全不同的形状。' +
        '钟楼的时针一度停在了4:44，秒针逆行。',
    },
    connectedScenes: ['library', 'hospital', 'shopping_street'],
    type: 'exploration',
    erosionThreshold: 25,
    specialFlags: ['identity_shift_possible', 'tsf_event_zone'],
  },

  // --- 医院 ---
  {
    id: 'hospital',
    nameCN: '医院',
    zone: 'central_district',
    description: {
      resident:
        '一所综合医院，主体建筑是一栋八层的白色大楼。' +
        '大厅里有接待处和挂号窗口，墙壁上张贴着健康宣传海报。' +
        '各科室分布在不同的楼层，急诊科在一楼，手术室在五楼，住院部在六至八楼。' +
        '医护人员穿着白大褂忙碌穿梭，消毒水的气味弥漫在空气中。',
      truth:
        '妇产科的病房里住着一些不太寻常的「孕妇」——' +
        '她们的肚子隆起的方式不像正常的妊娠，有时能透过肚皮看到里面的东西在发光。' +
        '病历档案柜里有一些标着「物种：不明」的档案。' +
        '夜间的急诊科会接待一些身体部位明显不属于人类的「患者」，' +
        '但护士们似乎完全没注意到异常——或者说她们自己也并非人类。' +
        '太平间的门永远锁着，但你偶尔能听到里面传来敲门声。',
    },
    connectedScenes: ['school', 'flower_shop', 'bar'],
    type: 'exploration',
    erosionThreshold: 30,
    timeVariants: {
      night: {
        resident: '夜间的医院安静许多，只有急诊科和住院部还有灯光。值班护士在护士台低头看书。',
        truth: '夜间的医院是最活跃的。那些「患者」们在走廊里走动，她们的影子映在墙上——不是人类的轮廓。',
      },
    },
    specialFlags: ['monster_girl_present', 'medical'],
  },

  // --- 商店街 ---
  {
    id: 'shopping_street',
    nameCN: '商店街',
    zone: 'central_district',
    description: {
      resident:
        '商业区的核心步行街，两旁排列着各式各样的店铺。' +
        '服装店、饰品店、玩具店、餐饮店……应有尽有。' +
        '周末总是人满为患，平时下班后也有不少人来逛街放松。' +
        '街头艺人和促销活动让这里充满了活力。',
      truth:
        '有几家店的橱窗里陈列着不是卖给「人类」的商品——' +
        '抑制尾巴生长的喷雾、伪装耳朵的发饰、稳定变形药水……' +
        '但路过的普通居民视若无睹，仿佛这些东西理所当然地存在于商店里。' +
        '玩具店里的玩偶会在你没看的时候转头。' +
        '服装店的试衣间里时不时传出非人的低吼声。',
    },
    connectedScenes: ['tailor_shop', 'cafe', 'flower_shop', 'bar'],
    type: 'exploration',
    erosionThreshold: 28,
    specialFlags: ['commercial'],
  },

  // --- 酒吧 ---
  {
    id: 'bar',
    nameCN: '酒吧',
    zone: 'central_district',
    description: {
      resident:
        '位于商店街尽头的酒吧，招牌上画着一颗半燃烧的心形。' +
        '店内灯光暧昧，播放着慵懒的爵士乐。吧台后方的酒柜上摆满了各种酒瓶。' +
        '这里的客人以成年人为主，气氛放松而私密。' +
        '老板娘是一位风情万种的女性，据说调酒技术一流。',
      truth:
        '这家酒吧是怪物娘们的地下社交场所。' +
        '吧台后面的「酒柜」里有一些装在瓶子里的萤火虫般的发光物——那是某种精粹。' +
        '老板娘——她确实是魅魔，而且毫不掩饰。她的尾巴和角在昏暗灯光下若隐若现。' +
        '来这里的客人有一半是怪物娘，她们在这里可以卸下伪装，自由地伸展翅膀、尾巴和触手。' +
        '如果你点了「特制鸡尾酒」，喝完可能会暂时看到所有人的真实面貌。',
    },
    connectedScenes: ['shopping_street', 'hotel'],
    type: 'exploration',
    erosionThreshold: 35,
    specialFlags: ['monster_girl_present', 'underground'],
    timeVariants: {
      night: {
        resident: '夜晚的酒吧人流渐增，音乐声稍微大了一些，气氛热烈起来。',
        truth: '入夜后，这里几乎完全变成了怪物娘的领地。伪装几乎完全撤去，欢声笑语中混杂着非人的声音。',
      },
    },
  },

  // --- 图书馆 ---
  {
    id: 'library',
    nameCN: '图书馆',
    zone: 'central_district',
    description: {
      resident:
        '城市公共图书馆，一座三层楼的欧式建筑。' +
        '藏书丰富，从文学作品到专业期刊应有尽有。' +
        '阅览室宽敞明亮，适合安静地阅读和学习。' +
        '图书馆的二楼有一间小型展览室，定期更换主题展览。',
      truth:
        '在「非虚构」区，有一些书名让你脊背发凉——《如何伪装成人类：怪物娘生存指南》' +
        '《常识改变下的身份管理》《TSF适应期心理辅导》。' +
        '这些书的借阅记录上密密麻麻，但借阅者的名字你一个都不认识。' +
        '二楼展览室正在展出「城市变迁史」——其中的照片在你眨眼时会改变内容。' +
        '有些照片里出现了你认识的人，但她们长着角或翅膀。',
    },
    connectedScenes: ['old_bookstore', 'school', 'cafe'],
    type: 'safe',
    erosionThreshold: 25,
    specialFlags: ['information_source'],
  },

  // --- 裁缝店 ---
  {
    id: 'tailor_shop',
    nameCN: '裁缝店',
    zone: 'central_district',
    description: {
      resident:
        '一家经营了数十年的老牌裁缝店，橱窗里展示着精致的西装和礼服。' +
        '店内摆满了各种布料样本，缝纫机的声音从里屋传出。' +
        '老板是一位技艺精湛的老裁缝，据说政商名流都是他的客户。' +
        '墙上挂着几幅老照片，记录着这条街的历史。',
      truth:
        '这位「老裁缝」在做的不是普通的衣服。' +
        '架子上挂着一些特殊设计的成衣——尾部开口的裤子、翅膀根部留空的背心、' +
        '以及一种能「抑制变形」的特殊面料制成的内衣。' +
        '墙上的「老照片」里的人——有些长着不属于人类的特征。' +
        '这只是你看到的东西，但你开始怀疑：这些衣服是为谁做的？',
    },
    connectedScenes: ['shopping_street', 'old_bookstore'],
    type: 'exploration',
    erosionThreshold: 30,
    specialFlags: ['information_source'],
  },

  // --- 咖啡厅 ---
  {
    id: 'cafe',
    nameCN: '咖啡厅',
    zone: 'central_district',
    description: {
      resident:
        '一家文艺风格的独立咖啡厅，店面不大但布置得很温馨。' +
        '墙上挂着本地艺术家的画作，书架上摆满了各种杂志和小说。' +
        '咖啡师手法专业，拉花精美。午后阳光透过落地窗洒进来，' +
        '是适合一个人发呆或和朋友聊天的好去处。',
      truth:
        '咖啡厅的菜单背面印着另一份菜单——上面的饮品名称很奇怪：' +
        '「稳定剂（人类形态维持用）」「魔力恢复特调」「感知屏蔽茶」。' +
        '部分客人一边喝咖啡一边看报纸，报纸上的新闻标题和你记得的不一样。' +
        '比如说，头条写着「关于怪物娘公民权利的法案通过第三轮审议」。' +
        '但你完全不记得有这回事。',
    },
    connectedScenes: ['library', 'shopping_street', 'flower_shop'],
    type: 'safe',
    erosionThreshold: 22,
    specialFlags: ['information_source'],
  },

  // --- 游泳馆 ---
  {
    id: 'swimming_pool',
    nameCN: '游泳馆',
    zone: 'central_district',
    description: {
      resident:
        '室内游泳馆，水质清澈，温度适宜。' +
        '有标准泳道和儿童戏水区，还有桑拿房和淋浴间。' +
        '工作日下午人不多，偶尔有学校体育课在这里上课。' +
        '救生员坐在高高的椅子上，百无聊赖地看着水面。',
      truth:
        '更衣室里，你注意到一些隔间门上贴着「非人类使用者」的标志。' +
        '泳池中有一个身影游得极快——不，那不是人类的速度。' +
        '当她在泳道尽头转身换气时，你看到她腰部以下覆盖着闪亮的鳞片。' +
        '人鱼。她真的是人鱼。' +
        '但周围的其他人似乎完全没注意到。或者说，他们觉得有美人鱼在游泳是很正常的事？',
    },
    connectedScenes: ['school', 'hospital'],
    type: 'exploration',
    erosionThreshold: 32,
    specialFlags: ['monster_girl_present'],
  },

  // --- 花店 ---
  {
    id: 'flower_shop',
    nameCN: '花店',
    zone: 'central_district',
    description: {
      resident:
        '街角的一家小花店，门口摆满了色彩缤纷的盆栽和鲜花。' +
        '店里有一位年轻的女店主，总是温柔地微笑着，' +
        '会根据顾客的需求精心搭配花束。空气中弥漫着各种花香混合的甜美气息。' +
        '这家店在当地口碑很好，很多人在节日或纪念日来买花。',
      truth:
        '这位「女店主」的头发里夹杂着细小的藤蔓和嫩芽，她身上的香味不是香水——' +
        '那是她自己的体液的气味。她的手指甲下面隐约透着绿色，像是植物的汁液。' +
        '花店后面有一个小小的温室，里面种植着一些你在任何植物图鉴上都见不到的品种——' +
        '那些花会动，会发出微弱的声音，甚至会跟随你的移动转动花盘。' +
        '她卖的花有着特殊效果：有些能让你镇定，有些则会唤起被压抑的记忆。',
    },
    connectedScenes: ['park', 'cafe', 'hospital'],
    type: 'exploration',
    erosionThreshold: 25,
    specialFlags: ['monster_girl_present'],
  },

  // ==================== 扭曲核心 ====================

  // --- 市政大厅 ---
  {
    id: 'city_hall',
    nameCN: '市政大厅',
    zone: 'distortion_core',
    description: {
      resident:
        '一座庄严的欧式建筑，是市政部门的办公地点。' +
        '大厅内铺着大理石地板，悬挂着市徽和历任市长的肖像。' +
        '工作人员在柜台后处理市民的各项事务，秩序井然。' +
        '市长办公室在三楼，据说市长是一位能力出众的女性领导者。',
      truth:
        '市政大厅内部的空间结构完全不合理——你明明上了三楼，' +
        '但窗外的景色显示你在十几层的高度。' +
        '历任市长的肖像画中，越是近代的肖像越不像人类——' +
        '最近的那幅画中，市长的眼睛是竖瞳，微笑中露出尖牙。' +
        '墙上张贴的「市政公告」的标题是《关于非人种居民户籍管理的补充规定》。' +
        '大楼深处传来有规律的震动，像是什么巨大的东西在呼吸。',
    },
    connectedScenes: ['shrine', 'church', 'abyss_corridor'],
    type: 'exploration',
    erosionThreshold: 55,
    specialFlags: ['boss_area', 'government'],
  },

  // --- 神社 ---
  {
    id: 'shrine',
    nameCN: '神社',
    zone: 'distortion_core',
    description: {
      resident:
        '一座古老的神社，隐藏在旧城区的树林深处。' +
        '朱红色的鸟居立在参道的入口，两旁是茂密的竹林。' +
        '主殿供奉着当地的土地神，偶尔有虔诚的居民前来参拜。' +
        '神社有一位年轻的巫女负责日常的清扫和祭祀活动。',
      truth:
        '鸟居上刻着的不是传统的符文——那些符号在蠕动，像活物一样沿着柱子爬行。' +
        '穿过鸟居的一瞬间，你能感觉到有什么东西穿过了你的身体——' +
        '像是被扫描了一遍。' +
        '竹林里藏着发光的眼睛，但你仔细看时又消失了。' +
        '这位「巫女」——她的头顶上隐藏着毛茸茸的狐耳，身后有一条（或者多条）尾巴。' +
        '神社的地下有一个祭坛，祭坛上刻着维持整个城市常识改变的结界符文。' +
        '她是这个结界的守护者之一。',
    },
    connectedScenes: ['city_hall', 'church', 'abyss_corridor'],
    type: 'exploration',
    erosionThreshold: 55,
    specialFlags: ['monster_girl_present', 'key_location'],
  },

  // --- 教堂 ---
  {
    id: 'church',
    nameCN: '教堂',
    zone: 'distortion_core',
    description: {
      resident:
        '一座哥特式风格的教堂，彩色玻璃窗上描绘着圣经故事。' +
        '教堂内部庄严肃穆，木质长椅排列整齐。' +
        '每個周日仍有信徒来做弥撒，神父是一位慈祥的老人。' +
        '教堂后面的墓地安葬着这座城市的早期建设者。',
      truth:
        '走进教堂时，彩色玻璃窗上的圣人和天使——你眨了眨眼——' +
        '那些天使的形象有着多只翅膀和无法描述的眼睛，和神话中描述的一致，' +
        '但同时也充满了非人的恐怖感。' +
        '神父的脖子上戴着一条吊坠，吊坠里的图案不是十字架，而是某种远古的符文。' +
        '教堂地下是一个巨大的空间，排列着各种标本罐——' +
        '里面浸泡着半人半兽的胚胎。这座教堂在「研究」常识改变的真相。' +
        '墓地里有一些墓碑上的生卒年代不合理地漫长。',
    },
    connectedScenes: ['city_hall', 'shrine', 'abyss_corridor'],
    type: 'event',
    erosionThreshold: 60,
    specialFlags: ['key_location', 'research'],
  },

  // --- 深淵回廊 ---
  {
    id: 'abyss_corridor',
    nameCN: '深淵回廊',
    zone: 'distortion_core',
    description: {
      resident:
        '关于这个地点，在你的记忆中没有任何信息。' +
        '或者说，你的记忆在这里出现了断层。' +
        '你知道这里存在，但不知道它是什么、在哪里、长什么样。' +
        '地图上没有这个地方，问任何人也都得到含糊的回答。' +
        '但你隐约觉得，这里是所有问题的答案所在。',
      truth:
        '深淵回廊不是一个物理意义上的「地点」。' +
        '它是现实与现实之间的缝隙，是常识改变的源头。' +
        '在这里，你可以看到这座城市所有的「真相」交织在一起——' +
        '过去、现在、未来同时存在。' +
        '你能看到这座城市变成怪物乐园的全过程，' +
        '能看到每一个被常识改变吞噬的普通人的记忆碎片。' +
        '在这里，你可以选择：接受这一切，还是抵抗到底。' +
        '或者——你自己也变成她们的一部分。',
    },
    connectedScenes: ['city_hall', 'shrine', 'church'],
    type: 'boss',
    erosionThreshold: 80,
    specialFlags: ['final_area', 'truth_revelation'],
  },
];

export default scenes;
