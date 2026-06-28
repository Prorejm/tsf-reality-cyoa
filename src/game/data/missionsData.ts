// ============================================================================
// missionsData.ts — TSF Reality CYOA 特殊任务系统
// ============================================================================

export interface MissionObjective {
  id: string;
  description: string;
  type: 'visit_scene' | 'collect_item' | 'use_item' | 'complete_node' | 'reach_stage' | 'talk_npc' | 'use_tsf' | 'custom';
  target: string;
  count?: number;
}

export interface MissionPrerequisites {
  minDay?: number;
  requiredFlags?: Record<string, any>;
  requiredItems?: string[];
}

export interface MissionRewards {
  items?: string[];
  flags?: Record<string, any>;
  awareness?: number;
  erosion?: number;
}

export interface MissionData {
  id: string;
  nameCN: string;
  description: string;
  type: 'main' | 'side' | 'tsf' | 'hidden' | 'daily';
  objectives: MissionObjective[];
  prerequisites?: MissionPrerequisites;
  rewards: MissionRewards;
  narrative: string;
}

// ============================================================================
// 主线任务（7个）
// ============================================================================

const MAIN_MISSIONS: MissionData[] = [
  {
    id: 'm_main_1',
    nameCN: '初次调查',
    description: '你的第一天。检查房间，了解周围环境。',
    type: 'main',
    objectives: [
      { id: 'm1_obj1', description: '检查卧室', type: 'complete_node', target: 'explore_room' },
      { id: 'm1_obj2', description: '看向窗外', type: 'custom', target: 'look_out_window' },
    ],
    prerequisites: {},
    rewards: { awareness: 5 },
    narrative:
      '你站在陌生的房間裡。窗簾半掩著，午後的陽光在地板上投下一道斜斜的光影。你的行李還未完全打開——一個背包，一台相機，一本筆記本。這就是你調查這座城市的全部裝備。\n\n' +
      '你走到窗前，拉開窗簾。外面的街道很安靜——幾家小店鋪，幾棵行道樹，幾個慢悠悠走過的路人。看起來就是一座普通的小鎮。但你的直覺告訴你——事情沒有那麼簡單。\n\n' +
      '先徹底檢查一下房間吧。也許有什麼線索——前任住客留下的、或者這家旅館的老闆刻意放置的。然後——出門看看這座城市到底藏著什麼秘密。',
  },
  {
    id: 'm_main_2',
    nameCN: '小镇探索',
    description: '在小鎮中探索，尋找異常的線索。',
    type: 'main',
    objectives: [
      { id: 'm2_obj1', description: '前往中心廣場', type: 'visit_scene', target: 'town_center' },
      { id: 'm2_obj2', description: '觀察路人', type: 'custom', target: 'observe_passersby' },
      { id: 'm2_obj3', description: '查看公告欄', type: 'custom', target: 'check_bulletin' },
    ],
    prerequisites: { minDay: 1 },
    rewards: { awareness: 10, items: ['photo_old'] },
    narrative:
      '你走出了旅館的大門。街道上的空氣帶著一絲若有若無的甜味——像是花香，又像是某種化學藥劑的味道。你深呼吸了一下——有點暈眩，但很快就過去了。\n\n' +
      '中心廣場不遠。你沿著主要街道走了大約五分鐘，就看到了一座噴泉——中央是一個抱著水瓶的少女雕像，水從瓶口靜靜流淌。廣場周圍有幾家商店、一家便利商店、一家花店。一切看起來都很正常。\n\n' +
      '太正常了。你職業性的多疑讓你注意到了一些微妙的細節——那些路人的步伐太過一致，商店招牌上的字體有些奇怪，噴泉的水聲似乎帶著一種不自然的規律性。你決定先觀察一下。',
  },
  {
    id: 'm_main_3',
    nameCN: '神社的巫女',
    description: '前往神社，與狐鈴對話。',
    type: 'main',
    objectives: [
      { id: 'm3_obj1', description: '前往神社', type: 'visit_scene', target: 'shrine' },
      { id: 'm3_obj2', description: '與狐鈴對話', type: 'talk_npc', target: 'kitsune_miko' },
    ],
    prerequisites: { minDay: 2 },
    rewards: { awareness: 8, items: ['amulet_protect'] },
    narrative:
      '山丘上的神社被櫻花樹環繞——雖然現在不是櫻花季節，但樹枝上仍然掛著一些粉白色的花朵，像是時間在這裡失去了準則。參道兩旁的石燈籠上覆蓋著青苔，空氣中瀰漫著線香和某種野花的混合氣味。\n\n' +
      '當你走上最後一級台階時，你看到了她——一個穿著巫女服的年輕女性，正在用竹帚清掃参道。她的動作很輕柔，像是在跳舞。但你注意到了一個細節——當她轉頭看向你時，她的金色瞳孔中似乎閃過了一絲警覺。\n\n' +
      '她的名字叫狐鈴——至少她自我介紹時是這麼說的。她的微笑溫暖而禮貌，但你能感覺到那微笑背後有一層薄薄的屏障——她在觀察你，就像你在觀察她一樣。',
  },
  {
    id: 'm_main_4',
    nameCN: '医院的异样',
    description: '前往醫院調查，尋找線索。',
    type: 'main',
    objectives: [
      { id: 'm4_obj1', description: '前往醫院', type: 'visit_scene', target: 'hospital' },
      { id: 'm4_obj2', description: '與血月對話', type: 'talk_npc', target: 'vampire_doctor' },
      { id: 'm4_obj3', description: '查看病歷室', type: 'custom', target: 'check_medical_records' },
    ],
    prerequisites: { minDay: 3 },
    rewards: { awareness: 10, erosion: 5 },
    narrative:
      '白色的醫院大樓在午後的陽光下顯得有些刺眼。消毒水——那種標準的醫院氣味——混合著一股甜膩的香氣，像是有人在不遠處燃燒著某種帶有蜜糖味的香。\n\n' +
      '大廳的前台護士微笑著問你需要什麼幫助。她的笑容很職業——但她的眼睛……她的瞳孔似乎比正常人大了一些。你告訴她你是新來的居民，想做一些常規檢查。她點點頭，在電腦上操作了什麼。\n\n' +
      '在等待的時候，你注意到牆上掛著一排錦旗和感謝信。其中一面錦旗的落款是「理事會」——三個字讓你心頭一緊。你用手機拍下了它。\n\n' +
      '一位穿著白大褂的女性從走廊深處走來。她的步伐優雅而緩慢，像每一步都經過精確計算。她自我介紹為「血月醫生」——她負責你的檢查。你注意到她的白大褂領口下——有一道非常淡的、像被什麼尖銳物體劃過的舊疤痕。',
  },
  {
    id: 'm_main_5',
    nameCN: '学校的秘密',
    description: '前往學校調查，尋找前任調查者的筆記。',
    type: 'main',
    objectives: [
      { id: 'm5_obj1', description: '前往學校', type: 'visit_scene', target: 'school' },
      { id: 'm5_obj2', description: '查看學校圖書館', type: 'custom', target: 'check_school_library' },
      { id: 'm5_obj3', description: '找到前任調查者的筆記', type: 'collect_item', target: 'note_stranger' },
    ],
    prerequisites: { minDay: 4 },
    rewards: { awareness: 12, items: ['note_stranger'] },
    narrative:
      '放學後的校園空無一人。操場上還殘留著孩子們跑動的痕跡——幾個被遺忘的球，沙坑中被踩亂的腳印。教學樓的窗戶反射著夕陽的光芒，像一排燃燒的眼睛。\n\n' +
      '你從側門進入了教學樓。走廊裡很安靜——太安靜了。你的腳步聲在空蕩蕩的走廊中迴盪，每一步都像是有人在跟著你模仿。\n\n' +
      '圖書館在二樓。門沒有鎖——你輕輕推開，一股舊紙張和灰塵的氣味撲面而來。夕陽透過高窗灑進來，照亮了空氣中漂浮的塵埃。\n\n' +
      '你在「地方誌」書架上找到了它——一本夾在兩本厚重的歷史書之間的筆記。封面已經磨損，上面用鋼筆寫著一行小字：「如果你能看到這行字——你已經知道得太多了。不要停止調查。」',
  },
  {
    id: 'm_main_6',
    nameCN: '小巷深处',
    description: '夜晚的小巷裡隱藏著更多秘密。',
    type: 'main',
    objectives: [
      { id: 'm6_obj1', description: '前往夜晚的小巷', type: 'visit_scene', target: 'alley_night' },
      { id: 'm6_obj2', description: '調查發光的塗鴉', type: 'custom', target: 'investigate_graffiti' },
      { id: 'm6_obj3', description: '與魅魔調酒師對話', type: 'talk_npc', target: 'succubus_bartender' },
    ],
    prerequisites: { minDay: 5 },
    rewards: { awareness: 10, erosion: 8, items: ['mirror_antique'] },
    narrative:
      '夜晚的空氣涼爽而潮濕。小巷的路面反射著路燈昏黃的光——但那些塗鴉……它們在黑暗中微微發著光。不是螢光顏料的那種發光——是一種更微弱的、像是從牆壁內部透出來的冷光。\n\n' +
      '你蹲下來仔細觀察那些塗鴉。它們不是普通的街頭藝術——是符號。你認出了其中一些——和你在神社看到的結界紋樣有些相似，但更加……扭曲。像是被惡意改寫過的版本。\n\n' +
      '塗鴉的盡頭是一扇不起眼的鐵門。門上掛著一塊木牌：「夜之酒吧」。你推開門——一陣低沉的爵士樂和混合著酒精與香水味的暖風撲面而來。調酒師站在吧檯後——紫色長髮，暗紅色的瞳孔，嘴角掛著一抹似笑非笑的弧線。\n\n' +
      '「初次見面……還是說，你已經不是第一次來了？」她的聲音像是絲絨一樣滑過你的耳膜。',
  },
  {
    id: 'm_main_7',
    nameCN: '真相逼近',
    description: '收集的線索已經足夠了。前往市政廳面對真相。',
    type: 'main',
    objectives: [
      { id: 'm7_obj1', description: '前往市政廳', type: 'visit_scene', target: 'town_hall' },
      { id: 'm7_obj2', description: '與龍映對峙', type: 'talk_npc', target: 'dragon_mayor' },
      { id: 'm7_obj3', description: '完成最終推理', type: 'custom', target: 'final_deduction' },
    ],
    prerequisites: { minDay: 7, requiredFlags: { met_kitsune_miko: true, met_vampire_doctor: true, met_succubus_bartender: true } },
    rewards: { awareness: 20, erosion: 10 },
    narrative:
      '你把所有線索攤開在桌上——照片、筆記、錄音、樣本。前任調查者的筆記和你的發現互相印證，形成了一張完整的拼圖。\n\n' +
      '常識改變。理事會。龍映市長。四個種族——史萊姆、吸血鬼、魅魔、狐鈴——以及她們背後更古老的存在。\n\n' +
      '你收好所有證據，穿上外套。今天——就是終結這一切的時候了。\n\n' +
      '市政廳是一座莊嚴的歐式建築，白色的石柱在午後陽光下顯得宏偉而冰冷。你推開大門——大廳內部比外面看起來大得多，牆上掛著歷任市長的畫像。最新的那幅——一個威嚴的女性，頭上長著一對紫色的龍角。\n\n' +
      '她的秘書——一個面無表情的男人——攔住了你。「你有預約嗎？」「告訴她——我就是她一直等的那個人。」你平靜地回答。\n\n' +
      '秘書猶豫了一下，然後拿起了電話。幾秒鐘後，他放下電話，做了一個「請」的手勢。\n\n' +
      '市長辦公室的門在你面前打開了。',
  },
];

