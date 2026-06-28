// ===== 事件定义 - 常識改変TSF × Monster Girl =====
// structure: 'confirming_choice' 渐进确认 | 'switch_route' 交换路线
//            'scoring' 计分选择 | 'reentrant' 可重入对话 | 'simple_branch' 简单分支
//            'identity_shift' 身份改写 | 'bad_end_check' 坏结局判定

export type EventStructure =
  | 'confirming_choice'
  | 'switch_route'
  | 'scoring'
  | 'reentrant'
  | 'simple_branch'
  | 'identity_shift'
  | 'bad_end_check';

export interface EventChoice {
  text: string;
  effects: {
    erosion?: number;
    awareness?: number;
    affinity?: { characterId: string; change: number };
    item?: { add?: string[]; remove?: string[] };
    setFlag?: string;
    triggerEvent?: string;
    transform?: string;
  };
  resultText: string;
  badEndTrigger?: { erosionThreshold: number; description: string };
}

export interface EventNarrative {
  residentSegments: string[];
  truthSegments: string[];
}

export interface GameEvent {
  id: string;
  sceneId: string;
  title: string;
  structure: EventStructure;
  conditions: {
    minErosion?: number;
    maxErosion?: number;
    minAwareness?: number;
    dayPhase?: string[];
    dayMin?: number;
    hasItem?: string[];
    completedEvents?: string[];
    flags?: string[];
  };
  narrative: EventNarrative;
  choices: EventChoice[];
  effects: {
    erosion?: number;
    awareness?: number;
    setFlag?: string;
    setDiscovery?: string;
    triggerItemDrop?: string;
  };
  badEndCheck?: {
    condition: string;
    erosionThreshold: number;
    description: string;
  };
}

