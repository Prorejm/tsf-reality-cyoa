// ===== 物品定义 - 常識改変TSF × Monster Girl =====
// type: 'regular' 普通 | 'equipment' 装备 | 'tsf_trigger' TSF触发器 | 'key_item' 关键物品 | 'reusable' 可重复使用

export type ItemType = 'regular' | 'equipment' | 'tsf_trigger' | 'key_item' | 'reusable';

export interface TriggerConfig {
  conditions: {
    scene?: string;
    dayPhase?: string[];
    minErosion?: number;
    maxErosion?: number;
    minAwareness?: number;
    dayMin?: number;
    hasFlags?: string[];
    completedEvents?: string[];
  };
  effect: {
    type: 'identity_shift' | 'reality_tear' | 'monster_reveal' | 'memory_flash' | 'transformation_boost';
    description: string;
    erosionChange: number;
    awarenessChange: number;
    triggerEventId?: string;
  };
}

/** 可重复使用道具的使用效果定义 */
export interface ItemUseEffect {
  /** 行为标识（由游戏引擎解析） */
  action: string;
  /** 使用效果描述 */
  description: string;
  /** 附带参数 */
  payload?: Record<string, unknown>;
}

export interface Item {
  id: string;
  name: string;
  /** 日文名称（可重复使用道具专用） */
  nameCN?: string;
  description: string;
  /** 真相视角描述 */
  truthDescription?: string;
  type: ItemType;
  effect?: {
    awareness?: number;
    erosion?: number;
    description: string;
  };
  triggerConfig?: TriggerConfig;
  /** 图标标识（对应 ItemImage 组件的 itemId） */
  icon?: string;
  /** 是否可直接使用 */
  usable?: boolean;
  /** 使用时触发的游戏效果 */
  useEffect?: ItemUseEffect;
  stackable?: boolean;
  maxStack?: number;
  isConsumable?: boolean;
  isHidden?: boolean;
  sourceDescription?: string;
}

