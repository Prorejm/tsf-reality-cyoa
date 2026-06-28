// ===== 谜题配置 - 5种谜题类型 =====

export type PuzzleType = 'jigsaw' | 'code_cracker' | 'memory_match' | 'contradiction_find' | 'qte';

export interface Puzzle {
  id: string;
  name: string;
  nameCN: string;
  type: PuzzleType;
  description: string;
  difficulty: number;  // 1-5
  sceneId: string;
  data: PuzzleData;
  reward: {
    erosion?: number;
    awareness?: number;
    item?: string;
    discovery?: string;
    event?: string;
  };
}

export type PuzzleData =
  | JigsawData
  | CodeCrackerData
  | MemoryMatchData
  | ContradictionFindData
  | QTEData;

export interface JigsawData {
  imageDescription: string;
  pieces: number;
  timeLimit: number; // 秒
  hintText: string;
}

export interface CodeCrackerData {
  cipherText: string;
  hint: string;
  answer: string;
  maxAttempts: number;
  contextNarrative: string;
}

export interface MemoryMatchData {
  pairs: { resident: string; truth: string }[];
  timeLimit: number;
  narrative: string;
}

export interface ContradictionFindData {
  sceneContext: string;
  anomalies: { id: number; description: string; isReal: boolean }[];
  requiredCorrect: number;
  timeLimit: number;
}

export interface QTEData {
  prompts: { time_ms: number; text: string; correctKey: string }[];
  totalDuration: number;
  failureDescription: string;
  successDescription: string;
}