export const events: GameEvent[] = [

  // ===== 1-2. 渐进确认型 (confirming_choice) =====

  // --- 1. 便利店的真夜 ---
  {
    id: 'conv_store_midnight',
    sceneId: 'convenience_store',
    title: '深夜的便利店',
    structure: 'confirming_choice',
    conditions: { dayPhase: ['night'], minErosion: 15 },
    narrative: {
      residentSegments: [
        '深夜的便利店只有你一个人。日光灯发出轻微的嗡嗡声，冷柜的压缩机间歇性运转。',
        '小翠站在收银台后面，看起来有些疲惫。她打了一个哈欠——但你注意到她的嘴张开的幅度有些太大了。',
        '「啊……抱歉，今天太累了。」她用一种黏黏的声音说。你注意到她的手指在灯下有些半透明。',
      ],
      truthSegments: [
        '在日光灯的照射下，小翠的身体确实在「融化」。她的手指尖端变得透明，能看到淡绿色的胶质在皮肤下流动。',
        '她似乎完全没注意到——或者说她已经习惯了。她揉了揉眼睛，一小块胶状物从她的眼角滑落，她迅速用袖子擦掉了。',
        '「嗯……你要買什麼嗎？還是……只是想和我聊聊天？」她歪著頭看你，眼底閃過一絲不屬於人類的光芒。',
      ],
    },
    choices: [
      {
        text: '「你沒事吧？你看起來……不太對勁。」',
        effects: { erosion: 2, awareness: 5, affinity: { characterId: 'slime_girl', change: 10 } },
        resultText: '小翠的表情僵硬了一秒，然後她笑了——那種過於燦爛、嘴角裂得太開的笑容。「我沒事呀，只是有點累……你真是個溫柔的人呢。」她低下頭，你看到她桌下的陰影裡有什麼在蠕動。',
      },
      {
        text: '假裝沒看到，快速買了東西離開。',
        effects: { erosion: 1 },
        resultText: '你匆匆結了帳，快步走出便利店。身後的門關上時，你聽到小翠用一種不是你聽過的語言小聲說了句什麼。你沒有回頭看。',
      },
      {
        text: '直視她的眼睛。「我看到你的手了。」',
        effects: { erosion: 5, awareness: 10, affinity: { characterId: 'slime_girl', change: -5 } },
        resultText: '小翠的笑容凝固了。她的身體明顯顫抖了一下，手指縮回袖子裡。空氣沉默了漫長的五秒鐘。然後她低下頭，用一種很輕的聲音說：「……你看到了？那你……不害怕嗎？」她的聲音裡有一種小心翼翼的期待。',
      },
    ],
    effects: { erosion: 3, setFlag: 'slime_encounter_night' },
  },

  // --- 2. 学校的旧档案 ---
  {
    id: 'school_old_records',
    sceneId: 'school',
    title: '保健室的旧档案',
    structure: 'confirming_choice',
    conditions: { minErosion: 20, dayPhase: ['afternoon'] },
    narrative: {
      residentSegments: [
        '放学后的保健室空无一人。你因為幫忙搬運教材而被叫來這裡。',
        '牆上的文件櫃半開著，露出裡面的檔案夾。其中一本的標籤脫落了。',
        '你出於好奇抽出來翻看——裡面是學生的健康檢查記錄，但內容有些奇怪。',
      ],
      truthSegments: [
        '這些「健康記錄」根本不是普通的體檢表。每一張上都有一欄叫「物種特徵穩定性」的評分。',
        '你在其中一張上看到了你認識的名字——是一個看起來很普通的女生。在她的記錄上寫著：「夜行性覺醒第3階段，建議使用抑制劑，月圓前夜需隔離觀察。」',
        '另一張記錄的更早——十年前——上面的「物種」欄寫著「人類」。但最近的一次記錄上同一個人的物種變成了「半妖·狐系」。體重欄寫著：「含尾巴計量」。',
      ],
    },
    choices: [
      {
        text: '仔細翻看更多記錄——你要了解真相。',
        effects: { erosion: 4, awareness: 8 },
        resultText: '你翻到了最底層的一份文件。封面上寫著「城市常識改編計劃·教育系統適應方案」。你的手開始發抖。這不是學生的健康記錄——這是怪物娘化的監控記錄。整座學校都在參與這個計劃。',
      },
      {
        text: '把檔案放回去，假裝沒看到。',
        effects: { erosion: 1, awareness: 2 },
        resultText: '你把檔案塞回櫃子，關上櫃門。但你腦海裡那些「含尾巴計量」「夜行性覺醒」的字樣揮之不去。你突然想起來——那個女生的座位，好像已經空了好幾天了。',
      },
      {
        text: '拍下證據。',
        effects: { erosion: 3, awareness: 10, item: { add: ['evidence_photos'] } },
        resultText: '你用手機拍下了幾張關鍵的記錄。當快門聲響起時，保健室的門突然被打開了。山田老師站在門口，表情複雜地看著你。「……你果然看到了。」她嘆了口氣。「我們談談吧。」',
      },
    ],
    effects: { erosion: 3, setFlag: 'school_records_found' },
  },

  // ===== 3-4. 交换路线型 (switch_route) =====

  // --- 3. 花园的秘密 ---
  {
    id: 'garden_secret',
    sceneId: 'flower_shop',
    title: '温室深处',
    structure: 'switch_route',
    conditions: { minErosion: 25, minAwareness: 20 },
    narrative: {
      residentSegments: [
        '花音邀請你到店後面參觀她的溫室。「有些特別的花，我想讓你看一看。」她微笑著說，眼神清澈。',
        '溫室比你想像的大得多，到處是茂密的植物。空氣溫暖潮濕，充滿了泥土和花蜜的氣息。',
        '你注意到溫室的盡頭有一株巨大的、頂端散發著螢光的植物——它看起來不像地球上任何已知的物種。',
      ],
      truthSegments: [
        '靠近那株植物時，你看到它的「花瓣」其實是半透明的膜狀組織，內部流動著淡金色的液體。植物的根部延伸進地下深處——那不是普通的根。',
        '花音站在植物旁邊，她的手輕輕撫摸著莖幹。在這一刻，你發現她的皮膚和植物的組織之間有相似的光澤。',
        '「這是我……出生時的地方。」她輕聲說，沒有回頭。「我是從這株植物中誕生的。」空氣中飄散的花粉開始發出微弱的光芒。',
      ],
    },
    choices: [
      {
        text: '「所以……你也不是人類？」（直接詢問路線）',
        effects: { erosion: 5, awareness: 10, affinity: { characterId: 'alraune_florist', change: 15 } },
        resultText: '花音轉過頭，她的眼睛裡沒有驚訝。她只是微微一笑——那笑容裡包含著悲傷和釋然。「終於有人問了。」她抬起手，掌心裂開一道縫，從中生長出一朵含苞待放的白色花朵。「是的。我不是人類。我是這座城市的植物——我的根連接著整個城市的地下網絡。」',
      },
      {
        text: '後退一步——這太超過你的理解範圍了。（退縮路線）',
        effects: { erosion: 2, awareness: -5, affinity: { characterId: 'alraune_florist', change: -10 } },
        resultText: '你後退的一步踩斷了一根藤蔓。那藤蔓發出尖銳的「吱」聲，迅速縮回了泥土中。花音的表情黯淡了一下，但她馬上恢復了溫柔的微笑。「沒關係……我理解。這對你來說太突然了。」她轉過身，你看到她背後的頭髮裡有綠色的藤蔓在不安地蠕動。',
      },
    ],
    effects: { setFlag: 'greenhouse_visited', setDiscovery: 'alraune_truth' },
  },

  // --- 4. 占卜与抉择 ---
  {
    id: 'fortune_crossroads',
    sceneId: 'shopping_street',
    title: '命运的十字路',
    structure: 'switch_route',
    conditions: { minErosion: 30, completedEvents: ['lamia_reveal'] },
    narrative: {
      residentSegments: [
        '你再次來到蛇目的占卜店。薰香的氣味比上次更濃郁了。',
        '她坐在占卜桌後方，水晶球散發著柔和的光芒。桌面上的塔羅牌已經排出一個十字形的陣列。',
        '「我一直在等你。」她說。她的聲音聽起來有些遙遠，像從很深的井底傳上來。',
      ],
      truthSegments: [
        '水晶球內部——那不是反射的光芒。那是真正的光，從球體的內部散發出來的。裡面有畫面在流動。',
        '你看到一個城市的輪廓——但那個城市的建築和街道和你認識的完全不一樣。那是扭曲的、有機的結構，像是某種巨大的生物體。',
        '「這是未來的可能性之一。」蛇目說。「如果你繼續調查下去，這座城市會變成這個樣子。但你也可以選擇另一條路。」她翻開一張牌——牌面上是一個空白的人形輪廓。',
      ],
    },
    choices: [
      {
        text: '「告訴我，如何阻止常識改變。」（阻止路線）',
        effects: { erosion: 5, awareness: 15, setFlag: 'stop_the_change' },
        resultText: '蛇目的嘴角浮現出一絲讚許的微笑。「你有勇氣。但我必須讓你知道——阻止常識改變，意味著抹消所有已經發生的變化。那些已經變成怪物娘的人……會恢復原狀。包括那些已經適應了新身體的人。這是你想要的嗎？」她的蛇尾在桌下不安地敲擊著地板。',
      },
      {
        text: '「告訴我，如何與這個新世界共存。」（接受路線）',
        effects: { erosion: 8, awareness: 10, setFlag: 'accept_the_change' },
        resultText: '蛇目點了點頭，翻開另一張牌。牌面上畫著人類和蛇尾的圖案交織在一起。「接受常識改變，意味著你會逐漸失去對舊世界的記憶。你會……變成她們的一員。你準備好了嗎？」她的琥珀色眼睛直視著你，瞳孔微微放大。',
      },
    ],
    effects: { setFlag: 'fortune_route_chosen' },
  },

  // ===== 5-6. 计分选择型 (scoring) =====

  // --- 5. 医院夜巡 ---
  {
    id: 'hospital_night_patrol',
    sceneId: 'hospital',
    title: '夜巡·血月',
    structure: 'scoring',
    conditions: { dayPhase: ['night'], minErosion: 30 },
    narrative: {
      residentSegments: [
        '深夜的醫院走廊被慘白的日光燈照亮。消毒水的氣味比白天更濃。你來找血月護士長——她說有東西要給你看。',
        '她站在護士站裡，背對著你，正在整理一些文件。她的銀色長髮在燈光下泛著冷光。',
        '「你來了。」她沒有回頭。「我一直在想……要不要給你看這個。」',
      ],
      truthSegments: [
        '血月轉過身時，你看到她的瞳孔是暗紅色的——她忘記戴隱形眼鏡了。或者說，她已經不在乎了。',
        '她遞給你的不是文件——是一張泛黃的照片。照片上是一群穿著十九世紀服裝的人，站在一家古老醫院的門口。',
        '照片的正中央——是血月。穿著同樣的護士服，留著同樣的銀色長髮。照片的拍攝日期是1887年。',
      ],
    },
    choices: [
      {
        text: '「你活了多久？」（直接提問，+2知性）',
        effects: { awareness: 2, affinity: { characterId: 'vampire_nurse', change: 5 } },
        resultText: '血月輕輕地笑了——那是一種跨越了漫長歲月的人才有的笑容。「三百四十七年。其中五十年在這座城市，三十年在這家醫院。」她指了指照片上站在角落的一個年輕男醫生。「那是我第一任丈夫。他已經去世一百二十多年了。」',
      },
      {
        text: '「這家醫院到底在隱瞞什麼？」（追問，+2侵蝕）',
        effects: { erosion: 2, affinity: { characterId: 'vampire_nurse', change: 10 } },
        resultText: '她的笑容消失了。她沉默了很久，然後說：「地下三層有一間不對外開放的手術室。那些病歷上標著『物種：不明』的患者……都在那裡接受過『適應性改造』。」她看著你。「包括你的檔案。我去看過。」',
      },
      {
        text: '保持沉默，等她主動開口。（中立，+1侵蝕）',
        effects: { erosion: 1, awareness: 3 },
        resultText: '你們之間有一段長長的沉默。最後血月嘆了口氣，把照片收回抽屜。「你知道嗎……有時候我希望自己還是人類。這樣我就不用眼睜睜看著這一切發生了。」她的語氣裡有著真切的疲憊。',
      },
    ],
    effects: { erosion: 2, setFlag: 'hospital_secret_learned', setDiscovery: 'vampire_photo' },
    badEndCheck: { condition: '如果在醫院區域侵蝕率超過50時觸發警報', erosionThreshold: 50, description: '你的存在引起了理事會的注意。在你離開醫院時，幾個穿黑色西裝的人「邀請」你上了一輛黑色轎車。你再也沒有出現過。' },
  },

  // --- 6. 酒吧问答 ---
  {
    id: 'bar_quiz',
    sceneId: 'bar',
    title: '魅魔的测试',
    structure: 'scoring',
    conditions: { dayPhase: ['night'], minErosion: 35 },
    narrative: {
      residentSegments: [
        '酒吧裡流淌著慵懶的爵士樂。夜魅今晚沒有在吧檯後面——她坐在你的對面，翹著腿，手中端著一杯冒著紫色煙霧的雞尾酒。',
        '「我們來玩個遊戲吧。」她微笑著說，嘴角上揚的弧度恰到好處。「我問你三個問題。你的回答決定……你能從我這裡得到什麼。」',
        '她把酒杯推到你面前。紫色的煙霧在空中凝結成一個小小的問號。',
      ],
      truthSegments: [
        '在昏暗的燈光下，夜魅的影子在牆上投射出巨大的惡魔輪廓——蝙蝠翅膀展開，尾巴末端的心形閃爍著粉紅色的光。',
        '那杯酒的煙霧不同尋常——它在空中形成了細小的符文，圍繞著你的頭部旋轉。這是一種探測魔法，她在測試你的真實想法。',
        '「第一問：你覺得……『常識』是什麼？」她的眼睛在黑暗中微微發光。',
      ],
    },
    choices: [
      {
        text: '「常識是多數人相信的謊言。」（哲學回答，+3知性）',
        effects: { awareness: 3, affinity: { characterId: 'succubus_bartender', change: 10 } },
        resultText: '夜魅愣了一下，然後發出了由衷的笑聲。「哈哈哈哈……有趣的答案！已經很久沒有人這樣回答了。」她打了一個響指，杯中的煙霧變成了金色。「第二問：你願意為了真相付出什麼？」',
      },
      {
        text: '「常識是用來保護我們的。」（保守回答，+2侵蝕）',
        effects: { erosion: 2, affinity: { characterId: 'succubus_bartender', change: 5 } },
        resultText: '夜魅的笑容變得耐人尋味。「保護？呵呵……你的常識正在崩潰，但你還在相信它是保護你的。真是可愛。」她喝了一口自己的酒。「第二問：你覺得我在掩飾什麼？」',
      },
      {
        text: '「我不知道……我連自己的常識都開始懷疑了。」（誠實回答，+5侵蝕，+5知性）',
        effects: { erosion: 5, awareness: 5, affinity: { characterId: 'succubus_bartender', change: 15 } },
        resultText: '夜魅的表情變得柔和了一些。她放下酒杯，第一次用真誠的語氣說：「你已經走在正確的路上了。」她靠過來，在你耳邊低語——溫熱的氣息讓你脖子發癢——「第三問：你想成為什麼？」',
      },
    ],
    effects: { awareness: 3, setFlag: 'bar_test_completed' },
  },

  // ===== 7-8. 可重入对话型 (reentrant) =====

  // --- 7. 旧书店的常客 ---
  {
    id: 'bookstore_recurring',
    sceneId: 'old_bookstore',
    title: '旧书店老板的低语',
    structure: 'reentrant',
    conditions: { minErosion: 15 },
    narrative: {
      residentSegments: [
        '你又來到了這家舊書店。門口的風鈴叮噹作響，老人抬頭看了你一眼，又低下頭繼續看他的書。',
        '店內的氣氛和上次一樣——書本的氣息，灰塵的味道，沉靜的午後。',
        '但這次，你注意到了一些以前沒看到的東西。',
      ],
      truthSegments: [
        '老人——他的眼睛在鏡片後閃爍著非人的光澤。你上次沒有注意到，他的瞳孔是豎直的。',
        '角落裡的那些無標題的書——你上次不敢碰。但這次，有一本書的書脊上浮現出了文字。',
        '文字是：「你終於願意看了。」',
        '你抬頭看向老人。他正微笑著看著你——那是一種「我等你很久了」的笑容。',
      ],
    },
    choices: [
      {
        text: '「這本書……上面的字是什麼意思？」（每次可選，可重複觸發）',
        effects: { awareness: 3, setFlag: 'bookstore_progress' },
        resultText: '老人的笑容加深了。他的聲音像是從很遠的地方傳來：「字面上的意思。你開始看到了。這很好。」他站起來，走到你面前。他的手——你現在才注意到——只有四根手指，而且關節的數量不對。',
      },
      {
        text: '放下書，離開。',
        effects: {},
        resultText: '你把書放回架子上。當你轉身時，你聽到老人在你身後說：「下次來的時候，你會有更多的問題。」你走出書店，發現天色比進來時暗了很多——雖然你只在裡面待了幾分鐘。',
      },
    ],
    effects: { setFlag: 'bookstore_visited' },
  },

  // --- 8. 裁缝店的定做 ---
  {
    id: 'tailor_recurring',
    sceneId: 'tailor_shop',
    title: '订做一件新衣',
    structure: 'reentrant',
    conditions: { minErosion: 25, minAwareness: 15 },
    narrative: {
      residentSegments: [
        '你走進裁縫店，老裁縫正在工作檯前縫製一件深藍色的外套。他的動作精準而優雅。',
        '「啊，上次的客人。」他頭也不抬地說。「我一直在想……你需要一件新衣服。」',
        '你有些困惑——你沒有定做過衣服。但他已經拿起卷尺，示意你站過去。',
      ],
      truthSegments: [
        '牆上的「老照片」中的一張——你上次沒仔細看——畫面中的人是明治時代的打扮。但那個人的臉……和面前的老裁縫一模一樣。',
        '裁縫店的後方有一道門簾，你聽到門簾後面有細微的說話聲。不是人類的語言。',
        '老裁縫在量你的尺寸時，他的手指在你後背上停頓了一下——位置正好是你的肩胛骨處。他的手指輕輕按了按，像在確認什麼。「嗯……已經開始了。」他低聲說。',
      ],
    },
    choices: [
      {
        text: '「什麼開始了？」（追問，每次可選，可重複）',
        effects: { awareness: 4 },
        resultText: '他沒有回答你的問題，而是繼續量尺寸。「這件衣服會在後背處留一個開口——不用擔心，這是一種特殊的設計。」他若無其事地說。你突然理解了他的意思——那開口是為了……翅膀？',
      },
      {
        text: '拒絕他的好意，離開裁縫店。',
        effects: { erosion: 1 },
        resultText: '你推開裁縫店門的時候，他在你身後說：「當你需要的話……我的店永遠為你敞開。等你知道了自己真正的尺寸再來。」你回頭時，他已經回到工作檯前，哼著一首古老的歌謠。',
      },
    ],
    effects: { setFlag: 'tailor_measured' },
  },

  // ===== 9-12. 简单分支型 (simple_branch) =====

  // --- 9. 地铁站异变 ---
  {
    id: 'subway_anomaly',
    sceneId: 'subway_station',
    title: '不该停靠的站台',
    structure: 'simple_branch',
    conditions: { minErosion: 15, dayPhase: ['evening', 'night'] },
    narrative: {
      residentSegments: [
        '你在地鐵站等車。電子螢幕顯示下一班列車將在三分鐘後到站。',
        '站台上還有七八個乘客，各自低頭看著手機。一切都顯得很正常。',
        '列車進站了——但你注意到一個奇怪的地方：這趟列車的編號不是你等的路線。',
      ],
      truthSegments: [
        '車門打開的瞬間，你看到了不可思議的景象：車廂內部不是地鐵車廂——它是一個完全不同的空間。',
        '有些車廂裡是茂密的森林，透過車窗能看到螢光色的蘑菇和飛舞的發光生物。另一節車廂看起來像是一座古老的圖書館，書架高聳入雲。',
        '還有一節車廂——裡面是虛空。完全的、沒有任何東西的虛空。但你知道那不是空的——有什麼東西在那片虛空中注視著你。',
        '站台上的其他乘客開始上車，他們對這些異常沒有任何反應，彷彿看到森林和圖書館是地鐵的正常風景。',
      ],
    },
    choices: [
      {
        text: '走上通往森林的那節車廂。',
        effects: { erosion: 8, awareness: 10, setFlag: 'took_forest_train' },
        resultText: '你踏入車廂的瞬間，身後的地鐵門關上了。周圍的環境扭曲、拉伸——當它穩定下來時，你站在一片螢光森林中。空氣中充滿了甜膩的花香。不遠處有一條小徑，小徑的盡頭是一座……你不確定那是什麼建築。它看起來像是由活的藤蔓和骨骼構成的。',
      },
      {
        text: '留在站台上，等下一班正常的列車。',
        effects: { erosion: 2, awareness: 3 },
        resultText: '你目送那班列車駛離站台。當它消失在隧道中時，你聽到從隧道深處傳來低沉的笑聲。下一班列車在五分鐘後到站——完全正常，普通的車廂，普通的乘客。但你知道，你錯過了某個重要的東西。',
      },
      {
        text: '走向那節充滿虛空的車廂。',
        effects: { erosion: 15, awareness: 15, setFlag: 'took_void_train' },
        resultText: '踏入虛空的瞬間，你失去了所有感官——看不見、聽不見、感覺不到自己的身體。在永恆般的幾秒後，你重新「睜開眼」，發現自己躺在市政廳門口的台階上。你的手裡握著一片不屬於這個世界的黑色鱗片。你的侵蝕率急劇上升。',
      },
    ],
    effects: { setFlag: 'subway_anomaly_encountered' },
  },

  // --- 10. 公园的秋千 ---
  {
    id: 'park_swing',
    sceneId: 'park',
    title: '无人的秋千',
    structure: 'simple_branch',
    conditions: { dayPhase: ['night'] },
    narrative: {
      residentSegments: [
        '深夜的公園空無一人。你本來只是穿過公園抄近路回家。',
        '但在經過兒童遊樂區時，你停了下來——其中一架鞦韆正在前後擺動。',
        '沒有風。沒有人。它在沒有人推動的情況下越盪越高。',
      ],
      truthSegments: [
        '鞦韆的鐵鍊在月光下反射著冷光。你注意到——每當鞦韆盪到最高點時，鐵鍊上會浮現出一些文字。',
        '那些文字在黑暗中發著微弱的光。你瞇起眼睛，閱讀那些文字——「幫我」「我在下面」「它不是公園」',
        '鞦韆的座位下方的地面——你看到了一條裂縫。不是普通的裂縫——那是空間的裂縫。從裂縫中滲出淡紫色的霧氣。',
      ],
    },
    choices: [
      {
        text: '檢查裂縫——向下看。',
        effects: { erosion: 6, awareness: 8 },
        resultText: '你蹲下來，靠近那條裂縫。透過狹窄的縫隙，你看到了令人毛骨悚然的景象——公園的地下有一個巨大的空洞，空洞裡有一座倒懸的城市。建築物的尖頂朝下，燈光像星星一樣點綴在「天空」中——不對，那是地面。那座城市和你的城市一模一樣，只是上下顛倒。',
      },
      {
        text: '後退，快速離開公園。',
        effects: { erosion: 1 },
        resultText: '你快步離開了公園。走出公園大門時，你回頭看了一眼——鞦韆已經停了。但裂縫還在。而且它比剛才更大了。你告訴自己明天早上再來看，但你心裡知道，到明天早上，一切都會不一樣。',
      },
    ],
    effects: { setFlag: 'park_crack_found', setDiscovery: 'inverted_city' },
  },

  // --- 11. 图书馆的禁书区 ---
  {
    id: 'library_forbidden',
    sceneId: 'library',
    title: '不该存在的书架',
    structure: 'simple_branch',
    conditions: { minErosion: 25 },
    narrative: {
      residentSegments: [
        '你在圖書館的二樓發現了一個以前沒注意到的區域。兩排書架之間，有一條狹窄的通道。',
        '通道盡頭是一扇不起眼的門——門上沒有任何標示。你伸手推了推，門沒有鎖。',
        '裡面是一個小房間，四面牆壁都是書架。房間中央有一張桌子和一盞燈。',
      ],
      truthSegments: [
        '書架上的書全部是手工裝訂的。你抽出一本——封面沒有標題。翻開內頁，是一種你不認識的文字。但奇怪的是，你能理解其中的內容。',
        '這是一本日記。作者是一位名叫「林婉」的女性——日期是1987年。她寫道：「他們說這是常識改變的第一階段。我已經開始忘記我丈夫的長相了……」',
        '你翻到最後一頁——日期是1990年。字跡變得歪歪扭扭：「我不記得了。我不記得自己是誰。我只記得我有一本日記。但日記上寫的是真的嗎？」',
        '書架上所有的書——來自不同年代，不同作者。但所有內容都關於同一件事：常識改變。從幾百年前就開始了。',
      ],
    },
    choices: [
      {
        text: '把這本日記帶走。',
        effects: { item: { add: ['old_diary'] }, awareness: 10 },
        resultText: '你把日記塞進背包。當你走出那個房間時，你回頭看去——房間不見了。那裡只有一堵牆。你揉了揉眼睛，牆還在。但你背包裡的日記是真實的。',
      },
      {
        text: '記下位置，下次再來仔細看。',
        effects: { awareness: 5 },
        resultText: '你記下了這個房間的位置——二樓東南角，自然科學區和歷史區之間。但當你第二天再來時，那個通道不存在了。那扇門也不存在了。你按著記憶中的位置摸過去——只有一面冰冷的牆壁。',
      },
    ],
    effects: { setFlag: 'secret_library_found', setDiscovery: 'change_history' },
  },

  // --- 12. 游泳馆的人鱼 ---
  {
    id: 'pool_mermaid',
    sceneId: 'swimming_pool',
    title: '泳池底部的影子',
    structure: 'simple_branch',
    conditions: { minErosion: 30, dayPhase: ['afternoon'] },
    narrative: {
      residentSegments: [
        '游泳館的下午格外安靜。泳池裡只有兩三個人。你坐在池邊，腳浸在水中。',
        '水面下，你看到一個身影以極快的速度游過——快到不像人類。',
        '那個身影在泳道盡頭停了下來。水花濺起，一個人從水中冒出——但那個人……不完全是「人」。',
      ],
      truthSegments: [
        '她從水中探出頭時，你看到了——她的耳朵後面有鰓狀的裂縫，正在一開一合。她的眼睛有一層透明的瞬膜，眨眼時從側面橫向覆蓋眼球。',
        '她注意到你在看她。她沒有驚慌——她只是微笑了一下，然後潛回水中。在她轉身時，你看到她腰部以下覆蓋著閃亮的藍綠色鱗片——一條真正的魚尾。',
        '她游到泳池的另一端，靈活地翻身，尾巴在水面上濺起一片水花。泳池裡的其他游泳者……完全沒有反應。彷彿一個美人魚在泳池裡游泳是最正常不過的事情。',
      ],
    },
    choices: [
      {
        text: '跳進泳池，游過去和她說話。',
        effects: { erosion: 4, awareness: 8, setFlag: 'mermaid_contacted' },
        resultText: '你游到她身邊。她沒有逃開——她浮在水中，好奇地打量著你。「你能看到我？」她的聲音清晰悅耳，帶著一種像水流般的韻律。「你也是……呃……正在改變的人嗎？」她指了指你的眼睛——你才意識到，在水中睜眼應該會刺痛，但你完全沒有不適感。',
      },
      {
        text: '假裝沒看到，起身離開。',
        effects: { erosion: 1 },
        resultText: '你快步走出游泳館。在更衣室換衣服時，你看著鏡子中的自己。你的眼睛——瞳孔比平時大了一些。你眨了眨眼，瞳孔恢復了正常。但你心中知道：你在泳池中睜眼時，完全沒有感到刺痛。',
      },
    ],
    effects: { setFlag: 'pool_encounter', setDiscovery: 'mermaid_sighting' },
  },

  // ===== 13-15. 身份改写型 (identity_shift) =====

  // --- 13. 突然的性别改写 ---
  {
    id: 'gender_shift_event',
    sceneId: 'school',
    title: '课堂上的一声咳嗽',
    structure: 'identity_shift',
    conditions: { minErosion: 25, dayPhase: ['morning', 'afternoon'] },
    narrative: {
      residentSegments: [
        '你坐在教室裡。窗外的陽光斜射進來，黑板上寫著數學公式。一切都很正常。',
        '山田老師正在講課。教室裡有同學在竊竊私語——但突然間，話語聲停了。',
        '你注意到——所有人的視線都在看你。你低下頭，發現自己的制服……不一樣了。',
      ],
      truthSegments: [
        '你身上的制服從男款變成了女款——或者反過來。不僅是衣服——你的身體也變了。',
        '你的手變小了（或變大了），你的聲音——你清了一下喉嚨——那是完全不同的音色。',
        '你驚慌地站起來，跑向走廊上的鏡子。鏡子裡映出的不是你的臉——那是一張屬於另一種性別的面孔。是你，但不是你。',
        '身後的教室傳來山田老師平靜的聲音：「同學們請安靜……這種事偶爾會發生。請不要大驚小怪。」她的語氣像是這一切都極其正常。',
      ],
    },
    choices: [
      {
        text: '大喊：「這不正常！」——抗拒改變。',
        effects: { erosion: 8, awareness: 10, setFlag: 'resisted_gender_shift' },
        resultText: '你的喊聲在走廊中迴盪。但沒有人理會你。同學們轉過頭，繼續上課。山田老師走出教室，站在你身邊。「抗拒是沒有用的……」她輕聲說，「只會讓你更痛苦。我也經歷過。」她的眼神裡充滿了理解——和深深的悲傷。',
      },
      {
        text: '深呼吸，接受這個變化——至少暫時接受。',
        effects: { erosion: 5, awareness: 5, setFlag: 'accepted_gender_shift' },
        resultText: '你閉上眼睛，做了幾個深呼吸。當你再次睜開眼時——身體確實變了。但世界沒有崩塌。同學們繼續上課，陽光依然溫暖。你走回座位，腳步有些不穩——這副身體的重心和你熟悉的不一樣。但你能適應。你必須適應。',
      },
      {
        text: '衝出教室，逃離學校。',
        effects: { erosion: 4, setFlag: 'fled_gender_shift' },
        resultText: '你瘋狂地跑出學校。在校門口時，你撞到了一個路人——她驚叫了一聲，你也驚叫了一聲。你的聲音仍然不是你的。你一路跑回家，把自己鎖在廁所裡。鏡子中的那張陌生的面孔正用恐懼的眼神看著你。',
      },
    ],
    effects: { erosion: 5, setFlag: 'gender_shift_experienced' },
  },

  // --- 14. 被改写的身份 ---
  {
    id: 'identity_rewrite',
    sceneId: 'residential_area',
    title: '陌生的家门',
    structure: 'identity_shift',
    conditions: { minErosion: 35, dayPhase: ['evening'] },
    narrative: {
      residentSegments: [
        '你回到住宅區的家門前。掏出鑰匙——但鑰匙插不進鎖孔。',
        '你低頭確認——這是正確的鑰匙，正確的門。但鎖孔變了。',
        '門突然從裡面打開了。一個你不認識的女人站在門口，圍著圍裙，手裡拿著鍋鏟。',
        '「你回來了？快去洗手，晚飯馬上就好。」她自然地對你說。她的語氣像是一直認識你。',
      ],
      truthSegments: [
        '你愣住了。這個女人——你從來沒見過她。但你的記憶深處突然浮現出一些不屬於你的畫面：',
        '——這個女人在廚房裡為你準備早餐的畫面。',
        '——她幫你整理衣領的畫面。',
        '——她在你床邊讀睡前故事的畫面。',
        '這些記憶像種子一樣在你的腦海中生根發芽，正在迅速生長。你感覺自己原本的記憶正在被這些新的記憶覆蓋。',
        '你低下頭，看到門口的鞋櫃上擺著一張全家福——你，這個女人，和一個你不認識的男人。照片中的你笑得很快樂。照片的日期是去年夏天。',
      ],
    },
    choices: [
      {
        text: '接受她——叫她「媽媽」。',
        effects: { erosion: 10, awareness: 5, setFlag: 'accepted_new_mother' },
        resultText: '話一出口，你感覺到一股暖流穿過身體。那些新的記憶變得更加堅固，而你原有的某些記憶開始模糊。你記得你的房間在哪裡——雖然你「應該」不知道。不，你知道的。你一直都知道。這就是你的家。你的母親在叫你吃飯。一切都很正常。',
      },
      {
        text: '拒絕——「你不是我媽媽！」',
        effects: { erosion: 8, awareness: 12, setFlag: 'rejected_new_mother' },
        resultText: '女人的表情從困惑變成了悲傷。她嘆了口氣，放下鍋鏟。「你……又來了。每次都是這樣。」她在圍裙上擦了擦手。「我知道這很難接受。但親愛的——我就是你的媽媽。從你出生的那一天起，我一直都在這裡。」她伸出手想摸你的臉——你後退了。你的腦子裡兩種記憶在激烈地鬥爭。',
      },
      {
        text: '逃跑——離開這個「家」。',
        effects: { erosion: 5, setFlag: 'fled_from_home' },
        resultText: '你轉身就跑。身後的門在你跑出十公尺後關上了。你在街角停下來，回頭看那棟樓——三樓的窗戶裡，那個女人站在那裡，默默地看著你。你發現你的口袋裡多了一張紙條——不知道何時被放進去的。上面用娟秀的字跡寫著：「沒關係，媽媽等你回來。」',
      },
    ],
    effects: { erosion: 8, setFlag: 'identity_rewrite_encountered', setDiscovery: 'memory_overwrite' },
    badEndCheck: { condition: '如果侵蝕率達到50並且接受身份改寫', erosionThreshold: 50, description: '新的記憶完全覆蓋了舊的記憶。你忘記了自己在調查什麼。你忘記了那些怪物娘。你只記得——你是這個家庭的一員，你有一個愛你的母親。世界很正常。一切都很好。' },
  },

  // --- 15. 办公室的空白员工证 ---
  {
    id: 'office_id_shift',
    sceneId: 'shopping_street',
    title: '空白的员工证',
    structure: 'identity_shift',
    conditions: { minErosion: 30, dayPhase: ['afternoon'], hasItem: ['blank_employee_card'] },
    narrative: {
      residentSegments: [
        '你走進商店街深處的一棟老舊辦公樓。樓梯間瀰漫著灰塵和黴味。',
        '三樓有一間廢棄的辦公室——門半開著。你之前在這裡找到了一張空白的員工證。',
        '今天——辦公室的門是鎖著的。但你聽到了裡面的聲音——打字機的聲音。',
      ],
      truthSegments: [
        '你從門縫中看到——辦公室裡有人在辦公。但這間辦公室明明應該是廢棄的。',
        '桌上有一台老式打字機，正在自己運轉。紙張從機器中吐出，上面自動浮現出文字。',
        '你瞇著眼睛看那些文字——那是一份員工檔案。上面的名字……是你的名字。職位欄寫著：「常識調整科·初級專員」。入職日期是——三年前。',
        '你的口袋突然沉了一下。你掏出那張空白的員工證——上面已經出現了你的照片和名字。和打字機上那張檔案一模一樣。',
      ],
    },
    choices: [
      {
        text: '推門走進去——接受這個職位。',
        effects: { erosion: 10, awareness: 8, setFlag: 'accepted_office_job' },
        resultText: '你推開門的瞬間，打字機停了。辦公室裡坐著三個人——他們都抬頭看著你，微笑著。其中一人遞給你一杯咖啡。「新同事來了？歡迎歡迎！你的辦公桌在那邊。」你順著他手指的方向看去——那張桌子上放著你的名牌。你「記得」你已經在這裡工作三年了。不——你確實在這裡工作了三年。',
      },
      {
        text: '撕毀員工證——拒絕被定義。',
        effects: { erosion: 6, awareness: 12, setFlag: 'rejected_office_job' },
        resultText: '你把員工證撕成兩半。辦公室裡的笑容消失了。三個人同時站起來，他們的動作精準地同步，像被同一根線操控的木偶。「你做了錯誤的選擇。」他們的聲音重疊在一起。你轉身就跑。樓梯在你腳下無限延伸——你跑了很久很久，才終於衝出大樓。外面已經是深夜。員工證的碎片還在你口袋裡——它們正在自己復原。',
      },
    ],
    effects: { erosion: 8, setFlag: 'office_encountered' },
  },
];

export default events;
