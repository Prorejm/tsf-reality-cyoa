// ===== TSF Reality CYOA - Initial Game Items
// Auto-generated item data that fuels the game's inventory system

export interface GameItemDef {
  id: string;
  name: string;
  nameCN: string;
  type: 'consumable' | 'equipment' | 'material' | 'key_item' | 'clue' | 'reusable' | 'tsf_trigger';
  description: string;
  usage: string;
  icon: string;
  quantity: number;
  maxStack: number;
  usable: boolean;
  sellPrice: number;
  flags?: string[];
}

const MISC_ITEMS: GameItemDef[] = [
  // === CONSUMABLES ===
  {
    id: 'herb_heal', name: 'Soothing Herb', nameCN: '镇静草药',
    type: 'consumable', description: '一种散发着奇异香气的草药。据说可以稳定精神。', usage: '侵蚀 -5',
    icon: '🌿', quantity: 1, maxStack: 5, usable: true, sellPrice: 10,
  },
  {
    id: 'pill_awake', name: 'Awakening Pill', nameCN: '清醒丸',
    type: 'consumable', description: '让人暂时摆脱"常识"影响的药丸。', usage: '认知 +10 (临时)',
    icon: '💊', quantity: 1, maxStack: 3, usable: true, sellPrice: 25,
  },
  {
    id: 'coin_old', name: 'Old Coin', nameCN: '旧硬币',
    type: 'material', description: '一枚刻着不认识的文字的古币。可以当货币使用。', usage: '交易用',
    icon: '🪙', quantity: 5, maxStack: 99, usable: false, sellPrice: 0,
  },

  // === KEY ITEMS (plot-critical) ===
  {
    id: 'key_shrine', name: 'Shrine Key', nameCN: '神社的钥匙',
    type: 'key_item', description: '神社后殿的钥匙。锁上刻着狐狸的图案。', usage: '解锁神社后殿',
    icon: '🔑', quantity: 1, maxStack: 1, usable: false, sellPrice: 0,
  },
  {
    id: 'note_stranger', name: 'Mysterious Note', nameCN: '神秘便条',
    type: 'key_item', description: '"不要相信镇长的话。他已经被"替换"了。——K"', usage: '剧情关键',
    icon: '📝', quantity: 1, maxStack: 1, usable: false, sellPrice: 0,
  },
  {
    id: 'photo_old', name: 'Old Photograph', nameCN: '旧照片',
    type: 'clue', description: '一张泛黄的照片，上面的人穿着几十年前的服装，但面孔看起来和现在镇上的人一模一样。', usage: '线索关联',
    icon: '📸', quantity: 1, maxStack: 1, usable: false, sellPrice: 0,
  },
  {
    id: 'mask_broken', name: 'Broken Mask', nameCN: '破碎的面具',
    type: 'tsf_trigger', description: '一张裂开的能面面具。裂缝中渗出微光。触碰它时，世界似乎闪烁了一下。', usage: 'TSF触发物',
    icon: '🎭', quantity: 1, maxStack: 1, usable: true, sellPrice: 0,
  },
  {
    id: 'mirror_antique', name: 'Antique Mirror', nameCN: '古镜',
    type: 'tsf_trigger', description: '一面古老的铜镜。镜中的倒影似乎比你慢半拍——不，是快半拍。', usage: 'TSF触发物',
    icon: '🪞', quantity: 1, maxStack: 1, usable: true, sellPrice: 0,
  },

  // === EQUIPMENT ===
  {
    id: 'glasses_truth', name: 'Truth Glasses', nameCN: '真实眼镜',
    type: 'equipment', description: '戴上后，你能看到人们身上的"异常"。', usage: '感知 +5 侵蚀 +2',
    icon: '👓', quantity: 1, maxStack: 1, usable: true, sellPrice: 50,
  },
  {
    id: 'amulet_protect', name: 'Protective Amulet', nameCN: '守护护符',
    type: 'equipment', description: '神社的护身符。能减轻"常识改写"的影响。', usage: '侵蚀抵抗 +3',
    icon: '🪬', quantity: 1, maxStack: 1, usable: true, sellPrice: 30,
  },

  // === TSF TRANSFORMATION ITEMS ===
  {
    id: 'potion_gender', name: 'Gender Shift Potion', nameCN: '性别转换药水',
    type: 'tsf_trigger', description: '一瓶泛着粉色光芒的药水。标签上写着"小心使用"', usage: 'TSF: 性别转换',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_gender'],
  },
  {
    id: 'potion_age', name: 'Age Shift Potion', nameCN: '年龄转换药水',
    type: 'tsf_trigger', description: '一瓶泛着蓝色光芒的药水。气味像是童年夏天的记忆。', usage: 'TSF: 年龄变化',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_age'],
  },
  {
    id: 'pen_memory', name: 'Memory Rewrite Pen', nameCN: '记忆改写笔',
    type: 'tsf_trigger', description: '一支看似普通的钢笔。用它在纸上写字，那些文字就会变成"现实"。', usage: 'TSF: 记忆改写',
    icon: '🖊️', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_memory'],
  },
  {
    id: 'card_identity', name: 'Identity Card', nameCN: '空白身份卡',
    type: 'tsf_trigger', description: '一张空白的身份卡。你可以在上面写下任何身份，然后它就会变成真的。', usage: 'TSF: 身份改写',
    icon: '🪪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_identity'],
  },
  {
    id: 'perfume_charm', name: 'Charm Perfume', nameCN: '魅惑香水',
    type: 'tsf_trigger', description: '一瓶散发着诱人香气的香水。喷上后周围的人会对你更加……友善。', usage: 'TSF: 魅力提升',
    icon: '🧴', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_charm'],
  },
  {
    id: 'collar_change', name: 'Reality Collar', nameCN: '现实改写项圈',
    type: 'tsf_trigger', description: '戴上它后，你说出的话会成为"现实"。项圈上刻着古文字。', usage: 'TSF: 现实改写',
    icon: '📿', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_reality'],
  },
  {
    id: 'earphones_hypno', name: 'Hypnosis Earphones', nameCN: '催眠耳机',
    type: 'tsf_trigger', description: '一副时尚的无线耳机。播放的音频含有潜意识暗示——对你同样有效。', usage: 'TSF: 自我催眠',
    icon: '🎧', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_hypnosis'],
  },
  {
    id: 'book_reality', name: 'Reality Editing Book', nameCN: '现实编辑手册',
    type: 'tsf_trigger', description: '一本空白的书。你在上面写的每一句话，都会在现实中发生。', usage: 'TSF: 现实编辑',
    icon: '📕', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_edit'],
  },

  // === 种族转换类（6个）===
  {
    id: 'potion_slime', name: 'Slime Serum', nameCN: '史莱姆血清',
    type: 'tsf_trigger', description: '一管绿色荧光液体。注射后身体会变得半透明、可塑。', usage: 'TSF: 转换为史莱姆娘',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_species', 'tsf_to_slime'],
  },
  {
    id: 'potion_kitsune', name: 'Fox Spirit Essence', nameCN: '狐灵精华',
    type: 'tsf_trigger', description: '散发着金色光芒的液体。喝下后身体会变得轻盈，指尖开始长出绒毛。', usage: 'TSF: 转换为狐妖',
    icon: '✨', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_species', 'tsf_to_kitsune'],
  },
  {
    id: 'potion_vampire', name: 'Crimson Elixir', nameCN: '深红灵药',
    type: 'tsf_trigger', description: '暗红色的液体在瓶中微微发光。喝下后你会感受到永恒的冰冷。', usage: 'TSF: 转换为吸血鬼',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_species', 'tsf_to_vampire'],
  },
  {
    id: 'potion_succubus', name: 'Nightmare Essence', nameCN: '梦魇精华',
    type: 'tsf_trigger', description: '紫色的雾气从瓶口溢出。吸入后你的魅惑能力会大幅提升。', usage: 'TSF: 转换为魅魔',
    icon: '🌙', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_species', 'tsf_to_succubus'],
  },
  {
    id: 'potion_dragon', name: 'Dragon Scale Extract', nameCN: '龙鳞萃取液',
    type: 'tsf_trigger', description: '金色的液体中漂浮着细小的鳞片。喝下后全身会覆盖坚硬的鳞甲。', usage: 'TSF: 转换为龙娘',
    icon: '🐉', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_species', 'tsf_to_dragon'],
  },
  {
    id: 'potion_nekomata', name: 'Catnip Concentrate', nameCN: '猫薄荷浓缩液',
    type: 'tsf_trigger', description: '一瓶散发着猫薄荷香气的液体。喝下后会很想舔自己的手。', usage: 'TSF: 转换为猫又',
    icon: '🐱', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_species', 'tsf_to_nekomata'],
  },

  // === 性别改造类（3个）===
  {
    id: 'potion_male', name: 'Masculine Draft', nameCN: '雄性药剂',
    type: 'tsf_trigger', description: '一瓶散发着麝香的深色药剂。喝下后身体会朝着男性方向変化。', usage: 'TSF: 转换为男性',
    icon: '⚗️', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_gender', 'tsf_to_male'],
  },
  {
    id: 'potion_futanari', name: 'Dual Essence', nameCN: '双性精华',
    type: 'tsf_trigger', description: '一瓶粉藍雙色分層的液体。據說能让人同時擁有兩性特徵。', usage: 'TSF: 转换为双性',
    icon: '⚗️', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_gender', 'tsf_to_futanari'],
  },
  {
    id: 'potion_gynesex', name: 'Sterility Formula', nameCN: '無性化配方',
    type: 'tsf_trigger', description: '一瓶透明的液体。喝下后性別特徵會逐漸消退，變得中性。', usage: 'TSF: 转换为无性',
    icon: '⚗️', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_gender', 'tsf_to_neuter'],
  },

  // === 年龄改造类（3个）===
  {
    id: 'potion_teen', name: 'Youth Potion', nameCN: '青春薬水',
    type: 'tsf_trigger', description: '一瓶泛着橙色光芒的药水。喝下后身体会回到青少年时期。', usage: 'TSF: 转换为少年/少女',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_age', 'tsf_teen'],
  },
  {
    id: 'potion_elder', name: 'Elder Decoction', nameCN: '衰老煎剂',
    type: 'tsf_trigger', description: '冒着灰色泡沫的液体。喝下后会加速老化。', usage: 'TSF: 转换为老年',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_age', 'tsf_elder'],
  },
  {
    id: 'candy_growth', name: 'Growth Candy', nameCN: '成長糖果',
    type: 'tsf_trigger', description: '一颗彩色的棒棒糖。舔一口就會長高5公分——直到變成大人。', usage: 'TSF: 转换为成年/巨人',
    icon: '🍭', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_age', 'tsf_growth'],
  },

  // === 記憶/人格改造類（5个）===
  {
    id: 'pencil_rewrite', name: 'Memory Pencil', nameCN: '記憶鉛筆',
    type: 'tsf_trigger', description: '用這支鉛筆寫下的文字，會成為對方"真正的記憶"。', usage: 'TSF: 改寫記憶',
    icon: '✏️', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_memory', 'tsf_rewrite'],
  },
  {
    id: 'spray_friendship', name: 'Friendship Spray', nameCN: '友好噴霧',
    type: 'tsf_trigger', description: '噴灑後，周圍的人會把你當作「最好的朋友」來對待。', usage: 'TSF: 關係改寫',
    icon: '🧴', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_relationship'],
  },
  {
    id: 'device_personality', name: 'Personality Editor', nameCN: '人格編輯器',
    type: 'tsf_trigger', description: '一個手持裝置，可以讀取並編輯目標的人格參數。', usage: 'TSF: 人格改寫',
    icon: '📱', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_personality'],
  },
  {
    id: 'ring_obedience', name: 'Ring of Obedience', nameCN: '服從之戒',
    type: 'tsf_trigger', description: '戴上這枚戒指的人會對戒指持有者絕對服從。', usage: 'TSF: 服從控制',
    icon: '💍', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_control'],
  },
  {
    id: 'book_world', name: 'World Editing Book', nameCN: '世界編輯書',
    type: 'tsf_trigger', description: '一本厚重的書。你在上面寫下的每一段描述，都會成為這個世界的"事實"。', usage: 'TSF: 現實改寫',
    icon: '📖', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_reality'],
  },

  // === 身體改造類（6个）===
  {
    id: 'serum_tail', name: 'Tail Growth Serum', nameCN: '尾巴生長血清',
    type: 'tsf_trigger', description: '注射後尾椎會開始生長，長出你想要的任何尾巴。', usage: 'TSF: 尾巴生成',
    icon: '💉', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_body', 'tsf_tail'],
  },
  {
    id: 'drops_ear', name: 'Ear Transformation Drops', nameCN: '耳朵變形滴剂',
    type: 'tsf_trigger', description: '滴入耳朵後，你的耳朵會逐漸變成你選擇的形狀。', usage: 'TSF: 獸耳化',
    icon: '💧', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_body', 'tsf_ears'],
  },
  {
    id: 'cream_skin', name: 'Skin Texture Cream', nameCN: '肌膚質感霜',
    type: 'tsf_trigger', description: '塗抹後皮膚會變成你想要的質感——絲滑、鱗片、絨毛或膠狀。', usage: 'TSF: 皮膚改造',
    icon: '🧴', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_body', 'tsf_skin'],
  },
  {
    id: 'potion_wing', name: 'Wing Growth Potion', nameCN: '翅膀生長藥水',
    type: 'tsf_trigger', description: '喝下後肩胛骨會開始疼痛，然後長出翅膀。', usage: 'TSF: 翅膀生成',
    icon: '🧪', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_body', 'tsf_wing'],
  },
  {
    id: 'patch_height', name: 'Height Adjust Patch', nameCN: '身高調整貼片',
    type: 'tsf_trigger', description: '貼在頭頂。可以設定目標身高，身體會在24小時內調整到該高度。', usage: 'TSF: 身高變化',
    icon: '🩹', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_body', 'tsf_height'],
  },
  {
    id: 'ring_voice', name: 'Voice Changer Ring', nameCN: '變聲戒指',
    type: 'tsf_trigger', description: '戴上後可以自由改變聲音。戴太久的話——聲音可能會固定下來。', usage: 'TSF: 聲線改變',
    icon: '💍', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_body', 'tsf_voice'],
  },

  // === 特殊物品（3个）===
  {
    id: 'key_universe', name: 'Universal Key', nameCN: '萬能鑰匙',
    type: 'key_item', description: '一把能打開任何門的鑰匙。包括「常識」這道門。', usage: '解鎖所有區域',
    icon: '🗝️', quantity: 1, maxStack: 1, usable: false, sellPrice: 0, flags: ['tsf_meta'],
  },
  {
    id: 'mirror_copy', name: 'Copy Mirror', nameCN: '複製鏡',
    type: 'tsf_trigger', description: '將鏡子對準某人，可以複製對方的外表。', usage: 'TSF: 外貌複製',
    icon: '🪞', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_appearance'],
  },
  {
    id: 'book_identity', name: 'Identity Switch Book', nameCN: '身份切換書',
    type: 'tsf_trigger', description: '在書上寫下兩個名字，他們的社會身份會互換。', usage: 'TSF: 身份交換',
    icon: '📕', quantity: 1, maxStack: 1, usable: true, sellPrice: 0, flags: ['tsf_identity_swap'],
  },
];

export function getInitialItems(): GameItemDef[] {
  return MISC_ITEMS;
}

export function getItemById(id: string): GameItemDef | undefined {
  return MISC_ITEMS.find(i => i.id === id);
}