// ============================================================================
// 支线任务（3个）
// ============================================================================

const SIDE_MISSIONS: MissionData[] = [
  {
    id: 'm_side_flower',
    nameCN: '花店奇遇',
    description: '幫助花音解決溫室的異常問題。',
    type: 'side',
    objectives: [
      { id: 'ms1_obj1', description: '前往花店', type: 'visit_scene', target: 'flower_shop' },
      { id: 'ms1_obj2', description: '與花音對話', type: 'talk_npc', target: 'alraune_florist' },
      { id: 'ms1_obj3', description: '調查溫室異常', type: 'custom', target: 'investigate_greenhouse' },
    ],
    prerequisites: { minDay: 2 },
    rewards: { awareness: 5, items: ['mysterious_seed'] },
    narrative:
      '花店的名字叫「花音」。店面的櫥窗裡陳列著你可能從未見過的花——有些花瓣是半透明的，有些會隨著光線改變顏色，還有一株盆栽植物似乎在隨著看不見的音樂輕輕搖擺。\n\n' +
      '你推開玻璃門，一陣混合了數十種花香的空氣撲面而來。花音——那個總是微笑的女人——正在修剪一枝玫瑰。她抬頭看到你，笑容加深了。\n\n' +
      '但你的視線越過她，落在溫室的方向——那裡傳來了不尋常的振動聲，像是某種大型昆蟲在拍打翅膀。花音的笑容僵了一下——「溫室……最近有些小問題。」她的語氣輕描淡寫，但你知道那不是普通的「小問題」。',
  },
  {
    id: 'm_side_library',
    nameCN: '禁忌图书馆',
    description: '探索圖書館深處的禁書區，尋找關於理事會的記錄。',
    type: 'side',
    objectives: [
      { id: 'ms2_obj1', description: '前往圖書館', type: 'visit_scene', target: 'library' },
      { id: 'ms2_obj2', description: '找到禁書區入口', type: 'custom', target: 'find_forbidden_section' },
      { id: 'ms2_obj3', description: '閱讀理事會紀錄', type: 'custom', target: 'read_council_records' },
    ],
    prerequisites: { minDay: 3, requiredItems: ['note_stranger'] },
    rewards: { awareness: 15, erosion: 5 },
    narrative:
      '圖書館的建築相比這座城市的其他建築來說，顯得格外古老。它的基石上刻著一些被風化的符文——你不確定那是裝飾還是真正有意義的符號。\n\n' +
      '一樓的閱覽室寬敞明亮，幾個人正在安靜地看書。但你此行的目標不是這裡——那份前任調查者的筆記中提到了一條通往地下室的隱藏樓梯。\n\n' +
      '在「市地方誌」書架的最深處，你找到了它——一道幾乎看不出來的門縫，隱藏在木質書架的背面。你側身擠了進去……\n\n' +
      '樓梯向下延伸。燈光越來越暗。空氣中瀰漫著古老紙張和墨水的氣味——以及一絲若有若無的血腥味。你到達了一個被鎖鏈封住的書架前。那些書的書脊上沒有書名——只有編號。你伸手——碰觸了其中一本。',
  },
  {
    id: 'm_side_bargain',
    nameCN: '地下交易',
    description: '在城市的黑市中尋找稀有情報。',
    type: 'side',
    objectives: [
      { id: 'ms3_obj1', description: '找到地下市場入口', type: 'custom', target: 'find_black_market' },
      { id: 'ms3_obj2', description: '與情報販子交易', type: 'talk_npc', target: 'information_broker' },
    ],
    prerequisites: { minDay: 4 },
    rewards: { awareness: 8, items: ['secret_map'] },
    narrative:
      '在酒吧後巷的最深處，有一個你很容易錯過的暗門——如果不是門上那隻發著微光的眼睛符號，你根本不會注意到它。你推開門，走下了一段螺旋樓梯。\n\n' +
      '空氣的溫度在下降，氣味也在變化——從潮濕的泥土味變成了某種混合了藥草和金屬的奇特氣味。燈光變成了暗紅色——像是有人把燈泡浸入了血液中。\n\n' +
      '地下市場不大——只有十幾個攤位。但你一眼就能看出，這裡賣的東西都不是普通商店能看到的。一瓶瓶冒著螢光的液體、裝在籠子裡的奇怪小生物、寫著看不懂文字的古老卷軸……\n\n' +
      '角落裡一個戴著兜帽的身影吸引了你的注意。他面前的桌子上攤開著一張地圖——一張手繪的、標註了許多你從未在地面上見過的地點的地圖。\n\n' +
      '「你是新來的吧。」他低沉的聲音說，沒有抬頭。「我一直在等你。」',
  },
];

