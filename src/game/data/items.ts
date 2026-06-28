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
];

export function getInitialItems(): GameItemDef[] {
  return MISC_ITEMS;
}

export function getItemById(id: string): GameItemDef | undefined {
  return MISC_ITEMS.find(i => i.id === id);
}
