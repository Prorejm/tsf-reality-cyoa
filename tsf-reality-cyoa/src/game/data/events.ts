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

  // ===== 16-17. 计分选择型 / BAD END检查型 =====

  // --- 16. 校园天台事件 ---
  {
    id: 'school_roof',
    sceneId: 'school',
    title: '天台上的约定',
    structure: 'scoring',
    conditions: { dayPhase: ['afternoon'], minErosion: 30, minAwareness: 20 },
    narrative: {
      residentSegments: [
        '午休時分，你被一陣奇怪的騷動吸引到了學校天台。天台的門平時是鎖著的，但今天它虛掩著。',
        '推開門，你看到一群女生圍在天台中央，她們似乎在進行某種儀式——手拉著手，圍成一個圓圈。',
        '陽光燦爛，微風吹拂著她們的裙擺和頭髮。一切都顯得很正常，但她們口中低聲念誦的詞語卻讓你聽不懂。',
        '你認出了其中幾張面孔——是你班上的同學。她們的表情專注而虔誠，像是在進行某種重要的約定。',
      ],
      truthSegments: [
        '走近了你才看清——她們圍繞的中央地面上，用粉筆畫著一個複雜的魔法陣。符文在陽光下閃爍著微弱的銀光。',
        '那些女生的影子——她們的影子不是人類的形狀。有的長著翅膀，有的拖著尾巴，有的頭頂有角。影子在她們腳下扭曲、蠕動。',
        '其中一個女生抬起頭看到了你。她的眼睛——瞳孔是豎直的，泛著金色的光芒。但她很快微笑了一下，像是在說「沒關係，你可以看」。',
        '你突然注意到，她們每個人的身上都有細微的變化——耳尖變長了、手指間有蹼、或者皮膚上浮現出淡淡的鱗片紋路。她們正在集體轉變。',
      ],
    },
    choices: [
      {
        text: '加入她們的圓圈——你想知道這是什麼。（+3侵蝕，+2知性）',
        effects: { erosion: 3, awareness: 2, setFlag: 'joined_roof_circle' },
        resultText: '你走進圓圈，一個女生拉住了你的手。她的手比你記憶中的更柔軟，也更涼。圓圈重新合攏，你感受到一股電流般的震顫從掌心傳來。那些低語聲變得清晰了——她們在呼喚某個名字。你的身體開始感到輕微的癢，像是有什麼東西正在皮膚下甦醒。',
      },
      {
        text: '出聲打斷她們——「你們在做什麼？」（+2知性）',
        effects: { awareness: 2, affinity: { characterId: 'yamada_teacher', change: -5 } },
        resultText: '你的聲音打破了儀式的節奏。女生們停下低語，有些慌亂地散開。其中一個——你認出她是班長——快步走向你，臉上帶著尷尬的笑容。「啊……沒什麼！我們只是在……嗯……練習社團活動！」她的藉口很蒼白，但你看到她身後的另一個女生迅速用腳抹去了地上的魔法陣。班長靠近你時，你聞到她身上有一股淡淡的、不屬於人類的甜香。',
      },
      {
        text: '默默後退，關上門假裝沒看到。（+1侵蝕）',
        effects: { erosion: 1 },
        resultText: '你輕輕關上天台的門，回到走廊。在門關上的最後一刻，你透過門縫看到——那個抬頭看你的女生對你眨了眨眼，她的眼睛在陰影中發著光。你快步離開，心跳加速。那天下午的課，你完全無法集中精神。',
      },
    ],
    effects: { erosion: 2, setFlag: 'roof_event_witnessed', setDiscovery: 'student_transformation_circle' },
  },

  // --- 17. 酒吧密室 ---
  {
    id: 'bar_secret_room',
    sceneId: 'bar',
    title: '魅魔的收藏室',
    structure: 'bad_end_check',
    conditions: { dayPhase: ['night'], minErosion: 40, minAwareness: 30 },
    narrative: {
      residentSegments: [
        '今晚的酒吧格外安靜。夜魅在吧檯後面擦拭酒杯，看到你進來，她微笑了一下。',
        '「你來了。」她的聲音比平時低沉了一些。「我有東西想給你看——跟我來。」',
        '她解開圍裙，從吧檯後面走出來。她今天穿著一件深紅色的連衣裙，裙擺開叉很高。',
        '她帶你走向酒吧深處的一道門——你以前一直以為那是儲藏室。她推開門，裡面是一道向下延伸的樓梯。',
      ],
      truthSegments: [
        '樓梯很長，牆壁上掛滿了油畫。那些畫的主題讓你臉紅——都是各種形態的魅魔，以及她們的人類伴侶。',
        '地下室是一個寬敞的房間，佈置得像一個維多利亞時代的客廳。牆上的架子上擺滿了各種收藏品——',
        '但當你仔細看時，你發現那不是普通的收藏品。那是「記憶」。一個瓶中裝著發光的霧氣，標籤上寫著「田中·29歲·程式設計師·2019」——下面還有一行小字：「自願捐贈·全部記憶」。',
        '還有一個瓶子裡裝著一縷金色的頭髮，標籤上寫著「最後的純人類DNA樣本·2042年3月」。',
        '這些不是普通的收藏品——這是一個記錄了常識改變全過程的博物館。',
      ],
    },
    choices: [
      {
        text: '「這些……都是從人類身上取下的？」（謹慎追問）',
        effects: { erosion: 5, awareness: 8, affinity: { characterId: 'succubus_bartender', change: 5 } },
        resultText: '夜魅靠在牆上，雙手交叉在胸前。「大部分是自願的。有些人……在改變的過程中選擇了捐贈他們的『舊人類部分』。作為回報，他們獲得了更平穩的過渡。」她指著一個裝著銀色液體的瓶子。「這是眼淚——一個男人在變成魅魔之前流下的最後的人類眼淚。很珍貴的。」',
      },
      {
        text: '「你帶我來看這些的目的是什麼？」（直接質問）',
        effects: { erosion: 3, awareness: 5, affinity: { characterId: 'succubus_bartender', change: 10 } },
        resultText: '夜魅的表情變得嚴肅了。她走到你面前，距離近到你能聞到她身上混合著葡萄酒和某種花香的味道。「因為你正在改變，而且你沒有意識到改變的速度有多快。」她伸出手，指尖輕輕碰了碰你的額頭。「你頭上的角，已經開始長了。你自己沒注意到吧？」',
      },
      {
        text: '靠近那些瓶子仔細觀察。（仔細調查）',
        effects: { erosion: 8, awareness: 10, setFlag: 'secret_room_investigated' },
        resultText: '你走近架子，仔細閱讀那些標籤。年份從1980年代一直到去年。數百個瓶子，記錄了數百個人的轉變歷史。在最底層的架子上，你看到一個空瓶子——標籤是空白的，但上面用鉛筆寫著一行字：「留給下一個訪客。」你背後傳來夜魅輕柔的聲音：「那個是給你的。等你準備好了。」',
      },
    ],
    effects: { erosion: 5, setFlag: 'secret_room_visited', setDiscovery: 'memory_collection' },
    badEndCheck: {
      condition: '如果在收藏室中侵蝕率超過65',
      erosionThreshold: 65,
      description: '你在瀏覽收藏品時，夜魅悄無聲息地關上了身後的門。你轉頭時，她的眼睛在昏暗的燈光下閃爍著粉紅色的光芒。「你看了太多不該看的東西……」她低聲說。你的身體突然變得沉重，意識開始模糊——當你醒來時，你發現自己變成了一件新的「收藏品」。一個標籤正在被貼上瓶子，上面是你的名字。',
    },
  },

  // ===== 18-19. 身份改写型 / 可重入对话型 =====

  // --- 18. 公园喷泉 ---
  {
    id: 'park_fountain',
    sceneId: 'park',
    title: '月下美人魚',
    structure: 'identity_shift',
    conditions: { dayPhase: ['night'], minErosion: 35, minAwareness: 25 },
    narrative: {
      residentSegments: [
        '深夜的公園被月光染成銀白色。你本該回家，但你的腳步不由自主地走向了中央噴泉。',
        '噴泉的水聲在寂靜的夜晚格外清晰。水面反射著月光，波光粼粼。',
        '你坐在噴泉邊緣，把手伸進水中。水很涼——但你不覺得冷。反而有一種奇怪的舒適感。',
        '水面上，你的倒影被漣漪打散。但當水面平靜下來時——你發現倒影中的你，頭髮比實際更長，在水中飄散開來。',
      ],
      truthSegments: [
        '那不是你的頭髮——那是水中另一個存在的頭髮。從水底深處，一綹銀白色的長髮正在向上飄浮。',
        '水面開始翻騰，一個身影從噴泉中央緩緩升起。她——那是一個人魚。她的魚尾在月光下閃爍著珍珠般的光澤，銀髮如瀑布般披散在肩上。',
        '她睜開眼睛看著你。她的眼睛是深海般的藍色，瞳孔是橫向的——像魚類一樣。',
        '「你……能聽到水的聲音嗎？」她的聲音直接在你的腦海中響起。「水在告訴我……你的一部分已經屬於海了。」',
      ],
    },
    choices: [
      {
        text: '「你是誰？為什麼在這裡？」（詢問真相）',
        effects: { erosion: 5, awareness: 8, setFlag: 'mermaid_queen_met' },
        resultText: '她輕輕擺動尾巴，在水面上劃出銀色的漣漪。「我沒有名字……或者說，我有很多名字。我是這座城市所有水域的意識。」她伸出手，指尖觸碰你的臉頰。「你的身體正在改變。我能感覺到——你的皮膚渴望水，你的肺在學習呼吸液體。你來找我，是因為水在呼喚你。」',
      },
      {
        text: '後退——你不想變成水生生物。（抗拒）',
        effects: { erosion: 8, awareness: 5, setFlag: 'resisted_mermaid_shift' },
        resultText: '你猛地站起來後退了幾步。人魚的表情沒有變化——她只是靜靜地看著你。「抗拒是正常的。每個人都會抗拒第一次。」她低下頭，銀髮滑落遮住了半張臉。「但水不會放棄你。當你準備好了——回到這裡。我會等你。」她沉入水中，噴泉恢復了平靜。你的腳——你低頭發現鞋子裡濕透了，但你明明沒有踏進水中。',
      },
      {
        text: '接受她的觸碰——讓水的記憶流入。（接受轉變）',
        effects: { erosion: 12, awareness: 10, setFlag: 'accepted_mermaid_touch', transform: 'mermaid_begin' },
        resultText: '你沒有退縮。她的指尖觸碰到你的額頭——瞬間，你的腦海中被灌入了無數的畫面：海底的城市、在珊瑚中穿梭的人魚群、古老的沉船中沉睡的寶藏。你能感到自己的身體在發生微妙的變化——腳趾之間的皮膚正在變得柔軟，肺部深處有一種奇異的空虛感。當她收回手時，你的耳後出現了三道細小的裂縫——鰓。你已經不再完全是陸地生物了。',
      },
    ],
    effects: { erosion: 8, setFlag: 'mermaid_encounter_night', setDiscovery: 'mermaid_truth' },
  },

  // --- 19. 图书馆禁书区 ---
  {
    id: 'library_forbidden',
    sceneId: 'library',
    title: '禁書區的低語',
    structure: 'reentrant',
    conditions: { minErosion: 25, minAwareness: 20 },
    narrative: {
      residentSegments: [
        '圖書館今天很安靜。你走上二樓，不自覺地又走向了那個角落——那個你之前發現秘密房間的地方。',
        '但今天，通道沒有出現。取而代之的是——一個陌生的女人坐在靠窗的位置看書。',
        '她注意到你的視線，抬起頭微笑了一下。她大概三十多歲，戴著細框眼鏡，穿著素雅的連衣裙。',
        '「你在找什麼嗎？」她的聲音溫和而平靜。但她的眼睛——在光線下泛著一種不自然的暗紅色。',
      ],
      truthSegments: [
        '她手中的書——封面是一幅古老的插畫：一個長著蝴蝶翅膀的女人正在將一個男人包裹在繭中。書名是《變態昆蟲學·人類篇》。',
        '當你走近時，你注意到她的脖子上有細小的、類似昆蟲外骨骼的花紋——是一種紋身嗎？還是不……那些花紋在隨著她的呼吸微微起伏。',
        '她的眼鏡——鏡片後的瞳孔是複眼般的六邊形結構。當你盯著看時，她眨了眨眼，瞳孔恢復了正常的人類形態。',
        '「我是這裡的管理員。」她合上書，站起身。她比你印象中的圖書館管理員年輕得多。「那間房間……你之前進去過吧？」她的語氣輕柔，但你知道——那不是一個問題。',
      ],
    },
    choices: [
      {
        text: '「是，我進去過。你是魔女嗎？」（每次可選，可重複）',
        effects: { awareness: 3, setFlag: 'witch_library_talk' },
        resultText: '她輕輕笑了——那是一種閱盡千帆的笑容。「魔女？這個稱呼太古老了……不過在某種意義上，你沒說錯。」她從書架上抽出一本書——在你眼前，那本書的書脊自己動了，滑入她的手中。「我負責守護這些書，以及……決定誰可以閱讀它們。你已經看過一些了。你想看更多嗎？」',
      },
      {
        text: '「不，我只是路過。」——離開。',
        effects: {},
        resultText: '你轉身離開時，她在你身後輕聲說了一句話：「你脖子後面——有一根羽毛。白色的。」你下意識地摸了摸後頸——什麼也沒有。但當你走出圖書館時，你在地上撿到了一根純白色的羽毛，在陽光下泛著柔和的光。你不記得那裡之前有羽毛。',
      },
    ],
    effects: { setFlag: 'witch_librarian_met' },
  },

  // ===== 20-21. 渐进确认型 / 交换路线型 =====

  // --- 20. 医院地下室 ---
  {
    id: 'hospital_basement',
    sceneId: 'hospital',
    title: '地下手術室',
    structure: 'confirming_choice',
    conditions: { dayPhase: ['night'], minErosion: 35, completedEvents: ['hospital_night_patrol'] },
    narrative: {
      residentSegments: [
        '你按照血月之前給的提示，找到了通往地下三層的樓梯。門上掛著「禁止進入」的牌子，但鎖是壞的。',
        '推開門，一股潮濕的冷空氣撲面而來。這裡的氣溫比樓上低了至少十度。',
        '走廊的燈是聲控的——亮了一盞，然後是下一盞。像是某種引導。走廊兩側的門都緊閉著，窗戶是毛玻璃，看不到裡面。',
        '盡頭是一扇雙開門，門上寫著「第三手術室」。門縫下透出幽藍色的光。',
      ],
      truthSegments: [
        '透過門上的小窗，你看到手術室裡有人——或者說，有東西。',
        '手術台上躺著一個赤裸的人形，身上連接著各種管子和電極。但它的「身體」——那不是人類的身體。它的皮膚是半透明的，能看到內臟——但那些內臟的排列方式不對。心臟在右側，肝臟在上方。',
        '手術台旁邊站著兩個穿白大褂的醫生。其中一個正在用一把骨鋸小心地切開人形的胸腔——但切口處流出的不是血，是一種螢光綠色的液體。',
        '另一個醫生抬起頭，看向門的方向。你認出了那張臉——是血月。她直直地看著門上的小窗，像是早就知道你會來。',
      ],
    },
    choices: [
      {
        text: '推門進去——「這是什麼？」（確認，直面真相）',
        effects: { erosion: 10, awareness: 12, setFlag: 'basement_surgery_witnessed' },
        resultText: '你推開門的聲音讓兩個醫生同時轉頭。拿骨鋸的那個皺了皺眉——他看起來是人類，但他的口罩下露出了一截紫色的舌頭。血月放下手中的托盤，走向你。「你果然來了。」她嘆了口氣，但語氣中沒有驚訝。「這是第三階段的適應性改造手術。這位患者正在從人類過渡到夜行種族。我們幫她……加速這個過程。」手術台上的「人形」發出了一声低沉的呻吟——那是人類的聲音。',
      },
      {
        text: '後退——這不是你能處理的。（否認，離開）',
        effects: { erosion: 3, awareness: 3 },
        resultText: '你後退了兩步，然後轉身快步離開。身後的門在你跑過走廊的一半時打開了——血月的聲音在走廊中迴盪：「你會回來的。你體內的改變……也需要手術來完成。等你準備好了，地下三層永遠為你敞開。」你衝上樓梯，回到一樓大廳。消毒水的氣味突然讓你感到噁心。',
      },
    ],
    effects: { erosion: 8, setFlag: 'basement_discovered', setDiscovery: 'adaptation_surgery' },
  },

  // --- 21. 裁缝店后室 ---
  {
    id: 'tailor_backroom',
    sceneId: 'tailor_shop',
    title: '蜘蛛的絲線',
    structure: 'switch_route',
    conditions: { minErosion: 30, minAwareness: 20, hasItem: ['silk_thread'] },
    narrative: {
      residentSegments: [
        '裁縫店的門鈴響起時，老裁縫正在整理一批新到的絲綢面料。看到你進來，他微笑著點了點頭。',
        '「啊，你來了。我正想著你呢。」他放下手中的面料，示意你跟他到後室。「上次量好的衣服做好了——但我覺得需要再確認一下。」',
        '後室比你印象中的大得多。牆上掛滿了各種半成品的衣服——有些的設計很奇怪，後背有開口，或者袖子特別長。',
        '工作台上放著一件深藍色的外套，看起來很普通。但你注意到——這件外套的內襯是白色的絲綢，在燈光下泛著若有若無的銀光。',
      ],
      truthSegments: [
        '你靠近那件外套時，你口袋裡的蜘蛛絲開始發熱。你掏出絲線——它在你的掌心微微顫動，像是活的一樣。',
        '老裁縫看到絲線，表情變了。「你從哪裡得到這個的？」他的聲音比平時低沉。',
        '他伸出手——他的手指上，你才注意到，有細小的絨毛。不是人類的汗毛——是像蜘蛛腿上的那種感覺毛。',
        '當他觸碰到絲線的瞬間，牆上掛著的幾件衣服開始蠕動。那些「衣服」——它們不是衣服，它們是正在成形的什麼東西——昆蟲和人類的混合體，包裹在絲綢之中。',
      ],
    },
    choices: [
      {
        text: '「這絲線是阿拉克涅給我的。」（信任路線——揭示身份）',
        effects: { erosion: 5, awareness: 8, affinity: { characterId: 'doll_shop_owner', change: 10 }, setFlag: 'arachne_revealed' },
        resultText: '老裁縫沉默了很久。然後他做了一件你沒想到的事——他脫下了他的外套。在他的後背上，有八條細長的、覆蓋著黑色絨毛的蜘蛛腿從肩胛骨的位置伸展出來。他的身體——他的下半身變成了巨大的蜘蛛腹部，覆蓋著深紫色的幾何花紋。「我也和其他人一樣。」他的聲音此時變得更低沉、更老，像是另一個人——或者說，另一種生物。「我不是人類。我來自地下深處……我是阿拉克涅一族最後的倖存者。」',
      },
      {
        text: '「這到底是怎麼回事？」——謹慎應對。（謹慎路線）',
        effects: { erosion: 3, awareness: 5, setFlag: 'arachne_cautious' },
        resultText: '老裁縫沒有立即回答。他把絲線還給你，然後走回工作台。「外面那件外套……它是用我的絲線織成的。穿上的話，可以抑制正在發生的變化——暫時的。」他看著你，「我幫過很多人。但也有人選擇不接受幫助——他們選擇擁抱自己的新身體。你也要做出選擇。」',
      },
    ],
    effects: { setFlag: 'tailor_backroom_visited', setDiscovery: 'arachne_reality' },
  },

  // ===== 22-23. 渐进确认型 / 简单分支型 =====

  // --- 22. 末班地铁 ---
  {
    id: 'subway_last_train',
    sceneId: 'subway_station',
    title: '孕婦專席',
    structure: 'confirming_choice',
    conditions: { dayPhase: ['night'], minErosion: 30, hasItem: ['pregnancy_charm'] },
    narrative: {
      residentSegments: [
        '末班地鐵的站台上幾乎沒有人。你等車的時候，注意到對面的長椅上坐著一個年輕女性。',
        '她的腹部明顯隆起——懷孕六到七個月的樣子。她低著頭，雙手輕輕撫摸著肚子，嘴角帶著溫柔的微笑。',
        '你下意識地摸了摸口袋裡的咒文紙條——從上次撿到它之後，你一直沒有扔掉。紙條在你手中微微發熱。',
        '列車進站了。那位孕婦站起來，走向車門。你不知不覺地跟在她身後上了同一節車廂。',
      ],
      truthSegments: [
        '車廂內的燈光忽明忽暗。你坐在孕婦的對面，偷偷觀察她。',
        '在燈光暗下的瞬間——你看到了。她的腹部表面，透過衣服，浮現出淡淡的發光紋路。那些紋路和咒文紙條上的文字一模一樣。',
        '她抬起頭，直直地看向你。她的眼睛——在一瞬間，你的口袋裡的紙條猛地發燙。她微笑了，那是一種你知道你不該看到的笑容。',
        '「你也有那張紙條吧？」她的聲音直接在你的腦中響起。「沒關係……很快就會輪到你了。」她低下頭，繼續撫摸著肚子。你看到她的腹部——在衣服下面——有什麼東西在移動，不是胎動——那是符文在運轉。',
      ],
    },
    choices: [
      {
        text: '質問她——「那是什麼？」（確認，追問真相）',
        effects: { erosion: 6, awareness: 10, setFlag: 'confronted_pregnant_woman' },
        resultText: '你站起來，走到她面前。她沒有抬頭，但她輕聲說：「這不是真正的懷孕……這是常識改變的載體。」她拉開外套的下擺——她的腹部表面覆蓋著密密麻麻的符文，皮膚是半透明的，能看到內部流動的光。「每個『孕婦』都是一個擴散站。我們把新的常識……散播到空氣中。像花粉一樣。」她的話讓你的胃一陣翻湧。',
      },
      {
        text: '什麼也不做——在下一站下車。（否認）',
        effects: { erosion: 3, awareness: 4 },
        resultText: '列車在下一站停下，你快步走出車廂。在車門關閉的瞬間，你回頭看了一眼——車廂裡，那位孕婦站了起來，她的肚子……在發光。透過車窗，你看到車廂中的其他乘客都轉頭看向她，臉上帶著同樣的、安詳的微笑。列車駛入隧道，消失在黑暗中。',
      },
    ],
    effects: { erosion: 5, setFlag: 'pregnancy_magic_encountered', setDiscovery: 'reality_seed' },
  },

  // --- 23. 花店夜话 ---
  {
    id: 'flower_shop_night',
    sceneId: 'flower_shop',
    title: '花音的告白',
    structure: 'simple_branch',
    conditions: { dayPhase: ['night'], minErosion: 30, minAwareness: 25 },
    narrative: {
      residentSegments: [
        '花店已經打烊了，但透過玻璃門，你看到裡面還有燈光。你正準備離開時，門從裡面打開了。',
        '花音站在門口，披著一件薄外套。「你來了……」她的語氣有些疲憊，但帶著一絲欣慰。「我一直在等你。」',
        '她側身讓你進店。店裡的花都已經收起來了，空氣中依然瀰漫著混合的花香。',
        '她帶你走到店鋪後面的小院——這裡有一張桌子，上面擺著兩杯茶，還冒著熱氣。她早就知道你會來。',
      ],
      truthSegments: [
        '月光下，花音坐在你對面。她端起茶杯，沒有喝——只是讓蒸氣拂過臉頰。',
        '在銀色的月光中，你看到了她真實的樣子——她的頭髮裡，有細小的綠色藤蔓在輕輕蠕動，像是有生命一樣。她的皮膚在月光下泛著淡淡的螢光。',
        '「我是從一顆種子開始的……」她輕聲說，像是自言自語。「很多年前——或者說，在常識改變之前——我是一株普通的植物。然後……有人給了我一份『禮物』。一個靈魂。」',
        '她看著你，眼睛在月光下閃爍。「每一株花都有意識。但我們不能說話……直到有人給我們聲音。現在，我在給其他花……同樣的禮物。」',
      ],
    },
    choices: [
      {
        text: '「你是說……那些花也會變成和你一樣的存在？」',
        effects: { erosion: 4, awareness: 6, affinity: { characterId: 'alraune_florist', change: 10 } },
        resultText: '花音輕輕點頭。她站起來，走到院子角落的一盆含苞待放的花前。她輕輕碰了碰花瓣——那朵花在她的觸碰下緩慢地綻放了。從花蕊中，露出了一張微小的、人類嬰兒般的面孔——它是活的。「每一個生命都值得擁有意識……即使它們最初只是一株植物。」她的聲音充滿了慈愛。',
      },
      {
        text: '「花音……你自己想要什麼？」',
        effects: { erosion: 2, awareness: 3, affinity: { characterId: 'alraune_florist', change: 15 } },
        resultText: '這個問題讓她愣住了。她沉默了很久，然後低下頭。「我……想要的東西很簡單。我想要能夠站在陽光下而不被發現。想要能夠和人類說話而不被害怕。想要……不再孤單。」她抬起頭，眼角有淚光——但那淚水在月光下閃爍著金色的光。「你能……偶爾來陪我說說話嗎？就只是說說話。這樣就夠了。」',
      },
    ],
    effects: { setFlag: 'flower_shop_confession', setDiscovery: 'alraune_sentience' },
  },

  // ===== 24-25. 计分选择型 / 身份改写型 =====

  // --- 24. 神社祭典 ---
  {
    id: 'shrine_festival',
    sceneId: 'shrine',
    title: '狐妖的幻境',
    structure: 'scoring',
    conditions: { dayPhase: ['night'], minErosion: 40, minAwareness: 30 },
    narrative: {
      residentSegments: [
        '神社今晚正在舉行例行的祭典。參道上掛滿了燈籠，溫暖的燈光照亮了石階。',
        '攤位沿著參道兩旁排開——撈金魚、炒麵麵包、蘋果糖——充滿了節日的歡樂氣氛。',
        '人群熙熙攘攘，穿著浴衣的年輕男女在攤位間穿梭。空氣中彌漫著烤肉的香氣和人们的笑語。',
        '你在人群中看到了狐鈴——她穿著正式的巫女服，站在一個特殊的攤位後面。那個攤位沒有招牌，桌上只放了一面鏡子和一疊簽紙。',
      ],
      truthSegments: [
        '你走近攤位時，周圍的喧囂聲突然變得遙遠了。燈籠的光變成了幽藍色——你才發現，你走進了一個結界。',
        '狐鈴抬起頭，她的狐耳完全露在外面——毛茸茸的、金色的耳朵在燈光下微微抖動。她的身後，一條蓬鬆的尾巴——不，不是一條——至少有四條尾巴在輕輕搖擺。',
        '「歡迎來到我的小小幻境。」她的聲音和平時不同——帶著一種古老而神秘的回音。「在我這裡，你可以看到——如果你選擇了不同的道路，你會變成什麼樣子。」',
        '她指了指桌上的鏡子。鏡面不是反射——裡面流動著銀色的霧氣。霧氣中浮現出模糊的人影。',
      ],
    },
    choices: [
      {
        text: '看向鏡子——你想知道自己的未來。（+3知性）',
        effects: { awareness: 3, affinity: { characterId: 'kitsune_miko', change: 5 } },
        resultText: '你看向鏡面。霧氣散開——你看到了一個人影。最初，那個人看起來像你。然後，它的耳朵變尖了，頭髮變成了銀白色，眼中閃爍著金色的光芒。它的背後展開了純白的翅膀——不是狐妖——是某種更古老的東西。鏡中的「你」對你微笑，那笑容中充滿了智慧和悲憫。你不知道那是預言還是可能性。',
      },
      {
        text: '「這些攤位……是真的嗎？」（質疑幻境，+2侵蝕）',
        effects: { erosion: 2, affinity: { characterId: 'kitsune_miko', change: 10 } },
        resultText: '狐鈴笑了——那是一串銀鈴般的笑聲。「你的敏銳度很高。」她打了個響指——周圍的攤位和人群在一瞬間變成了半透明的幻影。你看到那些「攤主」的真實面貌——他們是狐妖的式神——紙紮的人形，在燈光下跳著沒有生命的舞蹈。「這些都是我用妖力維持的幻覺。但……食物是真的哦。」她遞給你一個蘋果糖——你接過時，它散發著真實的香氣和溫度。',
      },
      {
        text: '伸出手觸碰鏡面。（大膽行動，+5侵蝕，+5知性）',
        effects: { erosion: 5, awareness: 5, setFlag: 'touched_fortune_mirror' },
        resultText: '你的指尖碰到鏡面的瞬間，一股強大的力量將你拉入了鏡中。你感覺自己在下墜——穿過了霧氣和光——然後你站在了一片無邊無際的草原上。天空中有兩個月亮。遠處有一座城市——但你見過那座城市。那是——某個版本的——你的城市。在那裡，怪物娘和人類和平共處。常識改變已經完成了。你是那城市中的一員——你的手背上浮現著銀色的鱗片。',
      },
    ],
    effects: { erosion: 3, setFlag: 'shrine_festival_visited', setDiscovery: 'kitsune_illusion' },
    badEndCheck: { condition: '如果侵蝕率在神社祭壇區域達到70', erosionThreshold: 70, description: '你的存在被神社的結界識別為「需要淨化的異物」。狐鈴的表情變得冷漠——她舉起手中的神樂鈴，鈴聲在你的耳中變成了尖銳的嘯叫。你的視野開始扭曲——你感到自己的身體正在被分解成基本粒子。最後聽到的聲音是狐鈴的低語：「抱歉……但規則就是規則。」' },
  },

  // --- 25. 玩具店的玩偶 ---
  {
    id: 'toy_shop_dolls',
    sceneId: 'shopping_street',
    title: '活人偶之家',
    structure: 'identity_shift',
    conditions: { dayPhase: ['afternoon'], minErosion: 35, minAwareness: 25 },
    narrative: {
      residentSegments: [
        '商店街深處有一家你以前從未注意過的玩具店。櫥窗裡擺滿了精美的人偶——穿著維多利亞時代的服裝，關節是可活動的球形關節。',
        '店門口的風鈴發出清脆的響聲。你推門走進去——店內的光線柔和而溫暖，空氣中有蠟和木頭的香氣。',
        '櫃檯後面站著一個女人——她正在給一個人偶穿上和服。她的動作極其輕柔精準，像是在照顧一個真正的孩子。',
        '她抬頭看到你，微笑著放下人偶。「歡迎光臨……你終於來了。我一直在等你。」',
      ],
      truthSegments: [
        '店內的人偶——當你的視線掃過它們時，你有種強烈的感覺：它們在看你。每一雙玻璃眼珠都追隨著你的動作。',
        '你走近一個穿著紅色和服的人偶——它的臉部做工太精細了。皮膚的質感……那不是瓷器的質感。那是——皮膚的質感。',
        '人偶的嘴微微張開——你看到裡面有牙齒。真正的、人類的牙齒。',
        '店主不知何時已經站在你身後。她的聲音在你耳邊響起：「很美吧？每一個都是我親手做的——從零開始。從……原材料開始。」她的語氣中有一種令人不安的驕傲。',
      ],
    },
    choices: [
      {
        text: '「這些不是人偶——它們是真人？」（揭穿真相）',
        effects: { erosion: 8, awareness: 10, setFlag: 'dolls_truth_revealed' },
        resultText: '店主的表情沒有變化——她的微笑甚至加深了。「你真的很敏銳。」她走到那個人偶旁邊，輕輕撫摸它的頭髮。「它們曾經是人——那些被常識改變抹去了存在的人。沒有人記得他們了……所以我給了他們新的身體。讓他們繼續『存在』。」她轉頭看著你，眼中閃爍著非人的光芒。「你想要一個不會被遺忘的身體嗎？」',
      },
      {
        text: '「你到底是什麼？」（質問店主）',
        effects: { erosion: 5, awareness: 5, affinity: { characterId: 'doll_shop_owner', change: 5 } },
        resultText: '她輕輕笑了笑，解開了手腕上的絲帶——在絲帶下方的皮膚上，有一排整齊的縫線。她的手腕——是被人縫合過的。「我也曾經是人類。但有人——比我更早的存在——給了我這副身體。永生的人偶之軀。我感覺不到疼痛、不會老化、不會被常識改變影響。」她凝視著自己的雙手。「但我也忘記了……眼淚的溫度。」',
      },
    ],
    effects: { erosion: 6, setFlag: 'doll_shop_visited', setDiscovery: 'living_dolls' },
  },

  // ===== 26-27. 交换路线型 / 简单分支型 =====

  // --- 26. 咖啡厅的日常 ---
  {
    id: 'cafe_transformation',
    sceneId: 'cafe',
    title: '女僕的契約',
    structure: 'switch_route',
    conditions: { dayPhase: ['afternoon'], minErosion: 30, minAwareness: 20 },
    narrative: {
      residentSegments: [
        '午後的咖啡廳客人不多。你選了靠窗的位置坐下，陽光透過落地窗灑在木質桌面上。',
        '為你服務的是一位穿著女僕裝的年輕女服務生——她胸前的名牌上寫著「小夜」。她把菜單遞給你，微笑著等待你的點單。',
        '你注意到她的微笑很標準——標準到幾乎是教科書級別的服務笑容。但她的眼神中有一種……疲倦？或者說，疏離感。',
        '當她轉身走向櫃檯時，你的目光不經意地落在她後頸上——那裡有一個小小的刺青。不——看起來像是烙印。一個圓形的、複雜的圖案。',
      ],
      truthSegments: [
        '你藉口去洗手間，經過了櫃檯附近。店內還有另一個女服務生——她和你的目光接觸時，迅速低下了頭。她的脖子上也有一個同樣的烙印。',
        '在櫃檯後面的牆上，掛著一幅裝裱好的文書——看起來像是契約書。文字是用你不認識的語言寫的，但簽名欄上密密麻麻地按滿了手印。',
        '當你回到座位時，小夜端著你的咖啡過來。她放下杯子時，低聲說了一句——「你的飲料裡我沒有加任何東西。放心喝吧。」',
        '她的話讓你脊背發涼。「加東西」——這是什麼意思？',
      ],
    },
    choices: [
      {
        text: '問她烙印的事——「那是什麼？」（直接路線）',
        effects: { erosion: 5, awareness: 8, setFlag: 'cafe_brand_asked' },
        resultText: '小夜的表情僵硬了一下。她下意識地摸了摸後頸，然後迅速恢復了服務笑容。「那是……我們店的員工標誌。每一個在這裡工作的人都有的。」她的聲音平穩——但她的手指在發抖。「你想續杯嗎？」很明顯，她在逃避話題。但你已經看到了她眼中的恐懼。',
      },
      {
        text: '假裝沒注意到——先觀察情況。（謹慎路線）',
        effects: { erosion: 2, awareness: 4, setFlag: 'cafe_observation' },
        resultText: '你安靜地喝完咖啡，在離開時又看了一眼那幅契約書。在你走近時——那幅契約書上的文字在你眼前變化了。變成了你能理解的語言。上面寫著：「靈魂服務契約——簽約者自願將剩餘壽命轉移至……」。後面的文字模糊了。你感覺到有人在你身後——小夜站在不遠處，靜靜地看著你。她微微搖了搖頭。不要問。',
      },
    ],
    effects: { setFlag: 'cafe_contract_found', setDiscovery: 'soul_contract' },
  },

  // --- 27. 市政厅觐见 ---
  {
    id: 'city_hall_audience',
    sceneId: 'city_hall',
    title: '龍之吐息',
    structure: 'simple_branch',
    conditions: { dayPhase: ['morning'], minErosion: 50, minAwareness: 40 },
    narrative: {
      residentSegments: [
        '市政廳的大廳今天格外繁忙。工作人員在櫃檯後忙碌地處理各種文件，市民在等候區排隊。',
        '你走向三樓——市長辦公室所在的樓層。樓梯的牆上掛著歷任市長的肖像，越往高處走，畫像中的面孔越顯得……非人。',
        '三樓的走廊很安靜，鋪著深紅色的地毯。走廊盡頭是一扇高大的木門，上面雕刻著龍的圖案。',
        '你還沒敲門，門就從裡面打開了。一位身著職業套裝的女性站在門口——她大約三十出頭，一頭黑色長髮束成馬尾，戴著金邊眼鏡。她的氣場強大到讓人不敢直視。',
      ],
      truthSegments: [
        '當你走進辦公室時，你聞到了一股淡淡的硫磺味。辦公室的窗戶外面——外面的景色不對。從這裡看到的城市，天空是暗紫色的，建築物之間有巨大的龍影在盤旋。',
        '市長——她坐在辦公桌後面，沒有抬頭，正在批閱文件。從你這個角度，你能看到她垂在椅背後面的東西——那是一條覆蓋著黑色鱗片的尾巴，末端是鋒利的骨刺。',
        '她放下筆，抬起頭。她的眼睛——金色的豎瞳，在鏡片後直視著你。她微笑時，你看到了她口中過於尖銳的犬齒。',
        '「你終於走到了這裡。」她的聲音低沈而威嚴，帶著一種不屬於人類的共鳴。「我是龍映——這座城市的真正的管理者。」',
      ],
    },
    choices: [
      {
        text: '「真正的管理者？市長呢？」（質問）',
        effects: { erosion: 5, awareness: 8, setFlag: 'dragon_mayor_confronted' },
        resultText: '龍映輕輕笑了——她的笑聲讓辦公室的窗戶微微震動。「我就是市長。或者說，我已經擔任市長很多年了——只是每一次連任時，我都換了一張臉。人類的壽命太短了，總是需要新的身份。」她站起來，走到窗前。外面的紫色天空映在她的眼中。「但這座城市需要我。沒有我的力量，常識改變會在一天之內崩潰——然後所有人都會瘋掉。」',
      },
      {
        text: '「我想知道真相——關於常識改變的所有真相。」（要求真相）',
        effects: { erosion: 8, awareness: 12, setFlag: 'demanded_full_truth' },
        resultText: '龍映沉默了許久。然後她做了一件出乎你意料的事——她從抽屜裡取出一個檔案夾，放在桌上。「這是我能告訴你的全部。」你翻開檔案——裡面記錄著常識改變的起源。不是意外——是計劃。一場由非人種族主導的、歷時數十年的計劃。你的名字——也在檔案中——「觀察對象#0047——潛在適應者」。你從頭到尾都被監視著。',
      },
    ],
    effects: { erosion: 6, setFlag: 'mayor_audience_complete', setDiscovery: 'dragon_ruler' },
  },

  // ===== 28-29. 可重入对话型 / BAD END检查型 =====

  // --- 28. 教堂钟声 ---
  {
    id: 'church_bell',
    sceneId: 'church',
    title: '天使的鈴聲',
    structure: 'reentrant',
    conditions: { minErosion: 50, minAwareness: 35 },
    narrative: {
      residentSegments: [
        '教堂的鐘樓在午後三點敲響了鐘聲。你站在教堂的大門前，猶豫著要不要進去。',
        '門是開著的。彩色玻璃窗透入柔和的光線，在地面上投下斑駁的色彩。',
        '教堂內部異常安靜——沒有任何信徒在祈禱。只有神父站在祭壇前，背對著你。',
        '「進來了就坐吧。」他沒有回頭，但他的聲音在空曠的教堂中迴盪。他的聲音很奇怪——那不是老年人的聲音。那是一個人年輕的、清澈的聲音。',
      ],
      truthSegments: [
        '你走到前排坐下。神父轉過身——他不是你在外面看到的那個老人。他是一個年輕人，大概只有二十多歲，穿著白色的長袍。',
        '他的背後——在彩色玻璃窗透入的光線中——你能看到模糊的輪廓。那不是光線的效果。那是——翅膀。三對潔白的翅膀，收攏在他的背後。',
        '「我是加百列。」他平靜地說——他的名字讓你呼吸一滯。「不是聖經中的那位——我只是……一個觀察者。」',
        '他的眼睛是純白色的——沒有瞳孔。當他眨眼時，你看到他的眼瞼是橫向開合的——像鳥類一樣。',
      ],
    },
    choices: [
      {
        text: '「天使……也是常識改變的一部分嗎？」（每次可選，可重複）',
        effects: { awareness: 4, setFlag: 'angel_question_asked' },
        resultText: '加百列輕輕搖了搖頭。「天使不是常識改變的結果——我們是原因之一。」他抬起手，掌心浮現出一個發光的幾何圖案。「在你們的神經系統中，有一種接收器——它能接收我們發出的『現實訊號』。常識改變就是調整了這個訊號的頻率。讓你們看到的……是我們的世界。」他的話語輕柔，但你聽到了其中的寒意。',
      },
      {
        text: '「你想從我這裡得到什麼？」',
        effects: { erosion: 3, awareness: 3 },
        resultText: '加百列微笑了一下——那是一個悲傷的笑容。「不是我想從你這裡得到什麼——而是你需要在這裡學到什麼。」他轉身看向祭壇上的十字架。「每一個走到我面前的人，都已經站在了選擇的邊緣。你的下一步……將決定你成為什麼。」他的翅膀微微張開，白色的羽毛在空氣中飄落——但那些羽毛在落地之前就消失了。',
      },
    ],
    effects: { setFlag: 'angel_met', setDiscovery: 'divine_observer' },
  },

  // --- 29. 深渊之门 ---
  {
    id: 'abyss_gate',
    sceneId: 'abyss_corridor',
    title: '深淵之門',
    structure: 'bad_end_check',
    conditions: { minErosion: 60, minAwareness: 50 },
    narrative: {
      residentSegments: [
        '深淵回廊的盡頭——你站在一扇巨大的門前。門是用黑色的石頭製成的，表面刻滿了發光的符文。',
        '這裡沒有聲音。沒有風。沒有一切。只有你和這扇門。',
        '你身後的來路已經消失了——你无法後退。',
        '門上的符文在你的注視下開始變化——它們從靜止的刻印變成了流動的文字。那些文字——你能理解它們的含義。它們在問你一個問題。',
      ],
      truthSegments: [
        '「你是誰？」——這是門的第一個問題。不是「你叫什麼名字」——而是真正的「你是誰」。',
        '你想回答——但你發現你不知道答案。你的記憶中有一部分是模糊的。你的名字、你的過去、你來到這裡的原因——都像是隔著一層霧。',
        '門的第二個問題浮現了：「你想成為什麼？」',
        '在這扇門前，所有的偽裝都被剝去了。你能感受到門另一側的力量——那是常識改變的源頭。城市的真相。所有怪物娘的起源。只要推開這扇門，你就能知道一切。',
        '但開門的代價是什麼？',
      ],
    },
    choices: [
      {
        text: '推開門——無論代價是什麼。（擁抱真相）',
        effects: { erosion: 15, awareness: 20, setFlag: 'abyss_gate_opened' },
        resultText: '你的雙手碰到門的瞬間，符文爆發出耀眼的光芒。門緩緩打開——從門縫中湧出的不是光，不是黑暗——是純粹的「信息」。你的腦海被灌入了這座城市千年來的一切——每一滴眼淚、每一次變身、每一個被遺忘的名字。你在這信息洪流中失去了自己——但又找到了自己。當門完全打開時，你站在一個白色的空間中。前方有一個人在等你——那個人長著和你一樣的臉，但她的眼中有星辰在旋轉。',
      },
      {
        text: '「我不需要知道一切。」——後退。（守護自我）',
        effects: { erosion: 5, awareness: 5, setFlag: 'abyss_gate_refused' },
        resultText: '你後退了一步。門上的符文黯淡了一些。一個聲音在你腦中響起——它既不是男聲也不是女聲，它像是從你內心深處發出的：「明智的選擇……或者說，懦弱的選擇。這取決於你如何看待。」你的身後重新出現了來路——深淵回廊再次連通了。但你發現你的手裡多了一樣東西——一片透明的、散發著微光的碎片。這是門的一部分。你把它帶走了。',
      },
    ],
    effects: { erosion: 10, setFlag: 'abyss_gate_encountered', setDiscovery: 'source_of_change' },
    badEndCheck: {
      condition: '如果在深淵之門前侵蝕率達到80並且選擇開門',
      erosionThreshold: 80,
      description: '門打開的瞬間，你的身體承受不住湧入的信息洪流。你的意識在無限的知識中擴散、稀釋——你不再是一個人，你變成了常識改變本身的一部分。你的身體在白色的光芒中分解成光點，融入了城市的每一個角落。你成為了這座城市新的「常識」。但你不再是你了。再也沒有人會記得——曾經有一個人在這扇門前做出了選擇。',
    },
  },

  // ===== 30. 身份改写型 =====

  // --- 30. 记忆碎片 ---
  {
    id: 'memory_fragment',
    sceneId: 'residential_area',
    title: '鏡中的陌生人',
    structure: 'identity_shift',
    conditions: { minErosion: 45, minAwareness: 35, hasItem: ['mirror_hand'] },
    narrative: {
      residentSegments: [
        '你回到住宅區的住處。今天你沒有開燈——你坐在黑暗中，手中握著那面手鏡。',
        '房間很安靜。窗外的路燈透過窗簾的縫隙投下一道橙色的光線，正好照在你手中的鏡子上。',
        '你舉起手鏡，看著鏡中的自己——或者說，你以為那是自己。',
        '鏡中的那張臉確實是你的——但不完全是你記得的樣子。眉眼之間有些陌生的弧度，皮膚的色調也有些不一樣。',
      ],
      truthSegments: [
        '你盯著鏡子看了一分鐘。兩分鐘。五分鐘。',
        '鏡中的你——她的表情變了。是你沒有做出的表情。一個悲傷的、帶著理解的微笑——但你並沒有笑。',
        '鏡中的「你」開口說話了——但你的嘴唇沒有動。她的聲音從鏡中傳來——低沉而溫柔：「你終於看著我了。我等你很久了。」',
        '你的記憶在這一瞬間出現了裂痕——你「記得」你獨自在這個房間裡長大。但鏡中的記憶說——你曾經有一個雙胞胎姐妹。一個在十年前「消失」了的姐妹。不——不是雙胞胎。鏡中的那張臉——那是你真正的樣子。你是透過她的眼睛在看著這個世界。',
      ],
    },
    choices: [
      {
        text: '「你是誰？為什麼在我的鏡子裡？」（質問）',
        effects: { erosion: 8, awareness: 10, setFlag: 'mirror_self_confronted' },
        resultText: '鏡中的你嘆了口氣。「我沒有在你的鏡子裡——是你在我的世界裡。」她伸出手——從鏡面中穿過。她的手指碰到了你的臉頰。冰涼的——那是比你體溫低很多的溫度。「十年前，當常識改變第一次覆蓋這座城市時——我們被分開了。你留在了『常識』的那一側。我被困在了『真實』的這一側。」你的眼淚不受控制地流下來——但你不知道為什麼哭。',
      },
      {
        text: '觸碰鏡面——你想要靠近她。（接受）',
        effects: { erosion: 12, awareness: 12, setFlag: 'touched_mirror_self', transform: 'identity_merge' },
        resultText: '你的指尖碰到鏡面的瞬間，鏡面像水面一樣泛起了漣漪。你的手穿過了鏡子——另一隻手從鏡中握住了你。她的手——和你的一樣——但更冷。她把你拉向鏡子——你沒有抵抗。你穿過了鏡面，進入了另一個世界。當你回頭看時——你看到鏡子那側的房間裡，有一個和你一模一樣的人坐在黑暗中。但她——不，是你——在微笑著。你們交換了位置。從現在開始，你是鏡中的人。她是現實中的人。或者說——沒有區別了。你們本來就是同一個人。',
      },
    ],
    effects: { erosion: 10, setFlag: 'memory_fragment_resolved', setDiscovery: 'split_self' },
  },
];

export default events;
