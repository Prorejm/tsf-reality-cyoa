// ===== TSF触发器物品 → 监听器绑定配置 =====

export interface TriggerBinding {
  itemId: string;
  triggerEventId: string;
  listenerType: 'scene_enter' | 'scene_exit' | 'item_use' | 'time_check' | 'erosion_check';
  checkInterval?: number;  // 检查间隔（分钟）
  oneTimeOnly: boolean;
  cooldownDays?: number;
  priority: number;
  enabled: boolean;
  description: string;
}

export const triggerBindings: TriggerBinding[] = [
  {
    itemId: 'pregnancy_charm',
    triggerEventId: 'pregnancy_memory_event',
    listenerType: 'time_check',
    checkInterval: 30,
    oneTimeOnly: true,
    priority: 5,
    enabled: true,
    description: '孕妇专座咒文纸条 - 傍晚地铁站触发记忆改写事件',
  },
  {
    itemId: 'faded_wedding_photo',
    triggerEventId: 'wedding_memory_shift',
    listenerType: 'scene_enter',
    oneTimeOnly: true,
    priority: 5,
    enabled: true,
    description: '褪色的结婚照 - 进入住宅区时触发身份改写',
  },
  {
    itemId: 'bloody_nurse_cap',
    triggerEventId: 'nurse_identity_shift',
    listenerType: 'time_check',
    checkInterval: 20,
    oneTimeOnly: true,
    priority: 5,
    enabled: true,
    description: '沾血的护士帽 - 夜间医院触发护士身份改写',
  },
  {
    itemId: 'kitsune_mask',
    triggerEventId: 'kitsune_transformation_event',
    listenerType: 'scene_enter',
    oneTimeOnly: false,
    cooldownDays: 3,
    priority: 4,
    enabled: true,
    description: '狐之面具 - 进入神社触发狐妖转化加速',
  },
  {
    itemId: 'blank_employee_card',
    triggerEventId: 'office_identity_shift',
    listenerType: 'scene_enter',
    oneTimeOnly: true,
    priority: 5,
    enabled: true,
    description: '空白的员工证 - 下午进入废弃办公楼触发身份改写',
  },
  {
    itemId: 'mermaid_scale',
    triggerEventId: 'mermaid_transform_event',
    listenerType: 'scene_enter',
    oneTimeOnly: true,
    priority: 4,
    enabled: true,
    description: '人鱼之鳞 - 进入游泳馆触发人鱼化事件',
  },
  {
    itemId: 'old_school_key',
    triggerEventId: 'old_school_reality_tear',
    listenerType: 'time_check',
    checkInterval: 15,
    oneTimeOnly: true,
    priority: 5,
    enabled: true,
    description: '旧校舍的钥匙 - 夜间学校触发现实撕裂',
  },
  {
    itemId: 'succubus_invitation',
    triggerEventId: 'real_festival_event',
    listenerType: 'scene_enter',
    oneTimeOnly: true,
    priority: 5,
    enabled: true,
    description: '魅魔的邀请函 - 夜间进入酒吧触发真实之宴',
  },
  {
    itemId: 'cursed_ring',
    triggerEventId: 'ring_erosion_boost',
    listenerType: 'erosion_check',
    checkInterval: 1440, // 每天检查一次
    oneTimeOnly: false,
    priority: 2,
    enabled: true,
    description: '诅咒戒指 - 每天增加侵蚀率并提升感知',
  },
];

export default triggerBindings;