// ============================================================================
// TSF 专属任务（8个）
// ============================================================================

const TSF_MISSIONS: MissionData[] = [
  {
    id: 'm_tsf_slime',
    nameCN: '史莱姆渗透',
    description: '以史萊姆形態潛入城市各處。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf1_obj1', description: '轉化為史萊姆形態', type: 'use_tsf', target: 'slime' },
      { id: 'mtsf1_obj2', description: '以史萊姆形態探索3個場景', type: 'visit_scene', target: 'any', count: 3 },
    ],
    prerequisites: { requiredFlags: { player_species: 'slime' } },
    rewards: { flags: { slime_penetration_complete: true }, awareness: 8, erosion: 5 },
    narrative:
      '你的身體逐漸失去了固態的輪廓——手指先開始，像蠟燭一樣融化，然後是手臂，最後是整個身體。你變成了一灘半透明的藍色液體。\n\n' +
      '這種感覺很奇特——你仍然有知覺，但感知的方式完全不同了。你能通過地面感受到周圍的振動，能通過空氣中的濕度變化判斷天氣的轉變。你能流淌到人類無法到達的地方——縫隙、管道、鎖孔。\n\n' +
      '史萊姆形態是完美的滲透工具。你計劃以這種形態探索這座城市的每一個角落——從市政廳的通風管道到神社地基下的古老隧道。沒有人會注意到一灘液體。\n\n' +
      '你沿著牆角流出了房間——開始了你的滲透之旅。',
  },
  {
    id: 'm_tsf_vampire',
    nameCN: '血族密约',
    description: '加入吸血鬼議會，了解血族的秘密。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf2_obj1', description: '轉化為吸血鬼形態', type: 'use_tsf', target: 'vampire' },
      { id: 'mtsf2_obj2', description: '參加吸血鬼議會', type: 'custom', target: 'join_vampire_council' },
    ],
    prerequisites: { requiredFlags: { player_species: 'vampire' } },
    rewards: { flags: { vampire_council_member: true }, awareness: 10, erosion: 8 },
    narrative:
      '血月站在你面前，她的手裡握著一支玻璃注射器——裡面是深紅色的液體，在月光下散發著微弱的光澤。\n\n' +
      '「這是最後一步。」她說。「轉化完成後——你就是我們的一員了。你將獲得永恆的生命——以及永恆的飢渴。」\n\n' +
      '你伸出手臂。針頭刺入皮膚——一種冰涼的液體沿著血管擴散開來。你的心跳先是加速——然後停止了。世界變得不同了——黑暗不再令人恐懼，而是變得舒適而熟悉。你能聽到幾個街區之外的心跳聲。你能聞到血液的氣味——甜美、溫暖、充滿生命力。\n\n' +
      '血月扶住你搖晃的身體。「歡迎——加入血族。」\n\n' +
      '你成為了吸血鬼議會的一員。這個秘密組織在城市的陰影中運作了幾個世紀——現在，你知道了其中的奧秘。',
  },
  {
    id: 'm_tsf_puppet',
    nameCN: '附身傀儡师',
    description: '附身5個不同的NPC。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf3_obj1', description: '附身一個NPC', type: 'custom', target: 'possess_npc', count: 5 },
    ],
    prerequisites: { minDay: 3, requiredFlags: { player_species: 'slime' } },
    rewards: { flags: { puppet_master: true, possessed_all_npcs: true }, awareness: 15, erosion: 10 },
    narrative:
      '附身的技巧比你想像中更難掌握。第一次嘗試時——你只是把自己的意識像墨汁一樣滴入目標的身體中，然後發現自己無法控制對方的四肢——你只能「看著」他們的行動，像一個被綁在副駕駛座上的乘客。\n\n' +
      '但隨著練習——你學會了如何讓自己的意識和目標的神經系統同步。學會了如何接管語言中樞而不讓對方察覺。學會了如何在離開後抹去自己的痕跡。\n\n' +
      '你附身了便利商店的店員，用她的聲音和顧客聊天。你附身了神社的一個參拜者，在他的身體裡體驗了向狐鈴祈禱的感覺。你附身了醫院的清潔工，走進了那些平常人無法進入的房間。\n\n' +
      '每一次附身——你都對這座城市有了更深的了解。你也發現了自己的變化——你越來越難以分辨「自己」和「他人」的界線。每一次附身，你都留下了一小部分自己在對方體內——而對方也有一小部分進入了你。\n\n' +
      '第五次附身結束後——你看著鏡子，發現鏡中的你同時閃過了五張不同的面孔。你不再只是「你」了——你是他們所有人的集合。',
  },
  {
    id: 'm_tsf_memory',
    nameCN: '记忆猎手',
    description: '使用記憶改寫筆收集3段別人的記憶。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf4_obj1', description: '獲得記憶改寫筆', type: 'collect_item', target: 'memory_pen' },
      { id: 'mtsf4_obj2', description: '收集一段他人的記憶', type: 'use_item', target: 'memory_pen', count: 3 },
    ],
    prerequisites: { minDay: 4 },
    rewards: { flags: { memory_hunter: true }, awareness: 12, erosion: 12 },
    narrative:
      '記憶改寫筆——理事會最強大的工具之一。它看起來像一支普通的鋼筆，但筆尖不是金屬——是一種會發光的晶體。\n\n' +
      '使用方法很簡單：將筆尖接觸目標的太陽穴，按下筆身上的按鈕——目標的記憶就會像液體一樣被吸入筆中的儲存槽。你可以查看那些記憶——也可以將它們改寫或刪除。\n\n' +
      '你第一次使用時非常緊張。目標是一個在公園長椅上打盹的老人——你輕輕將筆尖點在他的太陽穴上，按下按鈕。他沒有醒來。筆身微微發熱——一段記憶被抽取了。\n\n' +
      '你觀看了那段記憶：老人年輕時第一次來到這座城市的場景——車站、街道、那時候的神社還沒有現在的規模。一個完全不同的時代。\n\n' +
      '第二次——你選擇了一個理事會的基層職員。她的記憶中有關於會議的片段——理事會討論常識改變範圍的對話。你聽到了龍映的聲音：「邊界再擴大兩個街區——那邊的居民已經準備好了。」\n\n' +
      '第三次——你把筆對準了自己的太陽穴……然後停住了。你真的想知道自己的記憶是否也被改寫過嗎？\n\n' +
      '你放下了筆。至少——現在——你還能選擇不知道。',
  },
  {
    id: 'm_tsf_gender',
    nameCN: '跨越性别',
    description: '體驗所有性別狀態（男/女/雙性/無性）。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf5_obj1', description: '體驗女性狀態', type: 'use_tsf', target: 'gender_female' },
      { id: 'mtsf5_obj2', description: '體驗男性狀態', type: 'use_tsf', target: 'gender_male' },
      { id: 'mtsf5_obj3', description: '體驗雙性狀態', type: 'use_tsf', target: 'gender_futanari' },
      { id: 'mtsf5_obj4', description: '體驗無性狀態', type: 'use_tsf', target: 'gender_neuter' },
    ],
    prerequisites: { minDay: 2 },
    rewards: { flags: { gender_journey_complete: true }, awareness: 15 },
    narrative:
      '性別——你曾經以為這是與生俱來、無法改變的。但在這座城市裡——沒有什麼是不能改變的。\n\n' +
      '第一次轉變是從男性到女性。你站在鏡子前，看著自己的身體輪廓逐漸變化——肩膀變窄，腰線出現，胸部曲線慢慢隆起。那種感覺很奇特——不是痛苦，而是一種深層的、身體結構的重新排列。\n\n' +
      '你穿上衣服走上街。世界看待你的方式變了——人們的目光停留得更久一些，說話的語氣更溫柔一些，但也多了一種你之前未曾注意到的、細微的防備。\n\n' +
      '然後是雙性——你同時擁有兩種性別的特徵。這不是簡單的疊加，而是一種全新的平衡。你的感知方式改變了——你能同時理解兩種性別的視角，但也被兩種性別的社會期待所困擾。\n\n' +
      '最後是無性——你不再具有任何性別特徵。你站在鏡子前——鏡中的你純粹而中性，像一座尚未被雕刻的大理石。你感到一種前所未有的自由——沒有了性別帶來的所有預設和限制，你只是「存在著」。\n\n' +
      '經歷了這四種狀態後——你對性別的理解徹底改變了。它不是二元對立的——而是一個光譜。而你——可以在這個光譜上任意移動。',
  },
  {
    id: 'm_tsf_all_species',
    nameCN: '万象种族',
    description: '體驗至少3種不同種族。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf6_obj1', description: '體驗第一種種族', type: 'use_tsf', target: 'species_first' },
      { id: 'mtsf6_obj2', description: '體驗第二種種族', type: 'use_tsf', target: 'species_second' },
      { id: 'mtsf6_obj3', description: '體驗第三種種族', type: 'use_tsf', target: 'species_third' },
    ],
    prerequisites: { minDay: 3 },
    rewards: { flags: { species_journey_complete: true }, awareness: 20, erosion: 10 },
    narrative:
      '同一座城市——三種截然不同的感知方式。\n\n' +
      '作為史萊姆，世界是溫度和振動的集合。你不需要用眼睛看——你可以通過地面傳導的震動感知周圍的物體。你不需要用耳朵聽——空氣中的濕度變化傳遞著信息。你的身體液態而靈活——沒有骨骼的限制，沒有皮膚的阻隔。世界是流動的、連續的、沒有明確邊界的。\n\n' +
      '作為吸血鬼，世界是嗅覺和聽覺的盛宴。你能聞到幾個街區之外的花香，能聽到隔壁房間中一個人的心跳。世界變得尖銳而清晰——每一種聲音都有層次，每一種氣味都有來源。你的身體輕盈而有力——跳躍可以到達二樓的陽台，奔跑可以追上一輛汽車。但永恆的飢渴像一個空洞——在你的胸腔中低語。\n\n' +
      '作為狐鈴，世界是精神連結的網絡。你能感受到周圍所有人的情緒——就像一個看不見的情感蜘蛛網。有人在你背後悲傷——你的尾巴會垂下。有人在你前方快樂——你的耳朵會微微顫動。你和自然之間存在著古老的契約——你能聽到風中的訊息，能讀懂葉子的低語。\n\n' +
      '三種體驗——每一種都讓你對這座城市有了全新的理解。如果你是史萊姆——城市是溫暖的管道網絡。如果你是吸血鬼——城市是獵場。如果你是狐鈴——城市是活的、在呼吸的巨大有機體。\n\n' +
      '而你——你曾是這三者。你比其他任何人都更了解這座城市。',
  },
  {
    id: 'm_tsf_hypnosis',
    nameCN: '催眠大师',
    description: '使用催眠耳機控制3個人的行為。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf7_obj1', description: '獲得催眠耳機', type: 'collect_item', target: 'hypnosis_headphones' },
      { id: 'mtsf7_obj2', description: '控制目標A', type: 'use_item', target: 'hypnosis_headphones', count: 3 },
    ],
    prerequisites: { minDay: 5 },
    rewards: { flags: { hypnosis_master: true }, awareness: 10, erosion: 15 },
    narrative:
      '催眠耳機——小巧、便攜、致命。它看起來像一對普通的無線耳機，但只要戴上並播放特定的頻率——它就能繞過目標的意識防禦，直接進入潛意識。\n\n' +
      '你選擇的第一個目標是旅館的前台——你需要他「忘記」你曾經在深夜外出。你在他的咖啡裡滴了一滴鎮靜劑，等他開始昏昏欲睡時——你示意他戴上耳機。「放鬆。聽這段音樂——它能幫助你睡眠。」\n\n' +
      '第二天早上——他完全不記得你昨晚出去過。\n\n' +
      '第二個目標是便利商店的店員。你讓他「認為」你是一個老顧客——他從那天起每次都笑著和你打招呼，叫你的名字（一個你從未告訴他的假名）。\n\n' +
      '第三個目標——你選擇了你自己。你想知道——自己的潛意識中藏著什麼。戴上耳機，你聽到了那種低頻的嗡鳴聲……你的意識開始模糊……\n\n' +
      '當你醒來時——你發現自己寫下了一行字：「我不是第一個調查者。我是第七個。」你的手在顫抖。那些被你遺忘的前六次調查——它們的記憶被埋在了你的潛意識最深處。\n\n' +
      '而催眠耳機——把它們挖了出來。',
  },
  {
    id: 'm_tsf_collector',
    nameCN: '改造收藏家',
    description: '收集全部身體改造（尾巴/耳朵/翅膀/皮膚）。',
    type: 'tsf',
    objectives: [
      { id: 'mtsf8_obj1', description: '獲得尾巴改造', type: 'use_tsf', target: 'body_tail' },
      { id: 'mtsf8_obj2', description: '獲得耳朵改造', type: 'use_tsf', target: 'body_ears' },
      { id: 'mtsf8_obj3', description: '獲得翅膀改造', type: 'use_tsf', target: 'body_wings' },
      { id: 'mtsf8_obj4', description: '獲得特殊皮膚', type: 'use_tsf', target: 'body_skin' },
    ],
    prerequisites: { minDay: 4 },
    rewards: { flags: { body_collector_complete: true }, erosion: 12 },
    narrative:
      '你的身體——已經成了一塊可以隨意雕刻的黏土。\n\n' +
      '尾巴是最先獲得的改造。一條蓬鬆的、毛色為銀灰色的狐狸尾巴——來自神社的一份「禮物」。剛開始它很不聽話——會在你緊張的時候僵直，在你開心的時候搖擺。你學會了用尾巴表達情緒——比面部表情真實得多。\n\n' +
      '然後是耳朵——尖尖的、覆蓋著絨毛的狐狸耳朵。你的聽力變得異常敏銳——能聽到隔壁房間中翻書頁的聲音，能聽到遠方神社的風鈴聲。但你也有了一個困擾——下雨的時候耳朵會進水，你需要像狗一樣用力甩頭把它們弄乾。\n\n' +
      '翅膀——來自醫院地下實驗室的「實驗性移植」。你選擇了類似蝙蝠的膜翼——展開後寬達三米。第一次飛行是可怕的——你從神社的屋頂跳下，翅膀本能地張開，風把你托了起來。那種自由——沒有任何言語可以形容。\n\n' +
      '最後是皮膚——你選擇了一種淡藍色的、在月光下會散發微弱螢光的色調。這種皮膚對溫度和觸感極其敏感——你能感覺到空氣中每一絲氣流的移動。\n\n' +
      '現在你站在鏡子前——尾巴、耳朵、翅膀、發光的皮膚。你已經不是人類了——你是你自己親手改造的藝術品。\n\n' +
      '但每一次改造——你都離「人類」更遠了一步。你看著鏡中的自己——美麗、奇特、陌生。你伸出手觸碰鏡面——鏡中的那個人也伸出手。她微笑——你不知道那是滿足還是放棄。',
  },
];

