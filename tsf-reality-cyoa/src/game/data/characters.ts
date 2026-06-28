// ===== 角色定义 - 常識改変TSF × Monster Girl =====
// 每个角色包含「居民视角」和「真实视角」的双重感知数据

export type CharacterType = 'resident' | 'monster_girl' | 'key_npc' | 'transformed';

export interface DialogueEntry {
  text: string;
  condition?: {
    minErosion?: number;
    maxErosion?: number;
    minAwareness?: number;
    hasItem?: string;
    completedEvent?: string;
    dayPhase?: string;
  };
}

export interface PerceptionView {
  description: string;
  appearance: string;
  dialogue: DialogueEntry[];
  attitude: string;
}

export interface TruthView {
  description: string;
  appearance: string;
  internalThought: string[];
  contradiction: string;
}

export interface AffinityConfig {
  maxLevel: number;
  unlockThresholds: number[];
  levelRewards: {
    level: number;
    rewardType: 'info' | 'item' | 'event' | 'transformation' | 'memory';
    rewardId: string;
    description: string;
  }[];
}

export interface ScheduleEntry {
  dayPhase: 'morning' | 'afternoon' | 'evening' | 'night';
  location: string;
  action: string;
  specialCondition?: string;
}

export interface Character {
  id: string;
  nameCN: string;
  location: string;
  schedule: ScheduleEntry[];
  type: CharacterType;
  perception: {
    residentView: PerceptionView;
    truthView: TruthView;
  };
  affinity: AffinityConfig;
  dialogueStages: {
    stage: number;
    condition: { minAffinity?: number; minErosion?: number; completedEvent?: string };
    unlockDialogue: string[];
  }[];
  transformation?: {
    type: string;
    revealCondition: string;
    revealDescription: string;
  };
  isRevealed?: boolean;
}

