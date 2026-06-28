// ===== 区域定义 - 常識改変TSF × Monster Girl =====
// 每个区域包含「居民感知」与「真实感知」的双重描述

export interface Zone {
  id: string;
  name: string;
  nameCN: string;
  description: {
    resident: string;  // 居民眼中的「正常」描述
    truth: string;     // 侵蚀后揭示的真实面貌
  };
  erosionRange: [number, number];  // 最低侵蚀率 ~ 最高侵蚀率
  scenes: string[];   // 包含的场景ID列表
  unlockConditions: {
    requiredErosion: number;
    prerequisite?: string; // 前置事件或条件
    description: string;
  };
  ambient: {
    resident: string;  // 居民感知的环境氛围
    truth: string;     // 真实的环境氛围
  };
  connectedZones: string[]; // 相邻区域
}

export const zones: Zone[] = [
  // ==================== 边界街区（Border District）====================
  {
    id: 'border_district',
    name: 'Border District',
    nameCN: '边界街区',
    description: {
      resident:
        '边界街区是城市边缘的老旧住宅区，街道两旁栽种着梧桐树，空气中飘着家常菜的味道。' +
        '早晨有晨练的老人，傍晚放学的孩子嬉笑打闹。一切看起来都是普通而安宁的日常。' +
        '居民们都很友善，见面会点头打招呼，街角的便利店是大家闲聊的聚集地。',
      truth:
        '梧桐树的影子在路灯下扭曲成怪异的形状，树皮上隐约浮现着人脸般的纹路。' +
        '那些晨练的老人其实步伐诡异——他们膝盖反弓，关节发出不属于人类的咔嗒声。' +
        '没有人真正看着你，但所有的视线都聚集在你身上。' +
        '这里的「日常」是一层薄得几乎透明的膜，随时可能撕裂。',
    },
    erosionRange: [10, 30],
    scenes: ['subway_station', 'convenience_store', 'old_bookstore', 'residential_area', 'park'],
    unlockConditions: {
      requiredErosion: 0,
      description: '游戏初始区域，自动解锁。',
    },
    ambient: {
      resident:
        '温暖的黄昏光线透过树叶洒在人行道上，远处传来狗吠声和孩子嬉闹声。' +
        '空气里有炊烟和泥土的气息，让人觉得安心。',
      truth:
        '天空的颜色不太对——明明是黄昏，却泛着紫绿色的诡异光泽。' +
        '那些「狗吠声」偶尔会变成女人凄厉的笑声，但随即又恢复如常。' +
        '梧桐叶在你脚下沙沙作响，像在窃窃私语。',
    },
    connectedZones: ['central_district'],
  },

  // ==================== 中央商业区（Central District）====================
  {
    id: 'central_district',
    name: 'Central District',
    nameCN: '中央商业区',
    description: {
      resident:
        '中央商业区是这座城市最繁华的地段。宽阔的步行街上遍布着各式商店——' +
        '古雅的裁缝店、飘着咖啡香的咖啡馆、热闹的酒吧街，还有一座历史悠久的公立学校和综合医院。' +
        '白天人潮涌动，夜晚霓虹闪烁，是居民们购物、社交和生活的中心。',
      truth:
        '商业区的建筑正在「融化」。墙面上浮现出不属于这个世界的文字，' +
        '霓虹灯的颜色过于艳丽，像是某种生物的脉动。' +
        '商店里陈列的商品偶尔会自己移动位置，' +
        '而路上的行人中有不少已经不再是「人类」——她们只是披着人皮的某种东西。' +
        '你注意到有些招牌上的文字在你看第二眼时变成了完全不同的内容。',
    },
    erosionRange: [30, 60],
    scenes: [
      'school', 'hospital', 'shopping_street', 'bar',
      'library', 'tailor_shop', 'cafe', 'swimming_pool', 'flower_shop',
    ],
    unlockConditions: {
      requiredErosion: 20,
      prerequisite: '初次进入边界街区地铁站',
      description: '通过地铁站或步行穿过边界街区北部进入。',
    },
    ambient: {
      resident:
        '步行街两侧的法国梧桐枝叶交错，形成绿色的拱廊。' +
        '学生们穿着整齐的制服走过，白领们手提公文包匆匆赶路。' +
        '咖啡厅里飘出现磨咖啡的香气，和面包店的甜味混在一起。',
      truth:
        '街道的透视关系不太对——远处的建筑似乎在呼吸般一伸一缩。' +
        '那些「学生」的制服下露出不该有的尾巴或鳞片，但没有人觉得异常。' +
        '咖啡香里混着一丝血腥味和花蜜的甜腻气息。' +
        '你听到的脚步声比实际人数多了一倍。',
    },
    connectedZones: ['border_district', 'distortion_core'],
  },

  // ==================== 扭曲核心（Distortion Core）====================
  {
    id: 'distortion_core',
    name: 'Distortion Core',
    nameCN: '扭曲核心',
    description: {
      resident:
        '扭曲核心——不，在居民的记忆中，这里只是「旧城区改造项目」所在地。' +
        '市政厅仍然在这里办公，神社和教堂作为文化遗产对公众开放。' +
        '只是很少有人愿意来这里，大家都说「那边氛围怪怪的」。' +
        '官方文件称此处正在进行城市更新工程，建议居民非必要不前往。',
      truth:
        '这里的「现实」已经彻底崩坏。空间像揉皱的纸一样折叠又展开，' +
        '重力时而消失时而加倍。神社的鸟居上爬满了会蠕动的符文，' +
        '教堂的彩绘玻璃上圣人画像的眼睛在转动。' +
        '市政大厅的时钟永远指向同一个时刻，' +
        '而地下深处传来的心跳声让你整个人都在共振。' +
        '这里是常识改变最强烈的区域，也是所有变化的源头。',
    },
    erosionRange: [60, 100],
    scenes: ['city_hall', 'shrine', 'church', 'abyss_corridor'],
    unlockConditions: {
      requiredErosion: 50,
      prerequisite: '完成「中央商业区的秘密」事件链',
      description: '需要侵蚀率达到50%以上，并且通过中央商业区的特定事件揭开进入方法。',
    },
    ambient: {
      resident:
        '旧城区的街道阴冷潮湿，常年不见阳光。' +
        '墙壁上的涂鸦据说是某位艺术家的作品，但画风令人不适。' +
        '偶尔能听到施工队的敲打声，但从未有人真正见过施工人员。',
      truth:
        '天空被巨大的半透明穹顶笼罩，透过穹顶能看到另一个世界的投影——' +
        '那里有飞翔的蛇形生物和倒悬的城堡。空气浓稠得像在水中行走，' +
        '每一次呼吸都尝到铁锈和甜橙混合的味道。' +
        '脚下的地面是柔软的，像是踩在某种巨大生物的皮肤上。' +
        '你听到的低语声来自四面八方，它们用你和你认识的所有人的声音说话。',
    },
    connectedZones: ['central_district'],
  },
];

export default zones;