// ============================================================================
// 隐藏任务（3个）
// ============================================================================

const HIDDEN_MISSIONS: MissionData[] = [
  {
    id: 'm_hidden_mirror',
    nameCN: '镜界探索',
    description: '找到通往鏡中世界的入口，探索鏡像城市。',
    type: 'hidden',
    objectives: [
      { id: 'mh1_obj1', description: '找到古銅鏡', type: 'collect_item', target: 'mirror_antique' },
      { id: 'mh1_obj2', description: '啟動鏡面傳送門', type: 'custom', target: 'activate_mirror_gate' },
      { id: 'mh1_obj3', description: '探索鏡中世界', type: 'visit_scene', target: 'mirror_world' },
    ],
    prerequisites: { minDay: 5, requiredItems: ['mirror_antique'] },
    rewards: { flags: { touched_dimensional_mirror: true }, awareness: 20, erosion: 10 },
    narrative:
      '那面古銅鏡——你從小巷的塗鴉旁得到它後，一直覺得它不僅僅是一件古董。它的邊緣刻著一些極其精細的符文——小到你需要用放大鏡才能看清。那些符文在你觸碰它時會微微發熱。\n\n' +
      '經過幾天的研究——你發現了它的秘密。這面鏡子不是用來「看」的——它是用來「穿過」的。在特定的月相下，用特定的方式觸碰鏡面——它會變成一道門。\n\n' +
      '你等待了下一個滿月之夜。午夜時分，你把鏡子放在地上，按照筆記中記載的方式——用右手食指在鏡面上畫了一個圓圈。鏡面開始波動——像水一樣。\n\n' +
      '你深吸一口氣——然後踏了進去。\n\n' +
      '穿過鏡面的感覺像是潛入了一層溫熱的液體——你的身體先是被壓縮，然後被拉伸，最後——你出現在了另一個世界中。\n\n' +
      '天空是紫紅色的。街道的佈局和你熟悉的那座城市一模一樣——但一切都是反轉的。路燈的光是冷藍色的。建築物上有著你不認識的文字。\n\n' +
      '而街上走的——是真實的、沒有偽裝的怪物們。\n\n' +
      '歡迎來到鏡中世界。',
  },
  {
    id: 'm_hidden_truth',
    nameCN: '真相追寻者',
    description: '揭露這座城市和理事會的全部歷史。',
    type: 'hidden',
    objectives: [
      { id: 'mh2_obj1', description: '收集全部六條關鍵線索', type: 'collect_item', target: 'truth_key_clue', count: 6 },
      { id: 'mh2_obj2', description: '進入深淵回廊', type: 'visit_scene', target: 'abyss_corridor' },
      { id: 'mh2_obj3', description: '面對古老存在', type: 'custom', target: 'face_ancient_entity' },
    ],
    prerequisites: { minDay: 8, requiredFlags: { gathered_evidence: true } },
    rewards: { flags: { truth_seeker_complete: true }, awareness: 30, erosion: 15 },
    narrative:
      '你把六條關鍵線索擺在面前——像拼圖一樣把它們組合在一起。\n\n' +
      '第一塊拼圖：神社的歷史記錄中提到了「最初的裂縫」——一個在兩百年前出現的時空裂隙。\n\n' +
      '第二塊拼圖：醫院的檔案中記錄了第一批「轉化者」——他們是在裂隙出現後不久開始顯示出非人類特徵的。\n\n' +
      '第三塊拼圖：理事會的成立文件——最初是一個由人類和怪物娘共同組成的調解組織。\n\n' +
      '第四塊拼圖：那場「大改寫」——五十年前，一個不知名的理事會成員發現了可以通過改寫常識來消除衝突的方法。\n\n' +
      '第五塊拼圖：深淵回廊的入口位置——在市政廳地下四層，一個只有市長知道的秘密電梯。\n\n' +
      '第六塊拼圖——也是最後一塊：你發現的自己的真實身份。你不是外來者——你就是這座城市的一部分。你曾經是理事會的成員——然後你選擇了讓自己忘記一切，重新開始調查。\n\n' +
      '你站在深淵回廊的入口前。門上的符文在你的注視下亮了起來——它們認識你。\n\n' +
      '你推開了門。',
  },
  {
    id: 'm_hidden_entity',
    nameCN: '境界守护者',
    description: '擊敗或者超越深淵中的古老存在。',
    type: 'hidden',
    objectives: [
      { id: 'mh3_obj1', description: '完成「真相追尋者」', type: 'custom', target: 'm_hidden_truth_complete' },
      { id: 'mh3_obj2', description: '在深淵回廊中存活', type: 'custom', target: 'survive_abyss' },
      { id: 'mh3_obj3', description: '達成與古老存在的理解', type: 'custom', target: 'understand_ancient' },
    ],
    prerequisites: { minDay: 10, requiredFlags: { truth_seeker_complete: true } },
    rewards: { flags: { beyond_boundaries: true }, awareness: 50, erosion: 20 },
    narrative:
      '深淵回廊的盡頭——沒有牆壁，沒有地板，沒有天花板。只有一片無限延伸的虛空。而在虛空的中心——有一個存在。\n\n' +
      '它不是物質的。你無法用視覺描述它的「形狀」——它更像是一團思想，一團密度極大的意識能量。你看著它——它也在看著你。不是用眼睛——用你的記憶、你的恐懼、你的渴望。\n\n' +
      '「你回來了。」它的「聲音」在你腦海中響起——不是語言，而是直接傳遞的意義。「你走了很遠的路——比我預期中更遠。」\n\n' +
      '「你是誰？」你問——不是用嘴巴，而是用思想。\n\n' +
      '「我是這座城市的意識。我是所有常識改變的源頭。我是——這座城市本身。」\n\n' +
      '它向你展示了真相：這座城市是一個活著的生物——一個古老的、沉睡的存在。理事會的常識改寫——只是它夢境的延伸。怪物娘們——是它夢境中的居民。人類——是它夢境中的客人。\n\n' +
      '而你——你是它用來觀察自己的眼睛。\n\n' +
      '「你有兩個選擇。」它說。「留下——成為我的一部分，幫助我管理這個夢境。或者——離開，忘記一切，回到你的世界。」\n\n' +
      '你沉默了很久。然後你做出了選擇——不是它給你的兩個選項中的任何一個。\n\n' +
      '你選擇了超越。',
  },
];

