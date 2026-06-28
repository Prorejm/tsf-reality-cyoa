// ===== 发现物定义 =====
// categories: gender_reversal, age_reversal, identity_swap, monster_hidden, reality_tear

export type DiscoveryCategory = 'gender_reversal' | 'age_reversal' | 'identity_swap' | 'monster_hidden' | 'reality_tear';

export interface Discovery {
  id: string;
  title: string;
  description: string;
  source: string;
  category: DiscoveryCategory;
  relatedClues: string[];
  truthDescription: string;
  isHidden?: boolean;
}

export const discoveries: Discovery[] = [

  // ===== 性别反转 =====
  {
    id: 'gender_shift_evidence',
    title: '性别改写证据',
    description: '在山田老師的辦公桌抽屜深處，你發現了一張舊的男性駕駛證。照片上的人和他現在的長相一模一樣——但性別欄寫著「男」。駕駛證的發證日期是五年前。',
    source: '學校·山田老師的辦公桌',
    category: 'gender_reversal',
    relatedClues: ['yamada_confession', 'old_photo_yamada'],
    truthDescription: '這座城市的常識改變包含了對個體過去的改寫。山田老師原本是一名男性教師，卻在五年前的某一天被改寫了性別——不只是記憶，而是物理上的身體，以及所有人對他的認知。只有某些深層記憶中的片段還殘留著。',
  },
  {
    id: 'population_records',
    title: '户籍数据异常',
    description: '在圖書館的舊報紙區，你偶然翻到了一本五年前的戶籍登記簿。上面記載的山田健一（男）在次年突然消失了。但同時出現了一個新的登記——山田靜子（女），住址和職業完全相同。',
    source: '圖書館舊報紙區',
    category: 'gender_reversal',
    relatedClues: ['gender_shift_evidence', 'memory_fragment'],
    truthDescription: '不只是山田老師——你進一步調查發現，這座城市在過去十年間有超過兩千例「性別變更」記錄。但沒有任何手術記錄或法律文件。這些人全部被「常識改變」直接改寫了性別。',
  },
  {
    id: 'bathhouse_sign',
    title: '澡堂的招牌',
    description: '商店街的公共澡堂——你注意到它的招牌在不同時間會改變。早上是「男湯/女湯」，下午變成了「混湯/特殊湯」，晚上則變成了一種你不認識的文字。但所有路人都視若無睹。',
    source: '商店街澡堂',
    category: 'gender_reversal',
    relatedClues: [],
    truthDescription: '澡堂的招牌根據時間和「當天的常識設定」自動變化。晚上那些不認識的文字是怪物娘的語言——澡堂在深夜變成了非人類專用的浴場。',
  },

  // ===== 年龄反转 =====
  {
    id: 'age_reversal_photo',
    title: '逆生长的老人',
    description: '在舊書店裡，你看到了一本相冊。照片中是一位女士從年輕到老的過程——但順序是反過來的。最「舊」的照片裡她是一位白髮蒼蒼的老太太，越往後翻她越年輕。最後一張照片裡——她看起來只有十幾歲。',
    source: '舊書店相冊',
    category: 'age_reversal',
    relatedClues: ['bookstore_progress'],
    truthDescription: '部分怪物娘的年齡增長方向與人類相反。她們從年老狀態誕生，隨著時間變得越來越年輕。到達一定年齡後會「重生」——回到最初型態。',
  },
  {
    id: 'school_age_mismatch',
    title: '留級百年的學生',
    description: '你在學校的學生檔案中發現了一個名字——「張小雪」。她的入學年份是1978年。但你今天在操場上看到了她——她還是十幾歲的模樣。她的檔案上蓋著一個個「留級」的印章。從1978年開始，連續四十多年。',
    source: '學校檔案室',
    category: 'age_reversal',
    relatedClues: ['school_old_records'],
    truthDescription: '張小雪是覺醒了「長生種」特性的怪物娘。她不會變老。學校為了掩蓋這一點，偽造了連續的留級記錄。她是「常識改變」的早期實驗體之一。',
  },

  // ===== 身份替换 =====
  {
    id: 'memory_overwrite',
    title: '記憶覆蓋現象',
    description: '你親身經歷了身份改寫。在住宅區，一個自稱是你母親的女人打開了你家的門。你的記憶中憑空多出了二十年的家庭回憶——和一個完全陌生的女人。那些記憶詳細到可怕——她做飯的味道、她的聲音、她叫你小名的語氣。',
    source: '住宅區·自己的家',
    category: 'identity_swap',
    relatedClues: ['identity_rewrite_encountered'],
    truthDescription: '常識改變的核心機制是「記憶注入」。通過某種未知的技術或魔法，新的記憶可以被直接寫入人的大腦，覆蓋原有的記憶。被覆蓋的記憶不會完全消失——它們被壓抑在大腦深處，以夢境或既視感的形式浮現。',
  },
  {
    id: 'neighbor_strangers',
    title: '陌生的邻居们',
    description: '你開始注意到——住宅區的鄰居們每隔一段時間就會「更換」。不是搬家那種更換——而是今天張三住在三樓，明天就變成了李四，但所有人都記得李四已經在這裡住了十年。',
    source: '住宅區觀察',
    category: 'identity_swap',
    relatedClues: ['identity_rewrite_encountered'],
    truthDescription: '身份替換在住宅區發生得最為頻繁。這裡是理事會測試「大規模身份改寫」的實驗場。被替換者本人通常不會察覺——他們的記憶也被修改了。',
  },
  {
    id: 'office_colleagues',
    title: '消失的同事',
    description: '你在廢棄辦公樓找到了一份員工名冊。上面的名字有三十多人。但你問了附近的所有商鋪——沒有人記得這棟樓裡有超過五個人辦公。名冊上的人像灰塵一樣在你的記憶中消散了。',
    source: '廢棄辦公樓',
    category: 'identity_swap',
    relatedClues: ['office_encountered'],
    truthDescription: '這些「同事」是理事會用於身份改寫實驗的實驗體。實驗完成後，他們的「存在」被從所有人的記憶中抹去——包括他們自己的。',
  },

  // ===== 怪物隐藏 =====
  {
    id: 'monster_among_us',
    title: '隐藏的怪物娘',
    description: '你開始能在人群中辨識出她們了——那些眼角有細小鱗片的、走路方式輕盈得不自然的、皮膚下有淡淡螢光的。她們偽裝成普通人類，生活在這座城市的各個角落。',
    source: '綜合觀察（感知≥20）',
    category: 'monster_hidden',
    relatedClues: ['slime_secret_1', 'plant_sense'],
    truthDescription: '這座城市的非人類居民數量遠超你的想像。初步估計——中央商業區有約30%的居民是非人類或部分非人類。她們通過「常識改變」的力量來維持人類外表，甚至自己都相信自己就是人類。',
  },
  {
    id: 'tailor_shop_secret',
    title: '裁縫店的秘密訂單',
    description: '裁縫店的訂單記錄本上，有一些奇怪的「特殊訂單」——「尾部開口西裝×3」「翅膀預留背心×5」「抑制變形內衣×12」。訂貨人不具名，付款方式是現金。',
    source: '裁縫店訂單本',
    category: 'monster_hidden',
    relatedClues: ['tailor_measured'],
    truthDescription: '裁縫店是非人類居民的重要補給站。那些不能完全抑制變形特徵的怪物娘需要特殊設計的服裝來維持偽裝。裁縫店的存在證明怪物娘社群已經形成了成熟的互助網絡。',
  },
  {
    id: 'cafe_menu',
    title: '咖啡厅的隐藏菜单',
    description: '在咖啡廳的菜單背面——有一層用特殊墨水印刷的隱藏菜單。上面的飲品名稱包括：「穩定劑（人類形態維持用）」「魔力恢復特調」「感知屏蔽茶」。價格是正常咖啡的三倍。',
    source: '咖啡廳菜單',
    category: 'monster_hidden',
    relatedClues: [],
    truthDescription: '咖啡廳是非人類居民的社交場所之一。隱藏菜單提供的是維持偽裝和恢復魔力的藥劑。店員本身也是一名怪物娘——她能在人形態和貓娘形態之間切換。',
  },
  {
    id: 'hospital_underground',
    title: '医院地下手术室',
    description: '醫院的B3層——不對外開放。你透過門縫看到了裡面的情況：手術台上躺著一個半人半獸的存在，醫生們正在對她進行某種「改造」。牆上的標語寫著：「適者生存·適應性改造·第三期」。',
    source: '醫院地下三層',
    category: 'monster_hidden',
    relatedClues: ['hospital_secret'],
    truthDescription: '醫院地下的「適應性改造」手術是理事會計劃的核心部分。那些無法自然適應常識改變的人類被送到這裡，接受物理上的改造——植入尾巴、角、翅膀等特徵，使他們「符合」新的現實設定。',
  },
  {
    id: 'mermaid_sighting',
    title: '泳池人鱼目击',
    description: '在游泳館，你親眼看到了一個下半身是魚尾的存在在水中游動。她游得比任何奧運選手都快，在水中翻轉的動作優雅得不像是人類。最恐怖的是——其他游泳者完全沒注意到她。',
    source: '游泳館',
    category: 'monster_hidden',
    relatedClues: ['pool_encounter'],
    truthDescription: '人魚的存在暗示了這座城市的常識改變涵蓋了神話生物。人魚、半人馬、鳥身女妖……各種神話中的生物都在這裡真實存在，並通過常識改變融入日常生活。',
  },
  {
    id: 'alraune_truth',
    title: '花音的本体',
    description: '在花音溫室的地下，你看到了她的本體——一株巨大的、散發著螢光的古老植物。它的根系遍佈整個城市的地下。花音的人形態只是這株植物延伸出的「化身」。',
    source: '花店溫室',
    category: 'monster_hidden',
    relatedClues: ['alraune_reveal', 'plant_sense'],
    truthDescription: '花音的本體植物可能是這座城市最古老的生命體之一。它的根系形成了城市地下的情報網絡。花音通過這個網絡能感知城市中發生的一切——包括常識改變的擴散情況。',
  },

  // ===== 现实裂缝 =====
  {
    id: 'subway_to_nowhere',
    title: '通向异界的地铁',
    description: '你親眼看到了一列地鐵——車廂內部不是車廂，而是螢光森林、古老圖書館和虛空的混合體。乘客們若無其事地走進這些車廂。這列地鐵開往的地點不在任何路線圖上。',
    source: '地鐵站',
    category: 'reality_tear',
    relatedClues: ['subway_anomaly_encountered'],
    truthDescription: '地鐵系統不僅連接這座城市的物理區域——它還連接不同的現實層面。那些通往異界的車廂是現實裂縫的表現。常識改變越強烈，這些裂縫就出現得越頻繁。',
  },
  {
    id: 'inverted_city',
    title: '倒悬的城市',
    description: '在公園地下裂縫中，你看到了一座完全顛倒的城市——建築尖頂朝下，燈光像星辰一樣點綴在「下方」。那座城市和你的城市一模一樣，只是上下顛倒。',
    source: '公園裂縫',
    category: 'reality_tear',
    relatedClues: ['park_crack_found'],
    truthDescription: '那座倒懸的城市是這座城市的「鏡像」——它存在於同一個空間坐標上，但處於不同的相位。理事會的研究基地就建在鏡像城市中。深淵回廊是連接兩個城市的通道。',
  },
  {
    id: 'change_history',
    title: '常識改變的歷史',
    description: '在圖書館的隱藏房間中，你發現了從數百年前開始的常識改變記錄。最早的一份是1783年的日記——作者描述了「世界在一夜之間變得不一樣了」。',
    source: '圖書館禁書區',
    category: 'reality_tear',
    relatedClues: ['secret_library_found', 'old_diary'],
    truthDescription: '常識改變不是最近才開始的。它是一場持續了至少兩百年的緩慢進程。每隔幾十年，就會有一次大規模的「現實更新」——理事會在幕後操縱著這一切。',
  },
  {
    id: 'sky_fabric',
    title: '天空是假的',
    description: '在地鐵站傍晚，你注意到夕陽的「位置」不正確。經過計算和比對——你得出了一個駭人的結論：這座城市的天空不是真的天空。它是一個巨大的投影穹頂。真正的天空——你從深淵回廊的記錄中推測——已經消失了。',
    source: '地鐵站+深淵回廊記錄',
    category: 'reality_tear',
    relatedClues: ['subway_anomaly_encountered'],
    truthDescription: '城市上空被一個半透明的能量穹頂覆蓋。它投影出藍天、白雲、陽光和星空——一切都是假的。穹頂之外是真實的世界——一片被混沌能量侵蝕的荒原。城市是僅存的人類（和非人類）庇護所。',
  },
  {
    id: 'time_loop',
    title: '市政厅的时钟',
    description: '市政大廳的時鐘永遠指向同一時刻——4:44。秒針逆行。每一次你看到它，時間都沒有前進過一秒。但市政廳的工作人員告訴你：「時鐘很正常啊。」',
    source: '市政大廳',
    category: 'reality_tear',
    relatedClues: [],
    truthDescription: '扭曲核心區域的時間流動與外界不同。市政大廳處於一個時間迴圈中——永遠停留在4:44。這是深淵回廊的能量影響造成的。理事會利用這一現象進行時間相關的實驗。',
  },
];

export default discoveries;
