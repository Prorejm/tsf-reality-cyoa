// ===== 14天日程事件 =====

export type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export interface ScheduleEvent {
  day: number;          // 第1-14天
  period: DayPeriod;
  eventId: string;      // 觸發的事件ID
  type: 'story' | 'character' | 'random' | 'trigger_check';
  conditions: {
    minErosion?: number;
    maxErosion?: number;
    minAwareness?: number;
    requiredFlags?: string[];
    requiredEvents?: string[];
  };
  description: string;
  priority: number;     // 優先級（高優先級強制觸發）
}

export const scheduleEvents: ScheduleEvent[] = [

  // === 第1天：初始 ===
  { day: 1, period: 'morning', eventId: 'intro_home', type: 'story', conditions: {}, description: '你在自己的房間中醒來。今天有些不一樣——但你說不上來哪裡不對。', priority: 10 },
  { day: 1, period: 'afternoon', eventId: 'intro_neighborhood', type: 'story', conditions: {}, description: '你出門散步，發現街角的便利店來了一位新的店員。', priority: 5 },
  { day: 1, period: 'evening', eventId: 'subway_anomaly', type: 'story', conditions: { minErosion: 10 }, description: '你第一次注意到地鐵站的異常。', priority: 3 },

  // === 第2天 ===
  { day: 2, period: 'morning', eventId: 'conv_store_midnight', type: 'character', conditions: {}, description: '你決定再去便利店看看。小翠在值班。', priority: 3 },
  { day: 2, period: 'afternoon', eventId: 'school_old_records', type: 'story', conditions: {}, description: '你有事去了一趟學校——或者只是經過。', priority: 2 },
  { day: 2, period: 'night', eventId: 'park_swing', type: 'story', conditions: {}, description: '夜晚的公園——鞦韆在無人擺動。', priority: 2 },

  // === 第3天 ===
  { day: 3, period: 'morning', eventId: 'bookstore_recurring', type: 'character', conditions: {}, description: '你走進舊書店。老人抬頭看了你一眼。', priority: 3 },
  { day: 3, period: 'afternoon', eventId: 'flower_shop', type: 'character', conditions: {}, description: '你經過花店——花香吸引了你。', priority: 2 },
  { day: 3, period: 'evening', eventId: 'tailor_recurring', type: 'character', conditions: { minErosion: 15 }, description: '你路过裁縫店——老裁縫在門口看著你。', priority: 2 },

  // === 第4天 ===
  { day: 4, period: 'morning', eventId: 'yamada_confession', type: 'character', conditions: { minErosion: 15 }, description: '山田老師約你放學後談話。', priority: 4 },
  { day: 4, period: 'afternoon', eventId: 'fortune_reading', type: 'character', conditions: { minErosion: 20 }, description: '你找到了商店街深處的占卜店。蛇目在等你。', priority: 3 },
  { day: 4, period: 'night', eventId: 'bar_test_completed', type: 'character', conditions: { minErosion: 30 }, description: '你走進酒吧——夜魅對你微笑。', priority: 3 },

  // === 第5天 ===
  { day: 5, period: 'morning', eventId: 'hospital_secret_learned', type: 'character', conditions: { minErosion: 25 }, description: '你以探病為由進入了醫院。血月在護士站看著你。', priority: 3 },
  { day: 5, period: 'afternoon', eventId: 'library_forbidden', type: 'story', conditions: { minErosion: 20 }, description: '圖書館的二樓——你發現了一扇以前沒注意到的門。', priority: 3 },
  { day: 5, period: 'evening', eventId: 'garden_secret', type: 'character', conditions: { minErosion: 20 }, description: '花音邀請你參觀溫室。', priority: 4 },

  // === 第6天 ===
  { day: 6, period: 'morning', eventId: 'gender_shift_event', type: 'story', conditions: { minErosion: 25 }, description: '課堂上——你的身體發生了變化。', priority: 5 },
  { day: 6, period: 'afternoon', eventId: 'doll_awakening', type: 'character', conditions: { minErosion: 25 }, description: '你走進玩偶店——店裡的氛圍有些不一樣。', priority: 3 },
  { day: 6, period: 'night', eventId: 'hospital_night_patrol', type: 'character', conditions: { minErosion: 30 }, description: '夜間的醫院——血月在等你。', priority: 4 },

  // === 第7天 ===
  { day: 7, period: 'morning', eventId: 'kitsune_reveal', type: 'character', conditions: { minErosion: 35 }, description: '神社的結界出現了裂縫。狐鈴需要你的幫助。', priority: 5 },
  { day: 7, period: 'afternoon', eventId: 'pool_mermaid', type: 'story', conditions: { minErosion: 30 }, description: '游泳館的水面下——有什麼東西在游動。', priority: 2 },
  { day: 7, period: 'evening', eventId: 'werewolf_trust', type: 'character', conditions: { minErosion: 30 }, description: '老狼在巡邏時叫住了你——「聊聊？」', priority: 3 },

  // === 第8天 ===
  { day: 8, period: 'morning', eventId: 'identity_rewrite', type: 'story', conditions: { minErosion: 35 }, description: '你回到「家」——但門鎖變了。', priority: 5 },
  { day: 8, period: 'afternoon', eventId: 'fortune_crossroads', type: 'character', conditions: { minErosion: 30 }, description: '你再次拜訪蛇目——她說你必須做出選擇。', priority: 4 },
  { day: 8, period: 'night', eventId: 'succubus_deal', type: 'character', conditions: { minErosion: 35 }, description: '夜魅提出了一筆交易。', priority: 4 },

  // === 第9天 ===
  { day: 9, period: 'morning', eventId: 'alraune_reveal', type: 'character', conditions: { minErosion: 40 }, description: '花音在溫室中向你展示了她的真身。', priority: 5 },
  { day: 9, period: 'afternoon', eventId: 'office_id_shift', type: 'story', conditions: { minErosion: 35 }, description: '廢棄辦公室的門——今天開著。', priority: 3 },
  { day: 9, period: 'night', eventId: 'bar_quiz', type: 'character', conditions: { minErosion: 40 }, description: '夜魅的三個問題——你的答案決定一切。', priority: 4 },

  // === 第10天 ===
  { day: 10, period: 'morning', eventId: 'dragon_reveal', type: 'character', conditions: { minErosion: 50 }, description: '你被邀請到市政廳——龍映要見你。', priority: 5 },
  { day: 10, period: 'afternoon', eventId: 'lamia_reveal', type: 'character', conditions: { minErosion: 40 }, description: '你請求蛇目展示真身。她猶豫了一下，然後同意了。', priority: 4 },
  { day: 10, period: 'evening', eventId: 'vampire_reveal', type: 'character', conditions: { minErosion: 40 }, description: '你在血庫撞見了血月。', priority: 4 },

  // === 第11天 ===
  { day: 11, period: 'morning', eventId: 'yamada_awakening', type: 'character', conditions: { minErosion: 45, requiredEvents: ['yamada_confession'] }, description: '山田老師做了決定——他要找回真正的自己。', priority: 4 },
  { day: 11, period: 'afternoon', eventId: 'barrier_ritual', type: 'story', conditions: { minErosion: 50 }, description: '狐鈴需要你的力量來強化神社的結界。', priority: 4 },
  { day: 11, period: 'night', eventId: 'real_festival_event', type: 'story', conditions: { minErosion: 50 }, description: '你收到了魅魔的邀請函——真正的宴會開始了。', priority: 5 },

  // === 第12天 ===
  { day: 12, period: 'morning', eventId: 'city_hall_secrets', type: 'story', conditions: { minErosion: 55 }, description: '你深入市政廳——尋找理事會的真相。', priority: 4 },
  { day: 12, period: 'afternoon', eventId: 'mayor_audience', type: 'character', conditions: { minErosion: 55 }, description: '龍映單獨會見你——她攤牌了。', priority: 5 },
  { day: 12, period: 'night', eventId: 'doll_sanctuary', type: 'character', conditions: { minErosion: 45 }, description: '偶人帶你進入了玩偶庇護所。', priority: 3 },

  // === 第13天 ===
  { day: 13, period: 'morning', eventId: 'puzzle_reality_tear_qte', type: 'story', conditions: { minErosion: 70 }, description: '深淵回廊的能量爆發——現實撕裂。', priority: 5 },
  { day: 13, period: 'afternoon', eventId: 'final_preparations', type: 'story', conditions: { minErosion: 60 }, description: '準備階段——你需要在進入深淵回廊前做好最後的選擇。', priority: 5 },
  { day: 13, period: 'night', eventId: 'abyss_entrance', type: 'story', conditions: { minErosion: 70 }, description: '通往深淵的門——你站在邊緣。', priority: 5 },

  // === 第14天：最终日 ===
  { day: 14, period: 'morning', eventId: 'final_choice', type: 'story', conditions: {}, description: '你站在深淵回廊的核心。這是最後的選擇。', priority: 10 },
  { day: 14, period: 'afternoon', eventId: 'ending_route', type: 'story', conditions: {}, description: '根據你的所有選擇——結局揭曉。', priority: 10 },
  { day: 14, period: 'evening', eventId: 'epilogue', type: 'story', conditions: {}, description: '尾聲。', priority: 10 },
  { day: 14, period: 'night', eventId: 'credits', type: 'story', conditions: {}, description: '製作人員名單。', priority: 10 },

  // === 角色遭遇（多日可觸發）===
  { day: 2, period: 'night', eventId: 'slime_girl_night_shift', type: 'character', conditions: { requiredEvents: ['conv_store_midnight'] }, description: '深夜的便利店——小翠的夜班。', priority: 1 },
  { day: 4, period: 'night', eventId: 'werewolf_moon', type: 'character', conditions: { requiredFlags: ['werewolf_trust'] }, description: '月圓之夜——老狼的變身。', priority: 2 },
  { day: 6, period: 'afternoon', eventId: 'cafe_secret_menu', type: 'trigger_check', conditions: { minAwareness: 20 }, description: '咖啡廳的隱藏菜單——你終於注意到了。', priority: 1 },
  { day: 8, period: 'evening', eventId: 'tailor_special_order', type: 'character', conditions: { requiredEvents: ['tailor_measured'] }, description: '裁縫做好了你的「特殊訂製」衣服。', priority: 1 },
  { day: 10, period: 'morning', eventId: 'contradiction_check', type: 'trigger_check', conditions: { minAwareness: 40 }, description: '你的感知達到了新的水平——世界在你眼中不再一樣。', priority: 2 },
  { day: 12, period: 'afternoon', eventId: 'slime_reveal', type: 'character', conditions: { requiredEvents: ['conv_store_midnight'] }, description: '小翠在你面前不再偽裝。', priority: 3 },
];

export default scheduleEvents;