// ============================================================================
// 聚合导出
// ============================================================================

export const MISSIONS: MissionData[] = [
  ...MAIN_MISSIONS,
  ...SIDE_MISSIONS,
  ...TSF_MISSIONS,
  ...HIDDEN_MISSIONS,
];

/**
 * 根据 ID 查找任务
 */
export function getMissionById(id: string): MissionData | undefined {
  return MISSIONS.find((m) => m.id === id);
}

/**
 * 根据类型过滤任务
 */
export function getMissionsByType(type: MissionData['type']): MissionData[] {
  return MISSIONS.filter((m) => m.type === type);
}

/**
 * 检查任务前置条件是否满足
 */
export function checkMissionPrerequisites(prereqs: MissionPrerequisites | undefined, state: any): boolean {
  if (!prereqs) return true;

  if (prereqs.minDay !== undefined && (state.currentDay ?? 1) < prereqs.minDay) return false;

  if (prereqs.requiredFlags) {
    for (const [key, value] of Object.entries(prereqs.requiredFlags)) {
      const flagVal = state.flags?.[key];
      if (typeof value === 'boolean') {
        if (!!flagVal !== value) return false;
      } else if (typeof value === 'number') {
        if (typeof flagVal !== 'number' || flagVal < value) return false;
      } else if (typeof value === 'string') {
        if (String(flagVal) !== value) return false;
      } else {
        if (flagVal !== value) return false;
      }
    }
  }

  if (prereqs.requiredItems) {
    const inventory = state.inventory ?? [];
    for (const itemId of prereqs.requiredItems) {
      if (!inventory.some((i: any) => i.id === itemId)) return false;
    }
  }

  return true;
}
