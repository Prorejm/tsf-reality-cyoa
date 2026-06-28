// ===== 扩展槽位默认配置 =====
// 供模组/扩展内容使用的预留插槽

export interface ExpansionSlot {
  id: string;
  type: 'zone' | 'scene' | 'character' | 'event' | 'item' | 'discovery' | 'transformation' | 'ending' | 'puzzle';
  slotIndex: number;
  reservedFor: string;
  description: string;
  isActive: boolean;
  defaultConfig: Record<string, unknown>;
}

export const expansionSlots: ExpansionSlot[] = [
  // 区域扩展槽
  { id: 'exp_zone_01', type: 'zone', slotIndex: 3, reservedFor: 'future_zone_1', description: '预留第4个区域——可能的海滨区或地下区', isActive: false, defaultConfig: { erosionRange: [40, 80], unlockErosion: 45 } },
  { id: 'exp_zone_02', type: 'zone', slotIndex: 4, reservedFor: 'future_zone_2', description: '预留第5个区域——梦境领域或镜中世界', isActive: false, defaultConfig: { erosionRange: [50, 90], unlockErosion: 60 } },

  // 场景扩展槽
  { id: 'exp_scene_01', type: 'scene', slotIndex: 18, reservedFor: 'future_scene_1', description: '预留场景——旅馆（中央商业区）', isActive: false, defaultConfig: { zone: 'central_district' } },
  { id: 'exp_scene_02', type: 'scene', slotIndex: 19, reservedFor: 'future_scene_2', description: '预留场景——地下街（边界街区）', isActive: false, defaultConfig: { zone: 'border_district' } },
  { id: 'exp_scene_03', type: 'scene', slotIndex: 20, reservedFor: 'future_scene_3', description: '预留场景——天文台（扭曲核心）', isActive: false, defaultConfig: { zone: 'distortion_core' } },
  { id: 'exp_scene_04', type: 'scene', slotIndex: 21, reservedFor: 'future_scene_4', description: '预留场景——电影院（中央商业区）', isActive: false, defaultConfig: { zone: 'central_district' } },

  // 角色扩展槽
  { id: 'exp_char_01', type: 'character', slotIndex: 10, reservedFor: 'future_npc_1', description: '预留NPC——猫娘咖啡厅服务员', isActive: false, defaultConfig: { type: 'monster_girl', location: 'cafe' } },
  { id: 'exp_char_02', type: 'character', slotIndex: 11, reservedFor: 'future_npc_2', description: '预留NPC——鸟身女妖邮递员', isActive: false, defaultConfig: { type: 'monster_girl', location: 'shopping_street' } },
  { id: 'exp_char_03', type: 'character', slotIndex: 12, reservedFor: 'future_npc_3', description: '预留NPC——半人马体育老师', isActive: false, defaultConfig: { type: 'monster_girl', location: 'school' } },
  { id: 'exp_char_04', type: 'character', slotIndex: 13, reservedFor: 'future_npc_4', description: '预留NPC——梦魔心理咨询师', isActive: false, defaultConfig: { type: 'monster_girl', location: 'hospital' } },

  // 事件扩展槽
  { id: 'exp_event_01', type: 'event', slotIndex: 20, reservedFor: 'future_event_1', description: '预留事件——旅馆的奇夜', isActive: false, defaultConfig: { scene: 'hotel' } },
  { id: 'exp_event_02', type: 'event', slotIndex: 21, reservedFor: 'future_event_2', description: '预留事件——地下街的拍卖会', isActive: false, defaultConfig: { scene: 'underground_street' } },
  { id: 'exp_event_03', type: 'event', slotIndex: 22, reservedFor: 'future_event_3', description: '预留事件——天文台的观测', isActive: false, defaultConfig: { scene: 'observatory' } },
  { id: 'exp_event_04', type: 'event', slotIndex: 23, reservedFor: 'future_event_4', description: '预留事件——电影院的幻觉', isActive: false, defaultConfig: { scene: 'cinema' } },
  { id: 'exp_event_05', type: 'event', slotIndex: 24, reservedFor: 'future_event_5', description: '预留事件——额外的身份改写事件', isActive: false, defaultConfig: {} },
  { id: 'exp_event_06', type: 'event', slotIndex: 25, reservedFor: 'future_event_6', description: '预留事件——额外的坏结局检查事件', isActive: false, defaultConfig: {} },

  // 物品扩展槽
  { id: 'exp_item_01', type: 'item', slotIndex: 16, reservedFor: 'future_item_1', description: '预留物品——记忆瓶', isActive: false, defaultConfig: { type: 'key_item' } },
  { id: 'exp_item_02', type: 'item', slotIndex: 17, reservedFor: 'future_item_2', description: '预留物品——结界碎片', isActive: false, defaultConfig: { type: 'equipment' } },
  { id: 'exp_item_03', type: 'item', slotIndex: 18, reservedFor: 'future_item_3', description: '预留物品——龙鳞护符', isActive: false, defaultConfig: { type: 'equipment' } },
  { id: 'exp_item_04', type: 'item', slotIndex: 19, reservedFor: 'future_item_4', description: '预留TSF触发器物品', isActive: false, defaultConfig: { type: 'tsf_trigger' } },
  { id: 'exp_item_05', type: 'item', slotIndex: 20, reservedFor: 'future_item_5', description: '预留TSF触发器物品', isActive: false, defaultConfig: { type: 'tsf_trigger' } },

  // 发现物扩展槽
  { id: 'exp_disc_01', type: 'discovery', slotIndex: 15, reservedFor: 'future_discovery_1', description: '预留发现物', isActive: false, defaultConfig: { category: 'reality_tear' } },
  { id: 'exp_disc_02', type: 'discovery', slotIndex: 16, reservedFor: 'future_discovery_2', description: '预留发现物', isActive: false, defaultConfig: { category: 'monster_hidden' } },
  { id: 'exp_disc_03', type: 'discovery', slotIndex: 17, reservedFor: 'future_discovery_3', description: '预留发现物', isActive: false, defaultConfig: { category: 'identity_swap' } },

  // 转化扩展槽
  { id: 'exp_trans_01', type: 'transformation', slotIndex: 5, reservedFor: 'future_transform_1', description: '预留转化——吸血鬼化', isActive: false, defaultConfig: { type: 'Vampire' } },
  { id: 'exp_trans_02', type: 'transformation', slotIndex: 6, reservedFor: 'future_transform_2', description: '预留转化——人偶化', isActive: false, defaultConfig: { type: 'Doll' } },
  { id: 'exp_trans_03', type: 'transformation', slotIndex: 7, reservedFor: 'future_transform_3', description: '预留转化——龙化', isActive: false, defaultConfig: { type: 'Dragon' } },

  // 结局扩展槽
  { id: 'exp_end_01', type: 'ending', slotIndex: 7, reservedFor: 'future_ending_1', description: '预留普通结局', isActive: false, defaultConfig: { type: 'normal' } },
  { id: 'exp_end_02', type: 'ending', slotIndex: 8, reservedFor: 'future_ending_2', description: '预留普通结局', isActive: false, defaultConfig: { type: 'normal' } },
  { id: 'exp_end_03', type: 'ending', slotIndex: 12, reservedFor: 'future_badend_1', description: '预留BAD END', isActive: false, defaultConfig: { type: 'bad_end' } },
  { id: 'exp_end_04', type: 'ending', slotIndex: 13, reservedFor: 'future_badend_2', description: '预留BAD END', isActive: false, defaultConfig: { type: 'bad_end' } },
  { id: 'exp_end_05', type: 'ending', slotIndex: 14, reservedFor: 'future_badend_3', description: '预留BAD END', isActive: false, defaultConfig: { type: 'bad_end' } },

  // 谜题扩展槽
  { id: 'exp_puzzle_01', type: 'puzzle', slotIndex: 5, reservedFor: 'future_puzzle_1', description: '预留谜题——迷宫', isActive: false, defaultConfig: { type: 'jigsaw' } },
  { id: 'exp_puzzle_02', type: 'puzzle', slotIndex: 6, reservedFor: 'future_puzzle_2', description: '预留谜题——符文解码', isActive: false, defaultConfig: { type: 'code_cracker' } },
];

export default expansionSlots;