export const items: Item[] = [

  // ==================== 普通物品 ====================
  {
    id: 'investigation_notebook',
    name: '调查笔记',
    description: '一本黑色封面的筆記本，記錄了你對這座城市異常現象的觀察。每當你發現新的線索，筆記本上的內容會自動增加。',
    type: 'regular',
    effect: { awareness: 1, description: '閱讀筆記可使感知輕微提升。記錄線索時自動更新。' },
    stackable: false,
    isHidden: false,
    sourceDescription: '遊戲初始物品。',
  },
  {
    id: 'flashlight',
    name: '手电筒',
    description: '一把可靠的LED手電筒。除了照明之外，你還發現在特定的光照角度下，能看到肉眼無法察覺的痕跡——比如牆壁上用特殊墨水寫的字。',
    type: 'regular',
    stackable: false,
    isHidden: false,
    sourceDescription: '便利店可購買。',
  },
  {
    id: 'protective_charm',
    name: '护身符',
    description: '從神社求來的護身符。據說能避邪。當你握著它的時候，你能感覺到它在微微發熱——像是在警告你附近有危險。',
    type: 'regular',
    effect: { erosion: -1, description: '每天減少1%侵蝕率（佩戴時）。' },
    stackable: false,
    isHidden: false,
    sourceDescription: '狐鈴贈送（好感度≥10）。',
  },
  {
    id: 'old_photo',
    name: '旧照片',
    description: '一張泛黃的照片。照片上是一座你從未見過的城市——但建築風格和你住的城市一模一樣。天空的顏色是紫色的，街道上走著各種半人半獸的居民。照片背面用鉛筆寫著：「未來？過去？還是隔壁？」',
    type: 'regular',
    stackable: false,
    isHidden: false,
    sourceDescription: '舊書店角落找到。',
  },
  {
    id: 'blank_tape',
    name: '空白磁带',
    description: '一盒沒有標籤的磁帶。當你把它放進錄音機時，裡面沒有任何聲音。但如果你在特定的地點播放——比如神社或市政廳——你會聽到一些不屬於這個世界的音樂和低語。',
    type: 'regular',
    stackable: true,
    maxStack: 3,
    sourceDescription: '舊書店或便利店隨機找到。',
  },

  // ==================== 装备 ====================
  {
    id: 'investigation_coat',
    name: '调查风衣',
    description: '一件深灰色的長風衣。多個口袋，方便攜帶各種調查工具。最重要的是——它的面料中編織了一種特殊的金屬絲線，能夠微弱地干擾常識改變的影響。',
    type: 'equipment',
    effect: { awareness: 5, description: '感知+5。更容易注意到現實中的矛盾點。' },
    stackable: false,
    isHidden: false,
    sourceDescription: '商店街服裝店購買，或裁縫店定做。',
  },
  {
    id: 'cursed_ring',
    name: '诅咒戒指',
    description: '一枚黑色的金屬戒指，戒面鑲嵌著一顆暗紅色的寶石。戴上後，你能更清晰地看到世界的真實面貌——但代價是你也離那個「真實」更近了。',
    type: 'equipment',
    effect: { erosion: 5, awareness: 10, description: '每天侵蝕率+5%。感知+10。能夠看到隱藏的怪物娘。' },
    stackable: false,
    isHidden: false,
    sourceDescription: '魅魔酒吧的「特製雞尾酒」獎勵。',
  },
  {
    id: 'mirror_shard',
    name: '镜之碎片',
    description: '一面古老銅鏡的碎片。透過它看到的影像會呈現出物體的真實面貌。對普通人來說，它只是一塊普通的破鏡子。但對你來說——當你透過它看世界時，你能看到「常識」之下的真相。',
    type: 'equipment',
    effect: { awareness: 8, description: '感知+8。使用後可暫時看到場景的真實面貌。' },
    stackable: false,
    isHidden: false,
    sourceDescription: '神社後方的廢棄儲物間找到。',
  },

  // ==================== TSF触发器物品 ====================
  {
    id: 'pregnancy_charm',
    name: '孕妇专座咒文纸条',
    description: '一張在地鐵站撿到的紙條。上面用細小的字體寫著一段看起來像是咒文的文字，標題是「孕婦專座·常識調整用」。你讀完後，腦海中突然浮現出你從未經歷過的記憶——你大著肚子坐在電車上，有人給你讓座。但你明明……',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'subway_station', dayPhase: ['evening'], minErosion: 20 },
      effect: {
        type: 'memory_flash',
        description: '觸發一段被植入的「孕婦記憶」。你的身體開始產生相應的變化——腹部微微隆起，體態重心改變。沒有疼痛，只有一種奇怪的充實感。你突然理解了那句咒文的含義：這是一種強制身份改寫的媒介。',
        erosionChange: 8,
        awarenessChange: 10,
        triggerEventId: 'pregnancy_memory_event',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '傍晚的地鐵站地上隨機拾取。',
  },
  {
    id: 'faded_wedding_photo',
    name: '褪色的结婚照',
    description: '一張你在住宅區垃圾桶旁發現的結婚照。照片中的新郎和新娘看起來很幸福。但你注意到——照片上的日期是你出生的十年前。而且——你越看越覺得，照片中的新娘長得好像……你的母親？不，更像是你未來的伴侶？照片在你手中越來越燙。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'residential_area', minErosion: 15, hasFlags: ['identity_rewrite_encountered'] },
      effect: {
        type: 'identity_shift',
        description: '照片中的面孔開始模糊、扭曲。當它重新清晰時——照片中的新娘變成了你的臉。你的手上出現了一枚婚戒。記憶中多了一段你從未有過的婚禮。你的配偶的臉是模糊的——但你知道那個人存在。',
        erosionChange: 10,
        awarenessChange: 8,
        triggerEventId: 'wedding_memory_shift',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '住宅區垃圾桶旁隨機發現。',
  },
  {
    id: 'bloody_nurse_cap',
    name: '沾血的护士帽',
    description: '一頂沾著暗紅色血跡的護士帽。你是在醫院後巷的垃圾箱旁邊發現它的。血跡還沒有完全乾——這些血是今天留下的。當你拿起它的時候，你聞到了濃烈的鐵鏽味，以及一絲……不屬於人類的甜膩氣味。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'hospital', dayPhase: ['night'], minErosion: 40 },
      effect: {
        type: 'identity_shift',
        description: '戴上護士帽的瞬間，你的頭髮自動盤成了髮髻。你的制服變成了護士服。你的手上出現了病歷夾——上面的名字是你的。職位是「夜班護士·血月助理」。你能感覺到犬齒正在變長。',
        erosionChange: 12,
        awarenessChange: 10,
        triggerEventId: 'nurse_identity_shift',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '醫院後巷夜間隨機發現。',
  },
  {
    id: 'kitsune_mask',
    name: '狐之面具',
    description: '神社深處找到的一副白色狐面面具。做工精美，表情似笑非笑。戴上的時候，你能聞到淡淡的櫻花香氣。耳朵——你的耳朵好像變得敏感了。你聽到了神社裡那些木頭和石頭的低語。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'shrine', minAwareness: 50, dayMin: 7 },
      effect: {
        type: 'transformation_boost',
        description: '戴上面具後，你的身體開始散發出淡金色的光芒。你的頭髮變成了銀白色，頭頂冒出了毛茸茸的狐耳。身後——一條、兩條、三條蓬鬆的尾巴正在成形。你能感受到神社的結界力量在你體內流淌。',
        erosionChange: 8,
        awarenessChange: 15,
        triggerEventId: 'kitsune_transformation_event',
      },
    },
    stackable: false,
    isConsumable: false,
    sourceDescription: '神社深處的祭壇下找到。',
  },
  {
    id: 'blank_employee_card',
    name: '空白的员工证',
    description: '一張在廢棄辦公室找到的空白員工證。表面沒有任何信息——但當你觸摸它的時候，它微微發熱。你有一種奇怪的預感：這張卡片上很快就會出現你的名字和照片。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { dayPhase: ['afternoon'], minErosion: 30, hasFlags: ['office_encountered'] },
      effect: {
        type: 'identity_shift',
        description: '員工證上浮現出你的照片和名字——下面寫著「常識調整科·專員」。你的衣服變成了辦公室套裝。你清楚記得你在這裡工作了三年——那些記憶真實得可怕。',
        erosionChange: 10,
        awarenessChange: 8,
        triggerEventId: 'office_identity_shift',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '廢棄辦公室抽屜中找到。',
  },
  {
    id: 'mermaid_scale',
    name: '人鱼之鳞',
    description: '一片閃亮的藍綠色鱗片，大約有手掌大小。它是你在游泳館的泳池底部發現的。鱗片散發著淡淡的螢光，摸起來濕滑冰涼。靠近耳朵時，你能聽到遙遠的海潮聲。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'swimming_pool', minErosion: 30 },
      effect: {
        type: 'transformation_boost',
        description: '鱗片貼在你的皮膚上，開始融入你的身體。你的雙腿感到一陣刺癢——腳趾之間正在長出蹼。小腿上浮現出細小的鱗片紋路。你能感覺到水在召喚你。',
        erosionChange: 6,
        awarenessChange: 8,
        triggerEventId: 'mermaid_transform_event',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '游泳館泳池底部潛水找到。',
  },
  {
    id: 'old_school_key',
    name: '旧校舍的钥匙',
    description: '一把生鏽的銅鑰匙。鑰匙柄上刻著「舊校舍·資料室」。你是在學校雜物間的一個舊箱子裡發現它的。鑰匙上沾著一些暗褐色的痕跡——看起來很像乾掉的血。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'school', dayPhase: ['night'], minErosion: 25 },
      effect: {
        type: 'reality_tear',
        description: '鑰匙插入舊校舍資料室的門鎖。門打開後——裡面不是資料室。你看到了一個平行空間的教室，教室裡坐著半人半獸的「學生」。講台上站著一位長著翅膀的老師。他們同時轉頭看向你。',
        erosionChange: 10,
        awarenessChange: 12,
        triggerEventId: 'old_school_reality_tear',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '學校雜物間舊箱中找到。',
  },
  {
    id: 'succubus_invitation',
    name: '魅魔的邀请函',
    description: '一封黑色的信封，封口處用蠟封著一個心形印章。打開後，裡面是一張暗紅色的卡片，用優雅的花體字寫著：「誠摯邀請您參加今晚的——真實之宴。地點：你知道的地方。時間：深夜。」卡片散發著若隱若現的香氣。',
    type: 'tsf_trigger',
    triggerConfig: {
      conditions: { scene: 'bar', dayPhase: ['night'], minErosion: 50 },
      effect: {
        type: 'monster_reveal',
        description: '出示邀請函後，酒吧的燈光變成了暗紅色。所有偽裝消失了。你周圍的客人們——她們的角、翅膀、尾巴、鱗片全部顯露出來。你才發現整個酒吧裡除了你之外，沒有任何人類。她們都微笑著看著你。',
        erosionChange: 15,
        awarenessChange: 15,
        triggerEventId: 'real_festival_event',
      },
    },
    stackable: false,
    isConsumable: true,
    sourceDescription: '夜魅贈送（好感度≥50）。',
  },

  // ==================== 关键物品 ====================
  {
    id: 'slime_gel_sample',
    name: '史莱姆凝胶样本',
    description: '一小瓶淡綠色的半透明凝膠。是小翠偷偷給你的——她從自己身上分離出來的。具有極強的可塑性和再生能力。可以用來製作藥劑或用於某些特殊用途。',
    type: 'key_item',
    stackable: false,
    isHidden: false,
    sourceDescription: '小翠好感度獎勵（好感度≥30）。',
  },
  {
    id: 'truth_crystal',
    name: '真相水晶',
    description: '蛇目贈送的水晶球碎片。握在手中時，你能感受到它在和你的心跳共振。在特定場景中使用，可以看到隱藏的真相——比如牆上的秘密文字，或被魔法隱藏的物品。',
    type: 'key_item',
    stackable: false,
    isHidden: false,
    sourceDescription: '蛇目好感度獎勵（好感度≥70）。',
  },
  {
    id: 'old_diary',
    name: '林婉的日记',
    description: '一本1987年的日記，作者是林婉。記錄了她從一個普通人逐漸失去記憶的過程。最後一頁的筆跡極度扭曲：「我不記得了。我不記得自己是誰。」這份日記是常識改變已經持續了至少幾十年的鐵證。',
    type: 'key_item',
    stackable: false,
    isHidden: false,
    sourceDescription: '圖書館禁書區獲得。',
  },
  {
    id: 'silver_bullet',
    name: '银制子弹',
    description: '一枚純銀打造的子彈。是老狼給你的——「以備不時之需」。它對某些特定類型的怪物有極強的殺傷力。同時，它也可以作為一種證明——表明你得到了老狼的信任。',
    type: 'key_item',
    stackable: true,
    maxStack: 6,
    isHidden: false,
    sourceDescription: '老狼好感度獎勵（好感度≥30）。',
  },

  // ==================== 可重复使用道具 ====================
  {
    id: 'phone',
    name: '智能手机',
    nameCN: 'スマートフォン',
    description: '一台黑色的智能手機。屏幕完好，電量充足。除了基本的通訊功能外，你注意到手機裡預裝了一些奇怪的應用——它們似乎專門為「調查真相」而設計。',
    truthDescription: '手機的作業系統中有一個隱藏分區。裡面存儲著一份關於「常識調整計劃」的詳細文檔。這台手機不是你的——或者說，不僅僅是你的。它是某個人留給你的「工具」。',
    type: 'reusable',
    icon: 'phone',
    usable: true,
    useEffect: {
      action: 'OPEN_PHONE_SCREEN',
      description: '打開手機界面，查看各種應用。每當你感到迷茫時，手機總會給出指引——就像有人在另一端等著你。',
      payload: {},
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '遊戲初始物品（自動獲得）。',
  },
  {
    id: 'camera',
    name: '相机',
    nameCN: 'カメラ',
    description: '一台輕便的數位相機。像素很高，夜拍效果也不錯。你總覺得鏡頭裡看到的東西——和肉眼看到的有那麼一點不同。',
    truthDescription: '這台相機的鏡頭鍍了一層特殊的膜。它能捕捉到人眼無法感知的光譜——包括「常識改變」的痕跡。照片中的世界，才是真正的世界。',
    type: 'reusable',
    icon: 'camera',
    usable: true,
    useEffect: {
      action: 'TAKE_PHOTO',
      description: '拍攝當前場景的照片。照片會存入相冊，可作為證據保留。拍攝的照片越多，越能看清「常識」之下的真實面貌。（最多20張）',
      payload: { maxPhotos: 20 },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '調查獲得（可從舊書店或廢棄辦公室找到）。',
  },
  {
    id: 'flashlight',
    name: '手电筒（强光型）',
    nameCN: '懐中電灯',
    description: '一把高亮度的LED強光手電筒。除了照亮黑暗之外，你發現它的光線在某些角度下能夠讓隱藏的物體顯形——像是用特殊墨水寫的字，或是被魔法掩蓋的痕跡。',
    truthDescription: '這把手電筒的燈頭內置了一個濾光片。當切換到「UV模式」時，它能照亮現實世界中肉眼看不見的信息層——那是常識改變留下的「補丁痕跡」。',
    type: 'reusable',
    icon: 'flashlight',
    usable: true,
    useEffect: {
      action: 'REVEAL_HIDDEN',
      description: '使用強光照射當前場景，揭露被隱藏的物體或文字。某些秘密只有在特定的光照下才會顯現。',
      payload: { revealMode: 'hidden_objects' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '便利店可購買（進階版）。',
  },
  {
    id: 'recorder',
    name: '录音机',
    nameCN: '録音機',
    description: '一台老式磁帶錄音機。雖然外表看起來很舊，但錄音品質出奇地好。你注意到一個奇怪的現象——錄音中經常會出現一些你當時沒聽到的「額外聲音」。',
    truthDescription: '這台錄音機會自動收錄「常識改變頻率」的聲音。當你錄製NPC對話時，回放中會出現他們真實種族的聲音——比如鱗片摩擦聲、翅膀拍打的聲音，或是他們不自覺發出的低吼。',
    type: 'reusable',
    icon: 'recorder',
    usable: true,
    useEffect: {
      action: 'RECORD_DIALOGUE',
      description: '錄製當前NPC的對話。回放錄音時可能聽到隱藏的真相——那些被「常識」過濾掉的聲音。',
      payload: { recordMode: 'npc_dialogue' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '舊書店或廢棄辦公室找到。',
  },
  {
    id: 'compass',
    name: '指南针',
    nameCN: '方位磁針',
    description: '看起來是一個普通的指南針。但它的指針並不是指向北方——它指向的是這座城市中「現實最不穩定」的方向。',
    truthDescription: '指南針的內部裝有一個現實穩定度感應器。指針永遠指向侵蝕值最高的區域——那些地方離真相最近，但也最危險。跟著指針走，你會發現被隱藏的路徑和秘密區域。',
    type: 'reusable',
    icon: 'compass',
    usable: true,
    useEffect: {
      action: 'REVEAL_PATH',
      description: '使用指南針探測當前區域的現實穩定度。指針會指向隱藏的路徑或秘密區域的方向。',
      payload: { revealMode: 'hidden_paths' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '神社的狐鈴贈送（好感度≥20）。',
  },
  {
    id: 'mirror',
    name: '手镜',
    nameCN: '手鏡',
    description: '一面手掌大小的圓鏡。鏡框是古銅色的，雕刻著精緻的花紋。當你照鏡子的時候，鏡中的你——好像總是慢半拍才做出同樣的表情。',
    truthDescription: '這面鏡子能看到你的「真實形態」。當你的身體因常識改變而發生變化時，鏡子會反映出你真正的樣子——包括那些被常識掩蓋的魔物特徵。每次使用都能檢查自身的變身進度。',
    type: 'reusable',
    icon: 'mirror',
    usable: true,
    useEffect: {
      action: 'CHECK_TRANSFORMATION',
      description: '照鏡子檢查自己的身體狀態。如果已經受到常識改變的影響，鏡中會顯示真實的種族特徵和變身進度。',
      payload: { checkMode: 'transformation_status' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '住宅區的某個廢棄房屋中找到。',
  },

  // ==================== 新增 TSF 触发类物品 ====================
  {
    id: 'mirror_hand',
    name: '手镜',
    nameCN: '手鏡',
    description: '一面普通的椭圆形手镜，边框上刻着精细的花纹。照镜子时总觉得镜中的自己有些陌生。',
    truthDescription: '這面鏡子的鏡框雕刻著古老的監視符文。當你照鏡子時，鏡中的你會短暫地顯示出你「正在變成」的形態——那些被常識掩蓋的魔物特徵會一閃而過。每次使用都能檢查自己的變身進度。',
    type: 'reusable',
    icon: 'mirror',
    usable: true,
    useEffect: {
      action: 'CHECK_TRANSFORMATION',
      description: '照鏡子檢查當前身體的變身狀態。如果侵蝕率達到一定閾值，鏡中會浮現出真實的種族特徵。',
      payload: { checkMode: 'transformation_status' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '住宅區的某個廢棄房屋中找到。',
  },
  {
    id: 'strange_compass',
    name: '古旧的指南针',
    nameCN: '古びた方位磁針',
    description: '指针总是指向城市中心方向，无论你如何转动它。',
    truthDescription: '這是指南針的內部裝有一個現實穩定度感應器。指針永遠指向侵蝕值最高的區域——那些地方離真相最近，但也最危險。跟著指針走，你會發現被隱藏的路徑和秘密區域。它的外殼上刻著一行小字：「送給敢於直視真相的人。」',
    type: 'reusable',
    icon: 'compass',
    usable: true,
    useEffect: {
      action: 'REVEAL_PATH',
      description: '使用指南針探測當前區域的現實穩定度。指針會指向隱藏的路徑或秘密區域的方向。在扭曲核心區域使用可能揭示通往深淵回廊的隱藏通道。',
      payload: { revealMode: 'hidden_paths' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '神社的狐鈴贈送（好感度≥20），或從舊書店的神秘包裹中找到。',
  },
  {
    id: 'whistle',
    name: '银笛',
    nameCN: '銀の笛',
    description: '一只银色的口哨，吹响时听不到声音——但狗能听到。附近的狼人会注意到。',
    truthDescription: '這隻口哨發出的頻率超出人類聽覺範圍，但狼人和犬類生物可以清晰地聽到。吹響它會引起附近狼人的注意——可能是善意的回應，也可能是警覺。在某些夜晚，它甚至能呼喚來月下的守護者。',
    type: 'regular',
    icon: 'whistle',
    usable: true,
    useEffect: {
      action: 'CALL_WEREWOLF',
      description: '吹響銀笛。雖然你聽不到聲音，但如果你在夜晚使用，附近的狼人會感知到並可能前來查看。',
      payload: { summonType: 'werewolf_attention' },
    },
    stackable: false,
    isHidden: false,
    sourceDescription: '老狼贈送（好感度≥20），或從公園深處的某個樹洞中找到。',
  },
  {
    id: 'silk_thread',
    name: '蜘蛛丝线',
    nameCN: '蜘蛛の糸',
    description: '一段极其坚韧的白色丝线，在月光下泛着银光。来自裁缝店的赠礼。',
    truthDescription: '這是真正的阿拉克涅絲線——由裁縫店後室的蛛魔所吐。它比鋼絲更堅韌，比蠶絲更柔滑。在某些場合可以作為繩索使用，也可以用作觸發特定事件的關鍵物品。攜帶它靠近蛛魔族相關的地點或人物時，絲線會微微發熱。',
    type: 'key_item',
    icon: 'thread',
    stackable: true,
    maxStack: 3,
    isHidden: false,
    sourceDescription: '裁縫店後室的贈禮，或完成特定蛛魔相關事件後獲得。',
  },
  {
    id: 'scale_pendant',
    name: '鳞片吊坠',
    nameCN: '鱗のペンダント',
    description: '用蛇鳞制成的吊坠，戴着它皮肤会变得光滑冰凉。',
    truthDescription: '這條吊墜的鱗片來自古老的蛇妖族。佩戴時，鱗片會釋放出微弱的魔力，在皮膚表面形成一層保護性的「冷鱗」——它能輕微抵抗常識改變的侵蝕，但也會讓佩戴者的體溫逐漸下降，變得更接近冷血動物。長期佩戴可能引發不可逆的種族變化。',
    type: 'equipment',
    effect: { erosion: -5, description: '侵蝕抗性+5。佩戴時體溫降低，對高溫環境適應性提升，但同時會緩慢累積冷血化傾向。' },
    stackable: false,
    isHidden: false,
    sourceDescription: '蛇目好感度獎勵（好感度≥30），或從中央商業區的秘密商店購買。',
  },
];

export default items;