export const puzzles: Puzzle[] = [
  // 1. 拼图 - 碎裂的照片
  {
    id: 'puzzle_shattered_photo',
    name: 'Shattered Photo',
    nameCN: '碎裂的照片',
    type: 'jigsaw',
    description: '你在舊書店發現了一張被撕碎的照片。照片上似乎是一群人站在一座建築前——但建築的風格很奇怪，像是中世紀的城堡和現代摩天大樓的混合體。將碎片拼起來，或許能揭示重要的線索。',
    difficulty: 3,
    sceneId: 'old_bookstore',
    data: {
      imageDescription: '一張黑白照片，拍攝於某個不清楚的年代。照片中央是一座不可能的建築——下半部分是哥特式教堂，上半部分是玻璃幕牆的現代大樓。建築物前站著一群人——其中一些人的輪廓……不太對勁。有的頭頂有角，有的身後有翅膀或尾巴。',
      pieces: 24,
      timeLimit: 300,
      hintText: '注意建築物的窗戶——那些窗戶的排列順序可能隱藏著資訊。',
    },
    reward: { awareness: 8, discovery: 'change_history', item: 'old_photo' },
  },

  // 2. 密码破解 - 保险柜密码
  {
    id: 'puzzle_safe_crack',
    name: 'Safe Cracker',
    nameCN: '保险柜密码',
    type: 'code_cracker',
    description: '在市政大廳市長辦公室的暗門後，你發現了一個老式保險櫃。保險櫃上有四個數字的密碼盤。旁邊貼著一張便利貼，上面寫著幾行看起來像是提示的文字。',
    difficulty: 4,
    sceneId: 'city_hall',
    data: {
      cipherText: '線索1: "龍鱗的數量×人類的時代" 線索2: "第一條尾巴出現的年齡" 線索3: "深淵迴廊的層數" 線索4: "結界維持者的尾巴數"',
      hint: '這些數字都和龍映市長有關——她的年齡、她的鱗片、她的計劃階段……以及她從不提起的某個數字。',
      answer: '4713',
      maxAttempts: 5,
      contextNarrative: '保險櫃的門上刻著一行小字：「真正的領袖知道何時該隱藏真相，何時該揭露。」你深吸一口氣，開始轉動密碼盤。',
    },
    reward: { erosion: 5, awareness: 15, item: 'plan_documents', discovery: 'plan_details' },
  },

  // 3. 记忆配对 - 住民vs真相
  {
    id: 'puzzle_memory_match',
    name: 'Resident vs Truth',
    nameCN: '住民vs真相',
    type: 'memory_match',
    description: '你的腦海中開始浮現出矛盾的記憶——同一件事有兩個完全不同的版本。你必須分辨出哪個是「居民」的記憶（被常識改變過的），哪個是「真相」的記憶（被壓抑的）。',
    difficulty: 3,
    sceneId: 'residential_area',
    data: {
      pairs: [
        { resident: '隔壁的小林太太是一位溫柔的全職主婦，結婚二十年，有兩個孩子。', truth: '小林太太的真實身份是一隻貓妖，她的「丈夫」和「孩子」都是為了掩飾身份而創造的記憶載體。' },
        { resident: '三年前市政府改建了這條街道的排水系統。', truth: '三年前這裡發生了一次「現實崩潰」，十二名居民在事件中「轉變」為非人類，改建是為了掩蓋痕跡。' },
        { resident: '街角的老梧桐樹是十年前種植的綠化項目。', truth: '那棵「梧桐樹」實際上是一株從深淵回廊生長出來的界錨植物，用來穩定此區域的常識改變。' },
        { resident: '社區的夜間巡邏隊是為了治安而設立的。', truth: '夜間巡邏隊的真正任務是監視那些「夜間變身」的怪物娘，防止她們在月圓之夜失控。' },
        { resident: '你從小在這裡長大，你的房間在二樓左邊。', truth: '你的記憶是被植入的。你真正的過去——在你開始調查之前的那段人生——是一片空白。' },
      ],
      timeLimit: 240,
      narrative: '你坐在房間裡，閉上眼睛。兩個版本的記憶在你腦海中同時浮現——像兩條平行但矛盾的河流。你必須選擇相信哪一條。',
    },
    reward: { awareness: 12, discovery: 'memory_overwrite' },
  },

  // 4. 找矛盾 - 从场景中找出异常
  {
    id: 'puzzle_contradiction',
    name: 'Find the Contradiction',
    nameCN: '找出矛盾',
    type: 'contradiction_find',
    description: '你站在中央商業區的十字路口。一切看起來都很正常——但你的直覺告訴你，有什麼地方不對勁。仔細觀察周圍，找出那些不應該存在的「異常」。',
    difficulty: 4,
    sceneId: 'shopping_street',
    data: {
      sceneContext: '午後的商店街行人如織。陽光灑在街道上，孩子們在追逐嬉戲，咖啡廳的香氣飄散在空氣中。一切看起來都是完美的日常風景。但你的「感知」告訴你——有六個地方不對勁。',
      anomalies: [
        { id: 1, description: '一個路人的影子比本人慢了半秒才跟上', isReal: true },
        { id: 2, description: '咖啡廳的招牌上的文字在英文和某種未知文字之間閃爍', isReal: true },
        { id: 3, description: '一個小女孩的洋娃娃在對你揮手', isReal: true },
        { id: 4, description: '便利商店的自動門開關的速度比正常快了一倍', isReal: false },
        { id: 5, description: '天空中有兩隻排列成V字形的鳥', isReal: false },
        { id: 6, description: '一個穿西裝的男人脖子上有鰓裂——正在一開一合', isReal: true },
        { id: 7, description: '花店門口的花顏色比你記憶中的鮮豔了太多', isReal: false },
        { id: 8, description: '圖書館的窗戶裡有書架在自行移動', isReal: true },
      ],
      requiredCorrect: 4,
      timeLimit: 180,
    },
    reward: { awareness: 10, erosion: 3, setFlag: 'contradiction_solved' },
  },

  // 5. QTE快速反应 - 现实撕裂时保持清醒
  {
    id: 'puzzle_reality_tear_qte',
    name: 'Reality Tear',
    nameCN: '现实撕裂',
    type: 'qte',
    description: '深淵回廊的能量突然爆發——你周圍的現實開始崩潰。天空像玻璃一樣碎裂，地面的透視關係扭曲。你必須保持清醒，在正確的時機做出正確的反應，否則你的意識將被捲入混沌之中。',
    difficulty: 5,
    sceneId: 'abyss_corridor',
    data: {
      prompts: [
        { time_ms: 3000, text: '地面塌陷——你向左跳！', correctKey: 'ArrowLeft' },
        { time_ms: 2500, text: '一道裂縫從上方劈下——你向右閃避！', correctKey: 'ArrowRight' },
        { time_ms: 2000, text: '重力翻轉——你抓住突出的鋼筋！', correctKey: 'ArrowUp' },
        { time_ms: 2500, text: '虛空的低語侵蝕你的意識——集中精神！', correctKey: 'Space' },
        { time_ms: 3000, text: '一個幻影向你撲來——你低頭躲過！', correctKey: 'ArrowDown' },
        { time_ms: 2000, text: '現實碎片如刀鋒般飛來——你側身閃避！', correctKey: 'ArrowRight' },
        { time_ms: 1500, text: '深淵之眼睜開——不要看！閉上眼！', correctKey: 'Space' },
      ],
      totalDuration: 45,
      failureDescription: '你的意識被撕裂了。一瞬間，你感覺自己分散成了無數個碎片——過去的你、未來的你、可能成為的你，在不同的現實中同時存在。當你終於重新凝聚意識時，你發現自己躺在陌生街道上。你的侵蝕率急劇上升，而且你的身體……發生了某種不可逆轉的變化。',
      successDescription: '你成功地抵抗了現實撕裂的衝擊。你的意志比你想像的更堅強——在混沌中，你抓住了一絲真實，並以此為錨點穩住了自己。你的感知大幅提升，你現在能清晰地看到現實的「縫合線」——常識改變在你眼中不再天衣無縫。',
    },
    reward: { erosion: -5, awareness: 20, setFlag: 'reality_tear_survived' },
  },
];

export default puzzles;