export const characters: Character[] = [

  // ==================== 史莱姆娘 - 便利店店员 ====================
  {
    id: 'slime_girl',
    nameCN: '小翠',
    location: 'convenience_store',
    schedule: [
      { dayPhase: 'morning', location: 'convenience_store', action: '整理货架、接收早间配送货物' },
      { dayPhase: 'afternoon', location: 'convenience_store', action: '在收银台值班' },
      { dayPhase: 'evening', location: 'convenience_store', action: '补货、清洁店面' },
      { dayPhase: 'night', location: 'residential_area', action: '下班回家休息' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '在便利店打工的年轻女孩，看起来二十出头，扎着利落的单马尾。' +
          '性格开朗活泼，对每位顾客都笑脸相迎，记得常客的购物偏好。' +
          '工作认真负责，店长对她评价很高。',
        appearance:
          '身高约160cm，偏瘦，肤色白皙。穿着一件绿色的便利店围裙，' +
          '里面是白色T恤和牛仔裤。眼睛很大，瞳孔是普通的棕色。' +
          '笑起来时有两个浅浅的酒窝。',
        dialogue: [
          { text: '欢迎光临！今天盒饭有特价哦，買两个打八折！' },
          { text: '诶，你经常来呢。还是老样子——咖啡和饭团？' },
          { text: '嗯……今天有点累，站了一整天腰都酸了……嘻嘻，没事！' },
          { text: '店长说明天要盘点库存，好麻烦啊～不过没办法啦。' },
          { text: '你最近是不是瘦了？要好好吃饭啊！' },
          { text: '这个天气真是……我又快「融化」了……啊不是，我是说太热了！' },
        ],
        attitude: '友善、热情，把玩家当作熟客对待。偶尔会说一些奇怪的话但马上圆回来。',
      },
      truthView: {
        description:
          '小翠是一只史莱姆娘——她的身体本质上是半透明的胶状物质。' +
          '她的人类形态是通过「常识改变」获得的拟态外表，' +
          '在情绪激动或疲惫时，她的身体会部分液化，变得半透明。' +
          '她总是穿绿色围裙的深层原因是——绿色和她本体颜色最接近，' +
          '如果发生意外液化，绿色的混合能降低视觉冲击。',
        appearance:
          '在真实视野下，她的皮肤呈现出微微的半透明质感，' +
          '能看到淡绿色的胶状物质在皮肤下缓缓流动。' +
          '她的「头发」实际上是伸长的身体组织，末端有时会滴落透明的液体。' +
          '当她眨眼时，你偶尔能看到她眼睑后方纯粹由胶质构成的内部结构。' +
          '她的瞳孔确实是棕色——但那是一颗悬浮在胶质中的色素球。',
        internalThought: [
          '（这人……他看我的眼神不太一样。他是不是能看到？）',
          '（今天身体的稳定性好差……千万不能在他面前变形……）',
          '（好想泡在冰水里休息一下……维持这个形态真的好累……）',
          '（联盟说过不能让普通人发现真相……但我好想告诉他我有多累……）',
          '（他昨天買了一瓶水，今天又來了……不是因為我調製了特殊的飲料吧？）',
        ],
        contradiction:
          '她说的「快融化了」——居民以为她在抱怨天气热，但实际上是字面意思。' +
          '她的身体在高温下会变得不稳定，出现部分液化。' +
          '她总是站在收银台后面从不走出来的原因——下半身可能没有完全成形。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 20, 40, 60, 80],
      levelRewards: [
        { level: 1, rewardType: 'info', rewardId: 'slime_secret_1', description: '得知史莱姆娘的基本信息' },
        { level: 2, rewardType: 'item', rewardId: 'slime_gel_sample', description: '获得史莱姆凝胶样本（可用于制药）' },
        { level: 3, rewardType: 'event', rewardId: 'slime_reveal', description: '触发小翠的真身暴露事件' },
        { level: 4, rewardType: 'info', rewardId: 'slime_alliance_info', description: '获得关于怪物娘联盟的情报' },
        { level: 5, rewardType: 'transformation', rewardId: 'slime_transform', description: '获得史莱姆化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['欢迎光临！今天盒饭有特价哦！'],
      },
      {
        stage: 2, condition: { minAffinity: 20 },
        unlockDialogue: ['你總是這個時候來呢……嘻嘻，我記住你了。', '你最近是不是瘦了？要好好吃飯啊！'],
      },
      {
        stage: 3, condition: { minAffinity: 40, minErosion: 15 },
        unlockDialogue: [
          '你……你相信這個世界上有「非人類」嗎？開玩笑的啦哈哈哈哈……',
          '其實我一直覺得你和普通人不太一樣，你有沒有發現自己……怎麼說……變了？',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 60, minErosion: 25, completedEvent: 'slime_reveal' },
        unlockDialogue: [
          '既然你都知道了……我就不裝了。對，我是史萊姆。別告訴別人好嗎？',
          '維持人形好累……但我喜歡這份工作，喜歡和人類打交道。',
          '這座城市有秘密，很大的秘密。你想知道的話……我可以告訴你一些事情。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 80, minErosion: 40 },
        unlockDialogue: [
          '你身上的「常識改変」也在影響你……你沒發現嗎？',
          '如果你願意的話……我可以幫你適應這個變化。畢竟，我也經歷過。',
        ],
      },
    ],
    transformation: {
      type: 'Slime',
      revealCondition: '在小翠面前使用調查筆記或直接詢問她的真實身份（好感度≥40）',
      revealDescription:
        '小翠的身體突然開始劇烈顫抖，她的皮膚像是融化的蠟一樣向下流淌。' +
        '在幾秒鐘之內，她的外表完全瓦解——攤在地上的一大坨半透明的綠色黏液。' +
        '黏液的中心有一團更濃稠的核，散發著淡綠色的螢光。' +
        '她用黏液震動的方式發出聲音：「嚇……嚇到你了吧？這就是真正的我。」' +
        '然後那些黏液重新凝聚，在幾秒內再次構築出人類的形體。' +
        '恢復後的小翠臉色微紅（但那可能是膠質的顏色），不好意思地低下頭。',
    },
  },

  // ==================== 山田老师 - 性别反转教师 ====================
  {
    id: 'yamada_teacher',
    nameCN: '山田老师',
    location: 'school',
    schedule: [
      { dayPhase: 'morning', location: 'school', action: '上課' },
      { dayPhase: 'afternoon', location: 'school', action: '在辦公室批改作業' },
      { dayPhase: 'evening', location: 'library', action: '去圖書館查資料' },
      { dayPhase: 'night', location: 'residential_area', action: '回家' },
    ],
    type: 'transformed',
    perception: {
      residentView: {
        description:
          '學校的國文老師，一位溫和有禮的女性教師。' +
          '教學認真負責，深受學生喜愛。大約三十出頭，' +
          '穿著得體的套裝，戴著一副金邊眼鏡。' +
          '說話語氣溫柔但偶爾會有一瞬間的違和感——' +
          '比如會用男性的自稱「俺（おれ）」，然後立刻改口。',
        appearance:
          '身高約168cm，黑色長髮在腦後束成低馬尾。' +
          '五官端正，皮膚保養得很好。戴著金邊眼鏡，鏡片後的眼睛是深褐色的。' +
          '身材勻稱，常穿米色西裝外套配深色長裙。' +
          '左手無名指上戴著一枚樸素的婚戒。',
        dialogue: [
          { text: '同學們，翻開課本第47頁……今天我們來講解這首詩。' },
          { text: '……呃，抱歉。老師剛才走神了一下。我們上到哪了？' },
          { text: '放學後不要在外面逗留太久，最近天黑得早。' },
          { text: '你的作文我看了，感情很真摯……讓我想起了一些事情。' },
          { text: '有時候我早上醒來，會有一瞬間不記得自己是誰……啊，沒什麼，沒睡好而已。' },
        ],
        attitude: '溫和專業的教師，但偶爾會露出迷茫和困惑的神情。對玩家（作為學生或訪客）關切但保持適當距離。',
      },
      truthView: {
        description:
          '山田老師原本是一名男性——他是最早受到「常識改變」影響的人之一。' +
          '在某一天，他的性別歷史被改寫了。所有人都記得他一直是女性教師，' +
          '包括他自己——但在他記憶的深處，還有一些無法消除的男性記憶碎片。' +
          '他每天早上醒來，都要花幾秒鐘確認自己的身體。' +
          '這種靈魂和身體不匹配的感覺讓他痛苦，但他無法向任何人傾訴——' +
          '因為「常識」告訴他，他本來就是女人。',
        appearance:
          '真實視野下，你能看到他身上殘留的「改寫痕跡」。' +
          '金邊眼鏡的鏡片上偶爾會閃過一串數據代碼。' +
          '他的喉嚨處有一道淡淡的、幾乎看不見的光痕——' +
          '那是聲帶被修改的痕跡，他的聲音從男低音變成了女中音。' +
          '左手的婚戒——照片裡的人是他還是她？那張照片上的面孔在你眨眼之間改變了性別。',
        internalThought: [
          '（……我到底是誰？我記得我……不，那些記憶都是錯的……嗎？）',
          '（早上的時候摸到自己的身體還是會嚇一跳……頭髮，胸部，這不是我的……）',
          '（那個學生看我的眼神……他是不是知道什麼？還是我想多了？）',
          '（昨天回到家，看到鏡子裡的我，我叫出了聲。這不是我的臉……但它是我的臉。）',
          '（如果這一切都是假的——我的職業、我的婚姻、我的人生——那真正的我是誰？）',
        ],
        contradiction:
          '他偶爾會使用男性的自稱「俺」，然後迅速改口，像是不小心說溜嘴。' +
          '他的簽名——筆跡分析顯示名字最後一筆有用力拖曳的痕跡，像是簽了一個不屬於自己的名字。' +
          '辦公室抽屜深處藏著一張舊的男性駕駛證，照片上的人和他長得一模一樣——但性別欄寫著「男」。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 15, 35, 55, 75],
      levelRewards: [
        { level: 1, rewardType: 'info', rewardId: 'gender_shift_hint', description: '得知性別改寫的存在' },
        { level: 2, rewardType: 'event', rewardId: 'yamada_confession', description: '觸發山田老師的第一次坦白' },
        { level: 3, rewardType: 'item', rewardId: 'old_photo_yamada', description: '獲得山田老師的舊照片（證據）' },
        { level: 4, rewardType: 'info', rewardId: 'memory_fragment', description: '獲得關於常識改寫機制的記憶碎片' },
        { level: 5, rewardType: 'event', rewardId: 'yamada_awakening', description: '觸發山田老師的覺醒事件' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['你好，有什麼事嗎？如果是課業上的問題，我很樂意幫忙。'],
      },
      {
        stage: 2, condition: { minAffinity: 15 },
        unlockDialogue: ['你……你最近有沒有一種感覺，就是世界好像哪裏不對勁？', '不，不要在意我說的話……可能是最近太累了。'],
      },
      {
        stage: 3, condition: { minAffinity: 35, minErosion: 20 },
        unlockDialogue: [
          '我要告訴你一件事……你可能不會相信，但我……我腦子裡有兩個人的記憶。',
          '一個是「山田老師」，女，國文教師。另一個是「山田健一」，男，三十五歲……',
          '我不知道哪個才是真正的我。或者……兩個都是。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 55, completedEvent: 'yamada_confession' },
        unlockDialogue: [
          '我找到了我的舊駕照。上面寫著「男」。但所有人都說這是造假。',
          '這座城市有問題。有什麼東西在改寫我們的常識。',
          '你也在調查這件事吧？我能感覺到。你和其他人不一樣。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 75, minErosion: 45 },
        unlockDialogue: [
          '我決定不再逃避了。不管是男人還是女人，不管是哪個記憶是真的——',
          '我都要找回真正的自己。那怕真相會毀掉我現在的一切。',
          '如果你願意幫我……我們一起揭開這個城市的秘密吧。',
        ],
      },
    ],
  },

  // ==================== 木精 Alraune - 花店老板 ====================
  {
    id: 'alraune_florist',
    nameCN: '花音',
    location: 'flower_shop',
    schedule: [
      { dayPhase: 'morning', location: 'flower_shop', action: '给花浇水、整理温室' },
      { dayPhase: 'afternoon', location: 'flower_shop', action: '接待客人、制作花束' },
      { dayPhase: 'evening', location: 'flower_shop', action: '在温室里照顾稀有品种' },
      { dayPhase: 'night', location: 'park', action: '夜间散步（吸收月光）' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '街角花店的美丽女主人，名叫花音。她似乎对植物有着超乎常人的了解，' +
          '任何花木在她的照料下都长得格外茂盛。她说话轻声细语，' +
          '身上有一股清新的花草香气。她的花店是许多人放松心情的好去处。',
        appearance:
          '身高约165cm，浅绿色长发像柳枝一样柔顺，通常编成松散的辫子。' +
          '皮肤白皙，面容精致，有一种不似凡人的脱俗气质。' +
          '穿着浅色连衣裙，外面套一件园艺围裙。' +
          '手指修长灵巧，指甲总是保持着自然的淡粉色。',
        dialogue: [
          { text: '欢迎光临。今天新到了一批玫瑰，要看看吗？' },
          { text: '这束薰衣草送给你，看你最近好像很疲惫的样子。' },
          { text: '植物们都很喜欢你呢……啊，我是说，它们长得特别好，因为你经常来。' },
          { text: '你知道吗？每朵花都有自己的灵魂。哈哈，我说的好像有点玄乎了。' },
          { text: '月圆之夜的花是最美的……你有机会一定要来看看。' },
          { text: '有些种子需要很长的时间才能发芽……就像有些事情，需要耐心等待真相浮现。' },
        ],
        attitude: '温柔、恬静，带有一点神秘感。对植物有着近乎偏执的热爱，说话时常带着双关。',
      },
      truthView: {
        description:
          '花音是一只Alraune——植物型怪物娘。她的本体是一株生长在温室地下的古老植物，' +
          '现在的人形态是从那株植物中诞生的「化身」。' +
          '她能够通过根系感知整个城市的状态，知道很多不为人知的秘密。' +
          '她的花粉具有轻微的精神影响效果——能让人放松警惕，更容易接受「常识改变」。' +
          '但她本人并非恶意，只是出于植物本能。',
        appearance:
          '真实视野下，她的绿色「头发」其实是细小的藤蔓，末梢在空气中轻轻摆动。' +
          '她裸露的皮肤上有极淡的绿色脉络，看起来像叶脉一样分布。' +
          '她站在土地上的时候，你能看到极细的根须从她的脚底延伸进土壤。' +
          '她的瞳孔是花朵的形状——四瓣或五瓣，随着情绪变化而开合。' +
          '当她微笑时，呼吸中飘出的不是气息，而是淡金色的花粉。',
        internalThought: [
          '（这个人……他的气味和其他人不一样。他闻到了真相的气息。）',
          '啊啊……好想把他埋在温室的土里……不不，不行，我不能这样想。）',
          '（城市底层的根网告诉我，最近结界在变弱。时机快到了……）',
          '（他每次来都会买白色的花……他是在纪念什么人吗？还是……那是一种信号？）',
          '（如果他知道我是植物……他还会温柔地对待我吗？还是会像其他人类一样害怕？）',
        ],
        contradiction:
          '她说「植物们都很喜欢你」——居民以为是拟人化的说法，但植物是真的在对玩家做出反应。' +
          '她从不穿鞋——居民以为是她的个人习惯，但实际上是因为她需要脚底接触土壤来吸收养分。' +
          '她的花店在冬天也鲜花盛开——违反自然规律，但没有人觉得奇怪。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 25, 45, 65, 85],
      levelRewards: [
        { level: 1, rewardType: 'item', rewardId: 'magic_flower', description: '获得一朵具有特殊效果的花' },
        { level: 2, rewardType: 'info', rewardId: 'plant_sense', description: '获得植物感知情报网络的信息' },
        { level: 3, rewardType: 'event', rewardId: 'alraune_reveal', description: '触发花音的真身事件' },
        { level: 4, rewardType: 'item', rewardId: 'pollen_essence', description: '获得花妖精华（重要素材）' },
        { level: 5, rewardType: 'transformation', rewardId: 'alraune_transform', description: '获得木精灵化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['欢迎光临花音的小店。有什么喜欢的花吗？'],
      },
      {
        stage: 2, condition: { minAffinity: 25 },
        unlockDialogue: ['你身上有很不错的「气息」……我是说，你的气质很好。'],
      },
      {
        stage: 3, condition: { minAffinity: 45, minErosion: 20 },
        unlockDialogue: [
          '你……你想看看我的温室吗？后面有一些……特别的植物。',
          '那些花不卖给普通人。但你……我觉得你可以看到真相。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 65, completedEvent: 'alraune_reveal' },
        unlockDialogue: [
          '既然你看到了我的真面目……那我就直说了吧。',
          '这座城市的地下，有一个巨大的根系网络。我能通过它感知一切。',
          '常识改变的源头就在这座城市的正下方。市政厅的下面。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 85, minErosion: 50 },
        unlockDialogue: [
          '人类的形体……对我来说就像一件衣服。穿久了会累。',
          '但在这座城市里，我们都必须穿上「常识」这件衣服。',
          '如果你想找到真相……你需要变得更强大。我可以帮你。',
        ],
      },
    ],
    transformation: {
      type: 'Alraune',
      revealCondition: '在夜晚跟随花音进入温室（好感度≥45）',
      revealDescription:
        '当你跟着花音走进温室深处，她在一株巨大的、发出萤光的植物前停下了脚步。' +
        '她转过身，脸上带着温柔又悲伤的微笑。' +
        '「你准备好了吗？」她轻声说，然后她的身体开始分解——' +
        '衣服滑落，皮肤裂开，从裂缝中生长出翠绿的藤蔓和嫩叶。' +
        '在几秒钟内，原地站着的一位由藤蔓和花朵构成人形态的存在——' +
        '她的头发是蔓生的常春藤，眼睛是两朵盛开的雏菊，' +
        '身体由交织的绿色藤蔓构成，其间点缀着各色小花。' +
        '「抱歉吓到你了……这就是我本来的样子。你还愿意和我做朋友吗？」',
    },
  },

  // ==================== 狼人保安 - 中央区保安 ====================
  {
    id: 'werewolf_guard',
    nameCN: '老狼',
    location: 'shopping_street',
    schedule: [
      { dayPhase: 'morning', location: 'shopping_street', action: '巡逻商店街' },
      { dayPhase: 'afternoon', location: 'shopping_street', action: '在保安亭值班' },
      { dayPhase: 'evening', location: 'shopping_street', action: '晚班巡逻' },
      { dayPhase: 'night', location: 'bar', action: '下班后去酒吧喝一杯' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '中央商业区的保安队长，大家都叫他「老狼」。' +
          '他看起来是四十多岁的壮年男性，身材魁梧，表情严肃。' +
          '虽然外表凶悍，但其实很照顾人，经常帮迷路的小孩找家长。' +
          '他对这片区域了如指掌，是商店街的「守护者」。',
        appearance:
          '身高约185cm，短发，国字脸，肤色偏深。' +
          '穿着深蓝色的保安制服，腰间挂着对讲机和警棍。' +
          '手掌很大，手指粗壮。走路步伐稳健有力。' +
          '眼睛是浅灰色的，眼神凌厉。',
        dialogue: [
          { text: '喂，小伙子/小姑娘，不要在街上奔跑。' },
          { text: '有什么需要帮忙的吗？我对这片很熟。' },
          { text: '最近晚上不太平，天黑前早点回家。' },
          { text: '……嗯？你身上有股奇怪的味道。（吸鼻子）没什么，可能是我搞错了。' },
          { text: '酒吧那种地方少去……里面的女人不简单。' },
          { text: '月圆的时候我脾气不太好，离我远点。' },
        ],
        attitude: '外表威严内心温柔的保安大叔。对人有保护欲，嗅觉异常灵敏（但用「经验丰富」来解释）。',
      },
      truthView: {
        description:
          '"老狼"其实是一头狼人——货真价实的狼人。' +
          '他是中立的怪物娘势力的一员，负责维持人类和怪物之间的平衡。' +
          '他担任保安的真正目的是监控商业区的异常情况，' +
          '防止「常识改变」出现漏洞被人类发现。' +
          '他对玩家的态度取决于玩家是否威胁到这个平衡。',
        appearance:
          '在真实视野下，老狼的「制服」下隐藏着灰色的毛发。' +
          '他的耳朵其实是尖的——藏在短发下面，偶尔会不自觉地抖动。' +
          '他的灰色眼睛在黑暗中会微微发出黄绿色的光。' +
          '他的「警棍」其实是一根包在皮革里的银制武器——用来对付失控的同类。' +
          '月圆前夜，他的指甲会变黑变硬，面部轮廓变得更加棱角分明。',
        internalThought: [
          '（这小子的味道变了……他在接触那些东西。得盯紧点。）',
          '（又是一个被卷进来的倒霉蛋。要不要警告他呢……但联盟有规定。）',
          '（今晚的月亮快圆了……该死，身体已经开始痒了。）',
          '（魅魔那边最近太张扬了，迟早会出乱子。得去敲打敲打她。）',
          '（这座城市的结界在衰弱……如果彻底崩溃的话，人类和怪物的世界就会……）',
        ],
        contradiction:
          '他总是能闻到别人闻不到的味道——他解释为「抽烟多年鼻子坏了反而对某些味道敏感」。' +
          '他从不在月圆之夜值班——请假理由是「风湿痛」。' +
          '他的「警棍」从不离身——包括洗澡和睡觉的时候。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 30, 50, 70, 90],
      levelRewards: [
        { level: 1, rewardType: 'info', rewardId: 'monster_balance', description: '得知怪物娘阵营的基本信息' },
        { level: 2, rewardType: 'item', rewardId: 'silver_bullet', description: '获得一发银制子弹（对特定怪物有效）' },
        { level: 3, rewardType: 'event', rewardId: 'werewolf_trust', description: '获得老狼的信任' },
        { level: 4, rewardType: 'info', rewardId: 'alliance_secrets', description: '获得怪物娘联盟的秘密情报' },
        { level: 5, rewardType: 'transformation', rewardId: 'werewolf_transform', description: '获得狼人化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['站在那边，别影响秩序。'],
      },
      {
        stage: 2, condition: { minAffinity: 30 },
        unlockDialogue: ['你最近在这附近转悠得很勤啊。在找什么？'],
      },
      {
        stage: 3, condition: { minAffinity: 50, minErosion: 25 },
        unlockDialogue: [
          '小子/丫头，我不管你在调查什么，但你得小心。',
          '有些事情不知道比知道好……但看你这个眼神，我说了也白说。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 70, completedEvent: 'werewolf_trust' },
        unlockDialogue: [
          '……好吧，既然瞒不住你。对，我是狼人。不是普通的「狼人」——算了，你就当是吧。',
          '这座城市有三股势力：人类、怪物、还有那些躲在幕后改写常识的家伙。',
          '你要站哪边，自己选。但选了就不要后悔。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 90, minErosion: 55 },
        unlockDialogue: [
          '你体内的「常识改编」已经很严重了。你感觉到身体的变化了吗？',
          '如果你不想彻底变成非人类……你需要在彻底改变之前做出选择。',
          '顺便说一句……我觉得你变成的样子应该不差。哈哈。',
        ],
      },
    ],
    transformation: {
      type: 'Werewolf',
      revealCondition: '在月圆之夜跟踪老狼到酒吧后巷',
      revealDescription:
        '月圆之夜的酒吧后巷里，你听到了压抑的低吼声。' +
        '老狼靠在墙上，全身剧烈颤抖。他的制服被撑裂，' +
        '灰色的毛发从皮肤下疯长出来。他的面容拉长变形，' +
        '下颚向前突出，变成了狼的吻部。手掌变成了长着利爪的兽爪。' +
        '几秒钟后，一头两米高的狼人站在你面前，黄绿色的眼睛在黑暗中闪闪发光。' +
        '但他没有攻击你——他只是喘着粗气，用沙哑的声音说：' +
        '「看到了吧……这就是真正的我。你还敢跟我做朋友吗？」',
    },
  },

  // ==================== 魅魔酒吧老板娘 ====================
  {
    id: 'succubus_bartender',
    nameCN: '夜魅',
    location: 'bar',
    schedule: [
      { dayPhase: 'morning', location: 'residential_area', action: '睡觉（魅魔的作息）' },
      { dayPhase: 'afternoon', location: 'bar', action: '准备营业、调试新酒' },
      { dayPhase: 'evening', location: 'bar', action: '营业——接待客人' },
      { dayPhase: 'night', location: 'bar', action: '营业高峰期——酒吧最热闹的时候' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '酒吧的美艳老板娘，大家都叫她「夜魅」。' +
          '她调的酒是全市最好的，据说喝过她调的酒的人都会念念不忘。' +
          '她为人豪爽大方，店里的熟客很多。' +
          '她的魅力很强，无论男女都会被吸引，' +
          '但她从不对客人越界，保持着恰到好处的距离。',
        appearance:
          '身高约170cm，身材曲线玲珑有致。一头酒红色的长卷发披散在肩上。' +
          '五官深邃，带着成熟的魅惑感。化着精致的妆容，口红是深红色。' +
          '总是穿着凸显身材的礼服或连衣裙，搭配高跟鞋。' +
          '右手无名指戴着一枚银色蛇形戒指。',
        dialogue: [
          { text: '唷，新面孔呢。第一次来？我请你喝一杯吧。' },
          { text: '今天工作累了？来，这杯「忘忧」算我的。' },
          { text: '你身上有很有趣的「味道」……我是指你的气场。' },
          { text: '店里的规矩只有一条——不要打听客人的隐私。' },
          { text: '呵呵，你看着我的眼神……和那些人一样。但又不一样。' },
          { text: '深夜是最危险的时刻，也是最美丽的时刻。' },
        ],
        attitude: '妩媚而神秘，用调情来掩盖真实意图。对玩家有兴趣，但不知道是善意还是恶意。',
      },
      truthView: {
        description:
          '夜魅是一只魅魔（Succubus），以人类的精气为食。' +
          '但她并不邪恶——她只从自愿者身上汲取少量的精气，' +
          '作为交换，她会帮客人驱除噩梦和负面情绪。' +
          '她的酒吧是怪物娘社区的地下情报交换站。' +
          '她对常识改变的真相了解很深——因为她的客人中包括那些幕后操纵者。',
        appearance:
          '真实视野下，她的「红发」其实是深红色的火焰般的能量体。' +
          '她的头顶有两根小小的、弯曲的黑色羊角——藏在头发里。' +
          '她的背后有一对蝙蝠般的皮质翅膀，平时紧贴在背上，' +
          '在宽松的衣服下几乎看不出来。' +
          '她的尾巴——细长的、末端呈心形的恶魔尾巴——' +
          '缠在她的右腿上，藏在裙摆之下。' +
          '她的眼睛在兴奋或饥饿时会变成完全的竖瞳，瞳孔中闪着红光。',
        internalThought: [
          '（这个人……他的灵魂能量好特别。不是普通的精气……混杂着「改变」的气息。）',
          '（呵呵呵，看他努力不盯着我胸部的样子真有趣。）',
          '（城里的结界越来越不稳定了……上头那些家伙到底在搞什么。）',
          '（要不要告诉他真相呢？看他陷入混乱的样子一定很有趣……）',
          '（他的味道……如果和他……不行不行，会被联盟骂的。还是先观察吧。）',
        ],
        contradiction:
          '她从不在白天出现——她解释为「美容觉」，但实际上是魅魔的夜行性。' +
          '她的酒吧没有任何镜子——她说「破坏风水」，但实际上是因为魅魔在镜中没有倒影（低级魅魔的特征）。' +
          '她从不吃东西——只喝酒，而她喝的「酒」颜色鲜艳得不像正常的饮料。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 20, 45, 65, 85],
      levelRewards: [
        { level: 1, rewardType: 'item', rewardId: 'special_drink', description: '获得特制鸡尾酒（暂时提升感知）' },
        { level: 2, rewardType: 'info', rewardId: 'underground_network', description: '获得地下情报网的接入方式' },
        { level: 3, rewardType: 'event', rewardId: 'succubus_deal', description: '触发与魅魔的交易事件' },
        { level: 4, rewardType: 'item', rewardId: 'truth_serum', description: '获得真言药水（重要道具）' },
        { level: 5, rewardType: 'transformation', rewardId: 'succubus_transform', description: '获得魅魔化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['新来的？找个位置坐下吧，我调杯好东西给你。'],
      },
      {
        stage: 2, condition: { minAffinity: 20 },
        unlockDialogue: ['你好像对很多事情很好奇呢。小心——好奇心会害死猫哦。'],
      },
      {
        stage: 3, condition: { minAffinity: 45, minErosion: 30 },
        unlockDialogue: [
          '呵呵呵……你已经看到了吧？那些不该存在的东西。',
          '看着自己熟悉的世界一点点改变，是什么感觉？',
          '想不想看得更清楚？我有一杯酒，喝了之后你就能看到「真相」。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 65, completedEvent: 'succubus_deal' },
        unlockDialogue: [
          '交易达成。我会告诉你我知道的——但不是免费的。',
          '这座城市的常识改变，是一个「实验」。有人——或者说某个存在——',
          '在测试如果将人类世界和怪物世界重疊会发生什么。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 85, minErosion: 50 },
        unlockDialogue: [
          '你知道吗？「常识」是世界上最脆弱的东西。只需要一点点扭曲，整个现实就会崩溃。',
          '你也在被改变着。我能闻到你身上越来越浓的「非人」气味。',
          '如果你愿意的话……我可以教你如何控制这种改变。毕竟，我可是这方面的专家。',
        ],
      },
    ],
    transformation: {
      type: 'Succubus',
      revealCondition: '在酒吧营业时间之外到访，或在她进食（汲取精气）时撞见',
      revealDescription:
        '你推开酒吧后门的瞬间，眼前的景象让你血液凝固。' +
        '夜魅正漂浮在半空中，她的翅膀完全展开——' +
        '那是一对巨大的蝙蝠翅膀，暗红色的膜翼在昏暗的光线下微微发光。' +
        '她的尾巴在空中慵懒地摆动，末端的心形闪烁着粉红色的光。' +
        '她的角——两根黑色的羚羊角——从额头两侧优雅地弯曲向上。' +
        '她转头看到你，脸上露出玩味的笑容：' +
        '「哎呀，被看到了呢。怎么样？要逃走，还是想了解更多？」',
    },
  },

  // ==================== 拉米亚占卜师 ====================
  {
    id: 'lamia_fortune',
    nameCN: '蛇目',
    location: 'shopping_street',
    schedule: [
      { dayPhase: 'morning', location: 'shopping_street', action: '在占卜店准备水晶球和塔罗牌' },
      { dayPhase: 'afternoon', location: 'shopping_street', action: '接待占卜客人' },
      { dayPhase: 'evening', location: 'shopping_street', action: '关店后在店内冥想' },
      { dayPhase: 'night', location: 'old_bookstore', action: '去旧书店查找古籍' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '商店街深处有一家神秘的占卜店，店主是一位名叫「蛇目」的女性占卜师。' +
          '她的占卜非常准确，据说能预知未来。' +
          '她的店铺总是飘着淡淡的薰香，窗帘常年拉着，营造出神秘的氛围。' +
          '来占卜的人络绎不绝，需要提前预约。',
        appearance:
          '身高约165cm，肤色异常白皙，近乎没有血色。' +
          '黑色长直发，浏海遮住半边脸。她的眼眸是罕见的琥珀色，瞳孔是竖直的。' +
          '身材纤瘦，穿着宽松的黑色或紫色长袍。' +
          '她走路时几乎没有声音，而且——仔细想想——' +
          '你从未见过她站起来走动，她总是坐在占卜桌后方。',
        dialogue: [
          { text: '你的命运……很有趣。混乱与希望交织。请坐。' },
          { text: '这张牌是「倒吊人」——你正在经历转变。' },
          { text: '你的过去正在被改写，但你的未来还没有确定。' },
          { text: '小心那些戴面具的人……他们不怀好意。' },
          { text: '水晶球告诉我，你很快会遇到一个重要的选择。' },
          { text: '你有没有觉得……自己的身体在发生变化？不要害怕，这是必经之路。' },
        ],
        attitude: '神秘莫测，话中有话。她似乎知道玩家的秘密，但总是说一半留一半。说话语气平稳，没有太多情绪波动。',
      },
      truthView: {
        description:
          '蛇目是一条拉米亚（Lamia）——上半身是人类女性，下半身是蛇尾的半人半蛇怪物娘。' +
          '她从不离开占卜桌的原因很简单：她的蛇尾太长了，不适合公开活动。' +
          '她拥有真正的预知能力——不是骗人的把戏。她能感知到「常识改变」的流向，' +
          '预测未来可能的发展分支。但她也有拉米亚的天性：' +
          '冷血、谨慎，以及对温暖和生命的微妙渴望。',
        appearance:
          '真实视野下，占卜桌的下方盘绕着一条巨大的蛇尾——' +
          '覆盖着闪亮的黑色鳞片，夹杂着金色的花纹。' +
          '她的上半身皮肤上也有细小的鳞片，在光线下闪烁着微光。' +
          '她的舌头——你偶尔能看到她吐出细长的、前端分叉的蛇信——' +
          '用来感知空气中的信息素。' +
          '她的琥珀色眼睛没有眼睑——蛇不眨眼睛。她使用魔法伪装了这个特征。' +
          '薰香的作用不只是营造氛围——它同时掩盖了她身上的冷血动物气息。',
        internalThought: [
          '（这个人……他身上有「变数」的气味。和其他人不一样。）',
          '（我在未来线中看到他了——他在好几个不同的结局中都扮演着关键角色。）',
          '（好冷……今天的气温太低了。我的身体快动不了了……）',
          '（如果我有腿的话……不，不要想那些没用的事。）',
          '（要不要告诉他真相呢？但命运是不能随意干预的……至少不能直接说。）',
          '（他注意到我的眼睛了……他和其他人不一样，他真的在看。）',
        ],
        contradiction:
          '她从不吃东西——客人提供的茶点从来不动。' +
          '她的占卜室总是保持高温——她说是「为了营造氛围」。' +
          '她的柜台下方有沙沙的声音——她说是「老鼠」。' +
          '她从不站在顾客面前——总是以「占卜师的尊严」为借口坐在帘子后面。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 25, 50, 70, 90],
      levelRewards: [
        { level: 1, rewardType: 'event', rewardId: 'fortune_reading', description: '触发第一次占卜事件' },
        { level: 2, rewardType: 'info', rewardId: 'future_hint', description: '获得关于未来走向的提示' },
        { level: 3, rewardType: 'event', rewardId: 'lamia_reveal', description: '触发蛇目真身事件' },
        { level: 4, rewardType: 'item', rewardId: 'truth_crystal', description: '获得真相水晶（可看到隐藏信息）' },
        { level: 5, rewardType: 'transformation', rewardId: 'lamia_transform', description: '获得拉米亚化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['请坐。你的命运……正在波动。'],
      },
      {
        stage: 2, condition: { minAffinity: 25 },
        unlockDialogue: ['你最近会作一些奇怪的梦。不要忽视它们——那是你的潜意识在告诉你真相。'],
      },
      {
        stage: 3, condition: { minAffinity: 50, minErosion: 25 },
        unlockDialogue: [
          '你已经看到太多不该看的东西了。你的常识正在崩溃。',
          '但这不一定是坏事——旧的常识崩溃了，新的常识才能建立。',
          '你想听听我真正的预言吗？——你很快就会面临一个改变命运的选择。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 70, completedEvent: 'lamia_reveal' },
        unlockDialogue: [
          '既然你已经看到了我的真实面貌……那我就直说了。',
          '这座城市的常识改变是由一个名为「理事会」的组织操控的。',
          '他们的目的是创造一个人类和怪物能够共存的世界——但用的是强制改写的手段。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 90, minErosion: 55 },
        unlockDialogue: [
          '我的预知能力告诉我，你有三条路可以走：接受改变、抵抗改变、或者——',
          '成为改变本身。不管你选择哪一条，我都会支持你。',
          '因为我在所有的未来线中都看到了你……你是关键。',
        ],
      },
    ],
    transformation: {
      type: 'Lamia',
      revealCondition: '在店内无人时，以高好感度（≥50）请求蛇目展示真身',
      revealDescription:
        '蛇目沉默了片刻，然后缓缓拉开了占卜桌下的帘子。' +
        '你倒吸一口冷气——从她的腰部以下，没有腿，取而代之的一条粗壮的蛇尾。' +
        '黑色的鳞片在薰香的烟雾中闪烁着幽光，金色的条纹沿着脊椎的方向延伸。' +
        '她的尾巴在房间里盘了好几圈，末端轻轻地敲击着地板。' +
        '她抬起头，琥珀色的竖瞳直视着你：' +
        '「这就是我的全部。一条蛇和一个女人的混合物。你现在还想和我做朋友吗？」' +
        '她的语气平静，但你从她微微颤抖的尾尖感觉到——她在害怕你的反应。',
    },
  },

  // ==================== 吸血鬼护士长 - 医院 ====================
  {
    id: 'vampire_nurse',
    nameCN: '血月',
    location: 'hospital',
    schedule: [
      { dayPhase: 'morning', location: 'hospital', action: '查房、主持晨会' },
      { dayPhase: 'afternoon', location: 'hospital', action: '在手术室值班' },
      { dayPhase: 'evening', location: 'hospital', action: '处理病历、交接班' },
      { dayPhase: 'night', location: 'hospital', action: '值夜班（她最活跃的时段）' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '医院住院部的护士长，是一位叫「血月」的女性。' +
          '她工作能力极强，专业知识丰富，对病人温柔体贴。' +
          '同事们都很敬重她，说她是「医院里最可靠的护士」。' +
          '她总是值夜班——她说因为睡眠不好，晚上反而精神更好。',
        appearance:
          '身高约172cm，一头银白色的长发在脑后盘成发髻。' +
          '皮肤极度苍白，但五官精致端正，有种冷艳的美感。' +
          '眼睛是深红色的——她说是戴了隐形眼镜。' +
          '穿着整洁的护士制服，外面套一件白大褂。' +
          '她戴着一副黑色的皮手套——即使在夏天也不摘下来。',
        dialogue: [
          { text: '病人需要休息。有什么事请明天再来。' },
          { text: '你的体检报告……嗯，一切正常。只是血压稍微偏低。' },
          { text: '我建议你多补充一些……铁质。多吃红肉。' },
          { text: '值夜班的时候，医院里很安静。你有没有觉得……这里有些不一样？' },
          { text: '你脖子上有蚊子咬的痕迹？……不，没什么。可能是光线问题。' },
          { text: '血库的库存又不足了。真是头疼。' },
        ],
        attitude: '专业冷静的医疗工作者。对人保持着职业性的距离，但偶尔会流露出非人的好奇心。',
      },
      truthView: {
        description:
          '血月是一名吸血鬼——她已经活了三百多年。' +
          '她选择在医院工作，因为这里有稳定的血液供应（从血库合法获取）。' +
          '她是怪物娘联盟中比较年长的成员之一，' +
          '见证了常识改变在这座城市的发展过程。' +
          '她对人类的态度复杂——既有保护欲，也有一种掠食者对猎物的本能兴趣。' +
          '她戴手套是因为她的指甲——吸血鬼的指甲在兴奋时会变长变黑。',
        appearance:
          '真实视野下，她的皮肤不是普通的白——是那种没有任何血色的雪白。' +
          '她的嘴唇在不说话的时候颜色很淡——因为她今天还没有进食。' +
          '她的犬齿比普通人长——在她微笑或说话时偶尔会露出来。' +
          '她的红眼睛不是隐形眼镜——那是她本来的瞳色。' +
          '她没有呼吸——如果你仔细观察，她的胸膛几乎没有任何起伏。' +
          '她的影子——在特定光线下，她的影子会显现出不同的形状：' +
          '一个有着巨大翅膀和弯角的剪影。',
        internalThought: [
          '（这个人的血——好香。不，冷静。我是护士，不是野兽。）',
          '（他/她注意到我的犬齿了……我得小心不要张嘴笑。）',
          '（今天血库的O型血快用完了……头痛。晚餐没有着落。）',
          '（他/她身上有改变的味道……是新被转化的吗？还是只是受到了影响？）',
          '（我在这座城市待了五十年了。我见证了这里一点一点变成怪物的乐园。）',
          '（有时候我在想……如果人类知道真相，他们会怎么办？逃跑？反抗？还是接受？）',
        ],
        contradiction:
          '她从不在医院食堂吃饭——她说「工作太忙」。' +
          '她从来不晒太阳——即使是大晴天她也会撑一把黑色的阳伞。' +
          '她对颈部受伤的病人特别关心——关心得有点过头了。' +
          '她的体温比正常人低——如果是握手，你能感觉到那种不自然的冰凉。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 30, 50, 70, 85],
      levelRewards: [
        { level: 1, rewardType: 'info', rewardId: 'hospital_secret', description: '得知医院地下层的秘密' },
        { level: 2, rewardType: 'item', rewardId: 'blood_pack', description: '获得血包（可作为交易品或恢复道具）' },
        { level: 3, rewardType: 'event', rewardId: 'vampire_reveal', description: '触发血月真身事件' },
        { level: 4, rewardType: 'info', rewardId: 'council_info', description: '获得关于理事会的重要情报' },
        { level: 5, rewardType: 'transformation', rewardId: 'vampire_transform', description: '获得吸血鬼化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['探病时间已经过了。请明天再来。'],
      },
      {
        stage: 2, condition: { minAffinity: 30 },
        unlockDialogue: ['你最近经常来医院呢。身体不舒服吗？……还是你对医院感兴趣？'],
      },
      {
        stage: 3, condition: { minAffinity: 50, minErosion: 30 },
        unlockDialogue: [
          '你已经发现了吧——这家医院有些病患不太「正常」。',
          '但你没有大声张扬。这说明你……已经开始接受了。',
          '接受这个世界的本来面目。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 70, completedEvent: 'vampire_reveal' },
        unlockDialogue: [
          '我已经三百多岁了。我见过太多世界的变迁。',
          '但这次的「常识改变」是我见过最彻底的……',
          '它不仅改变了城市，还改变了人们的记忆和认知。',
          '操纵这一切的是一个叫「理事会」的组织。他们不是人类——至少不全都是。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 85, minErosion: 55 },
        unlockDialogue: [
          '你的身体已经在变化了。我能闻到——你的血正在改变。',
          '如果有一天你不再是人类……记得，医院永远欢迎你。',
          '我们这些「非人类」需要互相照顾。毕竟，这个世界对异类并不友好。',
        ],
      },
    ],
    transformation: {
      type: 'Vampire',
      revealCondition: '在夜间跟随血月进入医院血库区',
      revealDescription:
        '你偷偷跟在血月身后，进入了标有「血库重地——非授权禁止进入」的区域。' +
        '透过门缝，你看到了令人震惊的一幕：' +
        '血月摘下了手套，露出了修长的手指和黑色的指甲。' +
        '她拿起一袋血浆，咬破了包装袋的边角。' +
        '但她的喝法不是用嘴吸——她的犬齿伸长，直接刺入袋中。' +
        '她的眼睛闭着，表情放松而满足，完全不像平时那个严肃专业的护士长。' +
        '当她睁开眼睛看到你时，她的嘴角还沾着一丝暗红色的液体。' +
        '「……」她沉默了几秒钟，然后用一种无奈的口吻说：' +
        '「你看到了不该看的东西。但我想……我也瞒不下去了。」',
    },
  },

  // ==================== 狐妖巫女 - 神社 ====================
  {
    id: 'kitsune_miko',
    nameCN: '狐铃',
    location: 'shrine',
    schedule: [
      { dayPhase: 'morning', location: 'shrine', action: '清扫神社、更换净水' },
      { dayPhase: 'afternoon', location: 'shrine', action: '接待参拜者、贩售御守' },
      { dayPhase: 'evening', location: 'shrine', action: '进行傍晚的祈祷仪式' },
      { dayPhase: 'night', location: 'shrine', action: '在神社内冥想、守护结界' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '神社的年轻巫女，大家都叫她「狐铃」。' +
          '她穿上巫女服时气质端庄，对待参拜者和蔼可亲。' +
          '她的御守据说特别灵验——尤其是求姻缘和避邪的。' +
          '她偶尔会说一些似乎看穿人心底的话，但说完就装傻糊弄过去。',
        appearance:
          '身高约160cm，身材娇小。一头柔顺的黑色长发，在脑后系成马尾。' +
          '大大的黑色眼睛，眼神清澈又带点狡黠。' +
          '长相可爱，笑起来有两个小虎牙。' +
          '穿着传统的白色上衣和红色裤裙，脚踏木屐。' +
          '她动作轻盈，走路几乎没有声音。',
        dialogue: [
          { text: '欢迎来到神社。要抽个签吗？' },
          { text: '你的运势……嗯，是「大吉」呢。但也有些混乱的气场在你周围。' },
          { text: '这个御守送给你吧。它能在你遇到危险的时候保护你。' },
          { text: '你最近有没有梦到什么东西？比如……狐狸？' },
          { text: '月圆之夜不要在外面待太晚哦。不是因为妖怪——呃，我是说治安不好。' },
          { text: '你的气场变了呢……和第一次来的时候不一样了。' },
        ],
        attitude: '活泼可爱的外表下藏着精明和敏锐。她总是察觉到比表面上更多的事情，但选择装傻。',
      },
      truthView: {
        description:
          '狐铃是一只狐妖（Kitsune），准确地说是一只三尾狐。' +
          '她是神社真正的主人——这座神社是她为了守护城市结界而设立的。' +
          '她的职责是维持扭曲核心区域的常识改变稳定，' +
          '防止现实崩溃波及到外界。她对玩家的态度受立场影响——' +
          '如果玩家威胁到结界的稳定，她会毫不犹豫地变回真身战斗。' +
          '但如果玩家愿意合作，她是极其强大的盟友。',
        appearance:
          '真实视野下，她的头顶有一对毛茸茸的狐耳——而不是人类的耳朵。' +
          '她的身后有三条蓬松的金色尾巴，在她情绪波动时会不自觉地摆动。' +
          '她的「黑色眼睛」其实是深金色的瞳孔——竖直的狐瞳。' +
          '她的小虎牙其实是尖尖的犬齿。' +
          '她的「木屐」下面——你发现她根本没有踩在地上，' +
          '她的脚离地面有一公分左右的距离——她在漂浮。' +
          '她身上散发的香气不是薰香——那是狐妖特有的魔力气息。',
        internalThought: [
          '（这个人……他身上的「常识」在松动。他看到了不该看的东西。）',
          '（三条尾巴……不，我不能在人类面前露出来。至少现在不行。）',
          '（结界又变弱了……那个该死的理事会，到底在深渊回廊搞什么。）',
          '（他/她的灵魂在发光……可能是一个优秀的「容器」。不，我不能有这种念头。）',
          '（如果他/她继续深入调查……总有一天会来到深渊回廊，那时候我该怎么办？）',
          '（保护人类还是保护结界？为什么这两者不能兼得呢……）',
        ],
        contradiction:
          '她总是推荐避邪御守——但御守里装的其实是她自己的毛发（含有妖力）。' +
          '她从不穿鞋——她说是「修行」，但实际上是因为狐妖不习惯穿鞋，且需要脚底接地气。' +
          '她对狐狸相关的话题异常敏感——会不自觉地竖起耳朵（虽然她会立刻掩饰）。' +
          '她养了一只白色的狐狸当宠物——但那其实是她的一个分身。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 30, 55, 75, 95],
      levelRewards: [
        { level: 1, rewardType: 'item', rewardId: 'protective_charm', description: '获得狐铃的护身御守' },
        { level: 2, rewardType: 'info', rewardId: 'barrier_knowledge', description: '获得关于神社结界秘的知识' },
        { level: 3, rewardType: 'event', rewardId: 'kitsune_reveal', description: '触发狐铃真身事件' },
        { level: 4, rewardType: 'event', rewardId: 'barrier_ritual', description: '参与结界强化仪式' },
        { level: 5, rewardType: 'transformation', rewardId: 'kitsune_transform', description: '获得狐妖化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['欢迎来到神社。请保持安静。'],
      },
      {
        stage: 2, condition: { minAffinity: 30 },
        unlockDialogue: ['你好像对神社很感兴趣呢。要不要听听这里的历史？'],
      },
      {
        stage: 3, condition: { minAffinity: 55, minErosion: 35 },
        unlockDialogue: [
          '你……能看到多少？',
          '我是说，你经过鸟居的时候，有没有感觉到什么不一样？',
          '没有的话……那就太好了。（表情暗淡）',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 75, completedEvent: 'kitsune_reveal' },
        unlockDialogue: [
          '既然你已经知道了，我就不再隐瞒了。',
          '我是这座神社的守护者——也是这座城市结界的守护者之一。',
          '常识改变的源头在地下深处——深渊回廊。那里是现实被改写的核心。',
          '理事会控制着那里。他们在做……不该做的事。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 95, minErosion: 70 },
        unlockDialogue: [
          '结界越来越弱了。深渊回廊的力量在扩散。',
          '如果继续这样下去，整个城市都会变成怪物的巢穴——不是和平共存，而是吞噬。',
          '我需要你的帮助。你愿意和我一起……阻止理事会吗？',
        ],
      },
    ],
    transformation: {
      type: 'Kitsune',
      revealCondition: '在神社结界受损时提供帮助，狐铃为了展示信任而变身',
      revealDescription:
        '狐铃深吸一口气，然后她体内的某种「限制」被解开了。' +
        '她的耳朵变尖、变长，覆盖上了金色的绒毛——真正的狐耳从头发中竖起。' +
        '她的身后猛然展开三条巨大的尾巴，蓬松的金色毛发在空气中飘动，' +
        '尾尖燃烧着淡蓝色的狐火。她的眼睛变成了完全的竖瞳，' +
        '金色的光芒在其中流转。她周围的空气因为魔力而扭曲，' +
        '樱花的花瓣在她身边无风自动。' +
        '她用一种比平时低沉、也更威严的声音说：' +
        '「这是我真正的姿态——三尾狐妖，狐铃。请不要害怕，我不会伤害你。」',
    },
  },

  // ==================== 玩偶店老板 ====================
  {
    id: 'doll_shop_owner',
    nameCN: '偶人',
    location: 'shopping_street',
    schedule: [
      { dayPhase: 'morning', location: 'shopping_street', action: '开店、清洁橱窗' },
      { dayPhase: 'afternoon', location: 'shopping_street', action: '在店内制作玩偶' },
      { dayPhase: 'evening', location: 'shopping_street', action: '接待顾客' },
      { dayPhase: 'night', location: 'old_bookstore', action: '去旧书店寻找设计灵感' },
    ],
    type: 'monster_girl',
    perception: {
      residentView: {
        description:
          '商店街有一家精致的玩偶店，店铺的主人是一位名叫「偶人」的女性。' +
          '她的手艺极好，制作的玩偶栩栩如生，非常受孩子们欢迎。' +
          '她本人话不多，总是安静地坐在店铺深处做手工。' +
          '她的店铺陈列着各式各样的玩偶——从传统的日式人偶到西式洋娃娃。',
        appearance:
          '身高约158cm，体型娇小。一头浅棕色的短发，浏海整齐地剪到眉毛上方。' +
          '她的长相有种不真实的精致——像是她自己做出来的玩偶。' +
          '眼睛是浅灰色的，总是一眨不眨地看着人。' +
          '穿着朴素的连衣裙，外面套一件沾满线头的围裙。' +
          '她动作很慢，而且……有点不自然，像是关节不太灵活的样子。',
        dialogue: [
          { text: '……欢迎光临。请随意看看。' },
          { text: '这个玩偶……我花了一个月的时间制作。她是独一无二的。' },
          { text: '你觉得……玩偶有灵魂吗？' },
          { text: '你的眼睛很漂亮……如果可以的话，我想为你做一个玩偶。' },
          { text: '小心那个橱窗里的娃娃……她今天心情不太好。嗯？我开玩笑的。' },
          { text: '夜深的时候……偶尔能听到店里有人在说话。但这里只有我一个人。' },
        ],
        attitude: '沉默寡言，给人一种阴郁的感觉。但是她做的玩偶实在太精美了，让人忍不住想靠近。',
      },
      truthView: {
        description:
          '偶人的真实身份是「觉醒的人偶」——一个被魔力赋予生命的玩偶。' +
          '她自己就是一只活着的玩偶。她的关节是球型关节，' +
          '她的皮肤是高级瓷器的质感，她的头发是真正的马海毛。' +
          '她「制作」的玩偶，有一部分其实是她用魔力唤醒的同类。' +
          '她的店铺实际上是一个「庇护所」——收留那些在常识改变中觉醒的玩偶型怪物。',
        appearance:
          '真实视野下，她的皮肤上有极细微的裂纹——瓷器的开片纹理。' +
          '她的肘部和膝盖处能看到球型关节的轮廓——虽然她用衣服巧妙地遮盖了。' +
          '她的灰色眼睛是玻璃珠——完美的球体，没有瞳孔的缩放，永远定着在同一个焦点。' +
          '她的头发——你能看到那是极细的纤维丝线，每一根都是人工植入的。' +
          '当她走动的时候，你能听到极轻微的机械声——关节转动的声音。' +
          '当她长时间不动的时候——她真的可以完全不动，连呼吸都没有。',
        internalThought: [
          '（这个人……他能看到我的本质吗？他的视线和别人不一样。）',
          '（店里的小家伙们今天很躁动……是因为结界不稳定吗？还是因为来了有趣的客人？）',
          '（好想让他触摸我的关节……感受一下这不是人类的身体……不行，这种想法太奇怪了。）',
          '（如果我告诉他真相，他会吓跑吗？还是会好奇？人类对非人类的反应总是很极端。）',
          '（理事会的人又来了……他们想招募我。但我不想参与他们的游戏。）',
          '（这具身体已经存在一百多年了。我看过太多人类的来来去去……）',
        ],
        contradiction:
          '她从不吃东西——她说是「胃不好」。' +
          '她从不眨眼——如果你盯着看，你数不到她眨眼。' +
          '她从不坐下——她总是站着，或是半弯腰在工作台前。' +
          '她从不在镜子前停留——不是因为不喜欢自己的样子，而是因为……镜子会暴露。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 25, 45, 65, 85],
      levelRewards: [
        { level: 1, rewardType: 'item', rewardId: 'tiny_doll', description: '获得一个娇小的守护玩偶（可抵挡一次致命伤害）' },
        { level: 2, rewardType: 'info', rewardId: 'doll_secret', description: '得知玩偶店的真相' },
        { level: 3, rewardType: 'event', rewardId: 'doll_awakening', description: '触发玩偶店老板觉醒事件' },
        { level: 4, rewardType: 'event', rewardId: 'doll_sanctuary', description: '解锁玩偶庇护所的进入权限' },
        { level: 5, rewardType: 'transformation', rewardId: 'doll_transform', description: '获得人偶化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['……欢迎光临。请随意看看。'],
      },
      {
        stage: 2, condition: { minAffinity: 25 },
        unlockDialogue: ['你好像对玩偶很感兴趣……你觉得它们有灵魂吗？'],
      },
      {
        stage: 3, condition: { minAffinity: 45, minErosion: 20 },
        unlockDialogue: [
          '你身上的「气息」变了……第一次来的时候你还是一个普通的人类。',
          '现在……你身上有了「同类」的味道。你察觉到了吗？',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 65, completedEvent: 'doll_awakening' },
        unlockDialogue: [
          '这家店已经存在了八十多年……我一直在这里，看着这座城市的变迁。',
          '常识改变不是第一次发生。在我漫长的存在中，我看到过三次类似的现象。',
          '每一次都有一个中心——一个新的现实从那个中心向外扩散。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 85, minErosion: 50 },
        unlockDialogue: [
          '你的身体正在发生变化……我能感觉到。就像当年的我一样。',
          '从人类变成非人类的过程是痛苦的。但也可以是一次重生。',
          '如果你需要一个安全的港湾……我的店永远为你敞开。',
        ],
      },
    ],
    transformation: {
      type: 'Doll',
      revealCondition: '在偶人的店铺打烊后到访',
      revealDescription:
        '入夜后的玩偶店散发着诡异的气息。你听到轻微的机械运转声从店铺深处传来。' +
        '当你走进去时，你看到偶人正站在工作台前——但她没有在工作。' +
        '她保持着一个静止的姿势，一动不动——像是被按下了暂停键。' +
        '几秒后，她的头以一种非人类的方式转向你——不是转动脖子，而是整个头部180度旋转。' +
        '她的脸上没有任何表情，但她的声音从店内的各个方向传来：' +
        '「被你发现了呢。」她抬起手——肘关节反向弯曲，手指像玩偶一样分节活动。' +
        '她慢慢地、刻意地展示自己的身体——掀开裙子露出球型关节的双腿，' +
        '解开衣领露出陶瓷躯干上的接合线。' +
        '「我是活的玩偶。从一开始就是。你还想和我做朋友吗？」',
    },
  },

  // ==================== 龙女市长 - 市政大厅 ====================
  {
    id: 'dragon_mayor',
    nameCN: '龙映',
    location: 'city_hall',
    schedule: [
      { dayPhase: 'morning', location: 'city_hall', action: '在办公室处理市政文件' },
      { dayPhase: 'afternoon', location: 'city_hall', action: '主持市政会议' },
      { dayPhase: 'evening', location: 'city_hall', action: '接待来宾、参加晚宴' },
      { dayPhase: 'night', location: 'city_hall', action: '在顶楼办公室独处（批阅机密文件）' },
    ],
    type: 'key_npc',
    perception: {
      residentView: {
        description:
          '这座城市的市长——龙映女士。她是近年来最受欢迎的市长，' +
          '在她的领导下，城市发展迅速，市民生活水准不断提高。' +
          '她以果断、智慧和亲民的作风著称，每次公开演讲都充满领袖魅力。' +
          '她的背景成谜——据说出身显赫，但具体来历没有人清楚。',
        appearance:
          '身高约175cm，身材高挑，气场强大。一头银灰色的长发整齐地盘在脑后。' +
          '五官深邃，有种威严的美感。眼睛是深紫色的——罕见而美丽。' +
          '穿着剪裁合身的深色套装，佩戴着一枚龙形胸针。' +
          '她说话的声音低沉而有磁性，让人不由自主地想要听从。',
        dialogue: [
          { text: '欢迎来到市政厅。有什么我可以为你做的吗？' },
          { text: '这座城市的发展离不开每一位市民的努力。' },
          { text: '改革总是伴随着阵痛……但长远来看，这是必要的。' },
          { text: '你看起来有些困惑。需要我帮你解惑吗？' },
          { text: '世界上有很多事情并不是表面上看到的那样……' },
          { text: '如果你有什么困扰，不妨来找我谈谈。我的办公室随时为你敞开。' },
        ],
        attitude: '威严、自信、有领袖魅力。她说话的方式让人无法质疑，有一种压倒性的说服力。',
      },
      truthView: {
        description:
          '龙映市长是一条真正的龙——东方巨龙化为人形。' +
          '她是「理事会」的核心成员之一，也是常识改变计划的主要推动者。' +
          '她相信人类和怪物的融合是进化的必然方向，' +
          '而「常识改变」只是加速这一过程的手段。' +
          '但她的目的并非邪恶——她希望创造一个没有种族隔阂的理想世界。' +
          '问题在于，她没有征求人类的同意。',
        appearance:
          '真实视野下，她的银灰色「头发」在光线下闪烁着鳞片般的光泽。' +
          '她的紫色眼睛——瞳孔是竖直的龙瞳，深邃如宝石。' +
          '她的体温异常高——站在她身边能感受到热辐射。' +
          '她的龙形胸针——那不是装饰品，那是她的一部分鳞片制成的法器，' +
          '用来维持她的人形态。' +
          '当她情绪激动时，她的眼角会浮现出细小的鳞片纹路。' +
          '她的影子——在某些角度下会显现出龙的轮廓：长颈、利爪、展开的巨翼。' +
          '她的办公桌下藏着一份文件：《人类→非人类转化促进计划·第三阶段实施方案》。',
        internalThought: [
          '（这个人……他看到了太多不该看的东西。但他也很有潜力。）',
          '（我的城市正在蜕变。普通人类无法理解这种伟大的变革。）',
          '（深渊回廊的能量越来越强了……计划正在按预期进行。）',
          '（他凝视我的眼神里没有恐惧……有意思。他可能是一个优秀的「桥梁」。）',
          '（如果他能接受改变……他可以成为人类和怪物之间的重要纽带。）',
          '（但如果他选择反抗……我就不得不用强硬的手段了。）',
        ],
        contradiction:
          '她从不与人握手——以「保持威仪」为理由，但实际上是因为人类无法承受她的体温。' +
          '她的办公室永远保持高温——空调常年设定在30度以上，她说是「个人习惯」。' +
          '她从不在直接阳光下露面——公开活动总是在室内或傍晚举行。' +
          '她的「龙形胸针」从不摘下——包括洗澡和睡觉的时候。',
      },
    },
    affinity: {
      maxLevel: 5,
      unlockThresholds: [0, 35, 55, 75, 100],
      levelRewards: [
        { level: 1, rewardType: 'event', rewardId: 'mayor_audience', description: '获得与市长单独会面的机会' },
        { level: 2, rewardType: 'info', rewardId: 'council_member', description: '得知理事会的部分信息' },
        { level: 3, rewardType: 'event', rewardId: 'dragon_reveal', description: '触发龙映的真身揭示' },
        { level: 4, rewardType: 'info', rewardId: 'plan_details', description: '获得常识改变计划的详细信息' },
        { level: 5, rewardType: 'transformation', rewardId: 'dragon_transform', description: '获得龙化能力（可选）' },
      ],
    },
    dialogueStages: [
      {
        stage: 1, condition: { minAffinity: 0 },
        unlockDialogue: ['欢迎来到市政厅。希望你的到访愉快。'],
      },
      {
        stage: 2, condition: { minAffinity: 35 },
        unlockDialogue: ['你对这座城市的未来……怎么看？你觉得变化是好事还是坏事？'],
      },
      {
        stage: 3, condition: { minAffinity: 55, minErosion: 40 },
        unlockDialogue: [
          '你已经看到了世界的真相——这个世界远比教科书上写的复杂。',
          '人类不是这个星球上唯一的智慧物种。一直以来都不是。',
          '我们只是……被藏起来了。而现在，是时候让两个世界合而为一了。',
        ],
      },
      {
        stage: 4, condition: { minAffinity: 75, completedEvent: 'dragon_reveal' },
        unlockDialogue: [
          '既然你看到了我的真身……那我就坦然说了。',
          '我是龙映，东方龙族的末裔之一。这个城市的「常识改变」——是我的计划。',
          '不，准确地说，是我们理事会的计划。目的是创造一个没有种族界限的世界。',
        ],
      },
      {
        stage: 5, condition: { minAffinity: 100, minErosion: 70 },
        unlockDialogue: [
          '你已经走到了这一步——既不是纯粹的人类，也不是完全的怪物。',
          '你处在一个独特的位置上。你可以成为两个世界的桥梁。',
          '来吧，加入理事会。我们一起创造一个更好的世界——',
          '在那个世界里，没有人需要隐藏真正的自己。',
        ],
      },
    ],
    transformation: {
      type: 'Dragon',
      revealCondition: '在高好感度（≥75）下，龙映为了展示信任而展现真身',
      revealDescription:
        '龙映站起来，走到办公室的落地窗前。她背对着你，解开了盘起的头发。' +
        '银灰色的长发披散开来——不，那不是头发，那是细密的银色鬃毛。' +
        '她的身体开始膨胀，衣物被撑裂。深紫色的鳞片从皮肤下浮现，' +
        '覆盖了她的全身。她的面容拉长，变成了优雅而威严的龙首，' +
        '一对巨大的角从额头两侧向后伸展。' +
        '她的背后猛然展开一对覆盖着鳞片的巨翼——宽度几乎横跨整个办公室。' +
        '一条长长的、布满骨刺的龙尾在她身后缓缓摆动。' +
        '完全化龙的她低下头，用仍然是她原声但更加宏亮的声音说：' +
        '「这就是龙。真正的龙。你还愿意和我站在一起吗？」',
    },
  },
];

export default characters;
