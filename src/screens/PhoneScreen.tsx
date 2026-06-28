// ============================================================================
// PhoneScreen — 游戏内智能手机界面
// 现实风格的手机界面，包含 8 个内置应用
// ============================================================================

import React, { useState, useCallback, useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';
import type { SceneId } from '@/game/engine/types';

// ─── Props ───────────────────────────────────────────────────────────

interface PhoneScreenProps {
  /** 关闭手机界面 */
  onClose: () => void;
}

// ─── 应用定义 ────────────────────────────────────────────────────────

type AppId =
  | 'camera'
  | 'map'
  | 'notes'
  | 'encyclopedia'
  | 'gallery'
  | 'settings'
  | 'clock'
  | 'messages'
  | 'appstore';

interface AppDefinition {
  id: AppId;
  name: string;
  icon: string; // emoji用作应用图标
  gradient: string; // 图标渐变背景
  badge?: number; // 角标数字
}

const APPS: AppDefinition[] = [
  { id: 'camera', name: '相机', icon: '📷', gradient: 'from-gray-600 to-gray-800' },
  { id: 'map', name: '地图', icon: '🗺️', gradient: 'from-green-500 to-emerald-700' },
  { id: 'notes', name: '笔记', icon: '📝', gradient: 'from-yellow-500 to-amber-700' },
  { id: 'encyclopedia', name: '图鉴', icon: '📖', gradient: 'from-purple-500 to-violet-700' },
  { id: 'gallery', name: '相册', icon: '🖼️', gradient: 'from-pink-500 to-rose-700' },
  { id: 'settings', name: '设置', icon: '⚙️', gradient: 'from-gray-500 to-slate-700' },
  { id: 'clock', name: '时钟', icon: '🕐', gradient: 'from-blue-500 to-indigo-700' },
  { id: 'messages', name: '信息', icon: '💬', gradient: 'from-teal-500 to-cyan-700', badge: 2 },
  { id: 'appstore', name: '应用商店', icon: '📲', gradient: 'from-blue-600 to-blue-800' },
];

// ─── 场景数据（用于地图应用） ──────────────────────────────────────

const SCENE_LOCATIONS: Record<string, { name: string; x: number; y: number }> = {
  home_bedroom: { name: '自家卧室', x: 20, y: 15 },
  subway_station: { name: '地铁站', x: 60, y: 40 },
  convenience_store: { name: '便利店', x: 75, y: 55 },
  residential_area: { name: '住宅区', x: 30, y: 45 },
  park: { name: '公园', x: 50, y: 50 },
  school: { name: '学校', x: 40, y: 30 },
  hospital: { name: '医院', x: 70, y: 35 },
  shopping_street: { name: '商店街', x: 55, y: 60 },
  bar: { name: '酒吧', x: 65, y: 70 },
  library: { name: '图书馆', x: 35, y: 55 },
  shrine: { name: '神社', x: 25, y: 30 },
  cafe: { name: '咖啡厅', x: 45, y: 65 },
  flower_shop: { name: '花店', x: 60, y: 45 },
  swimming_pool: { name: '游泳馆', x: 80, y: 50 },
  city_hall: { name: '市政大厅', x: 50, y: 25 },
  church: { name: '教堂', x: 40, y: 75 },
};

// ─── 默认消息数据 ───────────────────────────────────────────────────

interface MessageData {
  id: string;
  sender: string;
  content: string;
  time: string;
  read: boolean;
}

const DEFAULT_MESSAGES: MessageData[] = [
  { id: 'msg1', sender: '系统通知', content: '欢迎来到这座城市。请保持警惕，你所看到的并不一定是真实。', time: '今日 08:00', read: false },
  { id: 'msg2', sender: '匿名', content: '不要相信任何人的话。包括——你的手機。', time: '昨日 23:15', read: false },
  { id: 'msg3', sender: '狐鈴', content: '有空來神社坐坐嗎？有件事想跟你說。', time: '昨日 16:30', read: true },
  { id: 'msg4', sender: '小翠', content: '店裡新進了一批貨，有興趣來看看嗎？', time: '2天前', read: true },
];

// ─── 默认图鉴数据 ───────────────────────────────────────────────────

interface BestiaryEntry {
  id: string;
  nameCN: string;
  description: string;
  discovered: boolean;
  danger: number; // 1-5
}

const BESTIARY_ENTRIES: BestiaryEntry[] = [
  { id: 'slime', nameCN: '史莱姆娘', description: '身体由半透明凝胶构成。性格温和，具有极强的可塑性和再生能力。', discovered: true, danger: 1 },
  { id: 'kitsune', nameCN: '狐妖', description: '拥有多条尾巴的狐狸精。擅长幻术和结界术，是神社的守护者。', discovered: true, danger: 3 },
  { id: 'alraune', nameCN: '花妖', description: '植物的化身。本体是一株巨大的古老植物，花店老闆娘的真面目。', discovered: true, danger: 2 },
  { id: 'vampire', nameCN: '吸血鬼', description: '以血液为生的夜行性存在。优雅而危险，医院的夜班醫生。', discovered: false, danger: 4 },
  { id: 'succubus', nameCN: '魅魔', description: '以精气为食的恶魔。拥有极强的魅惑能力，酒吧的老闆娘。', discovered: true, danger: 4 },
  { id: 'dragon', nameCN: '龙娘', description: '东方巨龙的人形态。拥有改变现实的力量，市政厅的市长。', discovered: false, danger: 5 },
  { id: 'mermaid', nameCN: '人鱼', description: '拥有鱼尾的水中住民。歌声具有魔力，游泳馆的常客。', discovered: true, danger: 2 },
  { id: 'nekomata', nameCN: '猫又', description: '双尾猫妖。好奇心旺盛，喜欢惡作劇，偶爾會出現在商店街。', discovered: false, danger: 2 },
  { id: 'lamia', nameCN: '拉米亚', description: '上半身为人、下半身为蛇的存在。智慧而冷靜，古籍中常有記載。', discovered: false, danger: 3 },
];

// ─── 样式常量 ───────────────────────────────────────────────────────

const STATUS_BAR_HEIGHT = 20;
const HOME_INDICATOR_HEIGHT = 16;
const APP_ICON_SIZE = 52;

// ============================================================================
// PhoneScreen 组件
// ============================================================================

const PhoneScreen: React.FC<PhoneScreenProps> = ({ onClose }) => {
  const { state, dispatch } = useGame();

  // ── 状态 ──────────────────────────────────────────────────────────
  const [currentApp, setCurrentApp] = useState<AppId | null>(null);
  const [notesText, setNotesText] = useState('');
  const [photoCount] = useState(7); // 示例：已拍摄7张照片
  const [fontSize, setFontSize] = useState(2); // 1=小, 2=中, 3=大
  const [textSpeed, setTextSpeed] = useState(2); // 1=慢, 2=中, 3=快
  const [soundVolume, setSoundVolume] = useState(3); // 1-5
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedBestiary, setSelectedBestiary] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageData[]>(DEFAULT_MESSAGES);
  const [appStoreInstalling, setAppStoreInstalling] = useState<string | null>(null);
  const [ownedApps, setOwnedApps] = useState<string[]>(() => {
    const stored = state.flags?.['_phone_owned_apps'];
    return Array.isArray(stored) ? stored as string[] : [];
  });

  const currentDay = state.currentDay ?? 1;
  const currentPeriod = state.currentPeriod ?? 'morning';
  const currentScene = state.currentScene ?? 'home_bedroom';

  // ── 时段中文映射 ──────────────────────────────────────────────────
  const periodCN: Record<string, string> = {
    morning: '上午',
    afternoon: '下午',
    evening: '傍晚',
    night: '夜晚',
  };

  // ── 时钟时间计算 ──────────────────────────────────────────────────
  const clockTime = useMemo(() => {
    const baseHour = 6 + (currentPeriod === 'morning' ? 2 : currentPeriod === 'afternoon' ? 6 : currentPeriod === 'evening' ? 10 : 14);
    const hour = baseHour % 24;
    const minute = Math.floor(Math.random() * 60); // 模拟分钟
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }, [currentDay, currentPeriod]);

  // ── 手机顶部时间 ──────────────────────────────────────────────────
  const phoneTime = useMemo(() => clockTime, [clockTime]);

  // ── 返回主屏幕 ────────────────────────────────────────────────────
  const goToHome = useCallback(() => {
    setCurrentApp(null);
    setSelectedPhoto(null);
    setSelectedMessage(null);
    setSelectedBestiary(null);
  }, []);

  // ── 拍照 ──────────────────────────────────────────────────────────
  const handleTakePhoto = useCallback(() => {
    if (photoCount >= 20) return;
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_phone_notification', value: `已拍摄照片 (${photoCount + 1}/20)` },
    });
  }, [photoCount, dispatch]);

  // ── 导航到地图场景 ──────────────────────────────────────────────
  const handleNavigateToScene = useCallback(
    (sceneId: string) => {
      dispatch({ type: 'SET_SCENE', payload: sceneId as SceneId });
      goToHome();
    },
    [dispatch, goToHome],
  );

  // ── 标记消息已读 ──────────────────────────────────────────────────
  const handleReadMessage = useCallback((msgId: string) => {
    setSelectedMessage(msgId);
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, read: true } : m)),
    );
  }, []);

  // ── 未读消息数 ────────────────────────────────────────────────────
  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages],
  );

  // ── 安装应用商店应用 ─────────────────────────────────────────────
  const handleInstallApp = useCallback((appId: string, tsfItem?: string) => {
    setAppStoreInstalling(appId);
    setTimeout(() => {
      const newOwned = [...ownedApps, appId];
      setOwnedApps(newOwned);
      dispatch({ type: 'SET_FLAG', payload: { key: '_phone_owned_apps', value: newOwned } });
      if (tsfItem) {
        const itemMap: Record<string, any> = {
          earphones_hypno: { id: 'earphones_hypno', name: 'Hypnosis Earphones', nameCN: '催眠耳机', type: 'tsf_trigger', quantity: 1, maxStack: 1, usable: true, description: '一副时尚的无线耳机。播放的音频含有潜意识暗示——对你同样有效。', icon: '🎧', flags: ['tsf_hypnosis'] },
          book_reality: { id: 'book_reality', name: 'Reality Editing Book', nameCN: '现实编辑手册', type: 'tsf_trigger', quantity: 1, maxStack: 1, usable: true, description: '一本空白的书。你在上面写的每一句话，都会在现实中发生。', icon: '📕', flags: ['tsf_edit'] },
          card_identity: { id: 'card_identity', name: 'Identity Card', nameCN: '空白身份卡', type: 'tsf_trigger', quantity: 1, maxStack: 1, usable: true, description: '一张空白的身份卡。你可以在上面写下任何身份，然后它就会变成真的。', icon: '🪪', flags: ['tsf_identity'] },
          perfume_charm: { id: 'perfume_charm', name: 'Charm Perfume', nameCN: '魅惑香水', type: 'tsf_trigger', quantity: 1, maxStack: 1, usable: true, description: '一瓶散发着诱人香气的香水。喷上后周围的人会对你更加友善。', icon: '🧴', flags: ['tsf_charm'] },
        };
        if (itemMap[tsfItem]) dispatch({ type: 'ADD_ITEM', payload: itemMap[tsfItem] });
      }
      setAppStoreInstalling(null);
    }, 1500);
  }, [dispatch, ownedApps]);

  // ====================================================================
  // 应用子视图渲染
  // ====================================================================

  // ── 相机 ──────────────────────────────────────────────────────────
  const renderCameraApp = () => (
    <div className="flex flex-col h-full">
      {/* 取景器 */}
      <div className="flex-1 bg-black relative overflow-hidden">
        {/* 模拟取景画面 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        {/* 网格辅助线 */}
        <div className="absolute inset-0">
          <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10" />
        </div>
        {/* 对焦框 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-yellow-400/60 rounded" />
        {/* 顶部信息 */}
        <div className="absolute top-2 left-3 right-3 flex justify-between">
          <span className="text-xs text-white/70">{clockTime}</span>
          <span className="text-xs text-yellow-400">📸 {photoCount}/20</span>
        </div>
        {/* 底部控制栏 */}
        <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-8">
          <button className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs">
            ⚡
          </button>
          <button
            onClick={handleTakePhoto}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-white" />
          </button>
          <div className="w-10 h-10 rounded bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs">
            {photoCount}
          </div>
        </div>
      </div>
    </div>
  );

  // ── 地图 ──────────────────────────────────────────────────────────
  const renderMapApp = () => {
    const currentLocation = SCENE_LOCATIONS[currentScene];
    return (
      <div className="flex flex-col h-full">
        {/* 简易地图 */}
        <div className="flex-1 relative bg-gradient-to-b from-emerald-950 to-emerald-900 m-2 rounded-lg overflow-hidden">
          {/* 地图网格 */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`h${i}`} className="absolute left-0 right-0 h-px bg-white" style={{ top: `${(i + 1) * 12.5}%` }} />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-white" style={{ left: `${(i + 1) * 16.67}%` }} />
            ))}
          </div>

          {/* 场景标记 */}
          {Object.entries(SCENE_LOCATIONS).map(([sceneId, loc]) => {
            const isCurrent = sceneId === currentScene;
            return (
              <button
                key={sceneId}
                onClick={() => handleNavigateToScene(sceneId)}
                className={cn(
                  'absolute -translate-x-1/2 -translate-y-1/2 transition-all',
                  isCurrent
                    ? 'z-10'
                    : 'opacity-60 hover:opacity-100 hover:z-10',
                )}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                title={loc.name}
              >
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full border',
                    isCurrent
                      ? 'w-4 h-4 bg-blue-400 border-blue-300 shadow-lg shadow-blue-400/50 animate-pulse'
                      : 'bg-emerald-400 border-emerald-300',
                  )}
                />
                <span
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 whitespace-nowrap',
                    isCurrent ? 'top-4 text-[9px] text-blue-200 font-medium' : 'top-3 text-[7px] text-emerald-300/70',
                  )}
                >
                  {loc.name}
                </span>
              </button>
            );
          })}

          {/* 图例 */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[8px] text-white/40">
            <span>📍 当前位置</span>
            <span>点击标记前往</span>
          </div>
        </div>
      </div>
    );
  };

  // ── 笔记 ──────────────────────────────────────────────────────────
  const renderNotesApp = () => (
    <div className="flex flex-col h-full p-3">
      <textarea
        value={notesText}
        onChange={(e) => setNotesText(e.target.value)}
        placeholder="在此输入调查笔记..."
        className={cn(
          'flex-1 w-full bg-gray-900/60 border border-white/10 rounded-lg p-3 resize-none outline-none',
          'text-gray-200 placeholder-gray-600 leading-relaxed',
          'focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-colors',
          fontSize === 1 ? 'text-xs' : fontSize === 3 ? 'text-base' : 'text-sm',
        )}
      />
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] text-gray-500">
          {notesText.length > 0 ? `${notesText.length} 字` : '空白笔记'}
        </span>
        <span className="text-[10px] text-gray-600">第{currentDay}日</span>
      </div>
    </div>
  );

  // ── 图鉴 ──────────────────────────────────────────────────────────
  const renderEncyclopediaApp = () => (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b border-white/5">
        <span className="text-[10px] text-gray-500">
          已发现 {BESTIARY_ENTRIES.filter((e) => e.discovered).length}/{BESTIARY_ENTRIES.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {BESTIARY_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setSelectedBestiary(entry.discovered ? entry.id : null)}
            disabled={!entry.discovered}
            className={cn(
              'w-full text-left p-2.5 rounded-lg border transition-all',
              selectedBestiary === entry.id
                ? 'bg-purple-500/15 border-purple-400/30'
                : entry.discovered
                ? 'bg-gray-900/40 border-white/5 hover:bg-gray-800/40'
                : 'bg-gray-900/20 border-white/5 opacity-40 cursor-not-allowed',
            )}
          >
            <div className="flex items-center gap-2.5">
              {/* 头像 */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm border',
                  entry.discovered
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/10'
                    : 'bg-gray-800/50 border-gray-700/30',
                )}
              >
                <span className={entry.discovered ? 'text-purple-300' : 'text-gray-600'}>
                  {entry.discovered ? entry.nameCN.charAt(0) : '?'}
                </span>
              </div>
              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm', entry.discovered ? 'text-gray-200' : 'text-gray-600')}>
                    {entry.discovered ? entry.nameCN : '???'}
                  </span>
                  {/* 危险等级 */}
                  {entry.discovered && (
                    <span className="text-[9px] text-red-400/60">
                      {'★'.repeat(entry.danger)}{'☆'.repeat(5 - entry.danger)}
                    </span>
                  )}
                </div>
                <p className={cn('text-xs mt-0.5 line-clamp-2', entry.discovered ? 'text-gray-400' : 'text-gray-700')}>
                  {entry.discovered ? entry.description : '未发现该魔物娘的情报...'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── 相册 ──────────────────────────────────────────────────────────
  const renderGalleryApp = () => {
    // 模拟照片数据
    const mockPhotos = Array.from({ length: photoCount }, (_, i) => i);
    return (
      <div className="flex flex-col h-full p-2">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs text-gray-400">所有照片</span>
          <span className="text-[10px] text-gray-500">{photoCount}/20</span>
        </div>
        {selectedPhoto !== null ? (
          /* 照片详情视图 */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black rounded-lg flex items-center justify-center relative">
              <div className="w-full h-full bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg flex items-center justify-center">
                <span className="text-6xl opacity-30">🖼️</span>
              </div>
              <span className="absolute top-2 left-2 text-[10px] text-white/50">
                照片 #{selectedPhoto + 1}
              </span>
              <span className="absolute bottom-2 text-[10px] text-white/30">
                第{currentDay}日 · {currentPeriod}
              </span>
            </div>
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-2 text-center text-xs text-blue-400 hover:text-blue-300"
            >
              返回相册
            </button>
          </div>
        ) : (
          /* 照片网格 */
          <div className="flex-1 overflow-y-auto">
            {mockPhotos.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                暂无照片。使用相机拍摄吧。
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {mockPhotos.map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhoto(idx)}
                    className="aspect-square bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded border border-white/5 overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl opacity-20">📸</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ── 设置 ──────────────────────────────────────────────────────────
  const renderSettingsApp = () => {
    const SettingSlider = ({
      label,
      value,
      max,
      onChange,
      labels,
    }: {
      label: string;
      value: number;
      max: number;
      onChange: (v: number) => void;
      labels: string[];
    }) => (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-300">{label}</span>
          <span className="text-[10px] text-gray-500">{labels[value - 1]}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              onClick={() => onChange(i + 1)}
              className={cn(
                'flex-1 h-2 rounded-full transition-all',
                i < value ? 'bg-blue-500' : 'bg-gray-700',
              )}
            />
          ))}
        </div>
      </div>
    );

    return (
      <div className="flex flex-col h-full p-4">
        <h3 className="text-sm text-gray-200 mb-4 font-medium">游戏设置</h3>

        <SettingSlider
          label="字体大小"
          value={fontSize}
          max={3}
          onChange={setFontSize}
          labels={['小', '中', '大']}
        />

        <SettingSlider
          label="文字速度"
          value={textSpeed}
          max={3}
          onChange={setTextSpeed}
          labels={['慢速', '标准', '快速']}
        />

        <SettingSlider
          label="音量"
          value={soundVolume}
          max={5}
          onChange={setSoundVolume}
          labels={['关闭', '微弱', '适中', '较大', '最大']}
        />

        {/* 分隔线 */}
        <div className="h-px bg-white/5 my-4" />

        {/* 其他设置项 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">震动反馈</span>
            <div className="w-10 h-5 bg-blue-500/60 rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">夜间模式</span>
            <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">自动保存</span>
            <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <p className="text-[9px] text-gray-600 text-center">
            TSF Reality CYOA v1.0.0
          </p>
        </div>
      </div>
    );
  };

  // ── 时钟 ──────────────────────────────────────────────────────────
  const renderClockApp = () => {
    const daysCN = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
    const dayOfWeek = daysCN[(currentDay % 7) - 1] || daysCN[0];
    return (
      <div className="flex flex-col h-full items-center justify-center">
        {/* 模拟表盘 */}
        <div className="relative w-36 h-36 rounded-full border-2 border-white/10 mb-4 flex items-center justify-center">
          {/* 刻度 */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-white/20 rounded-full"
              style={{
                height: i % 3 === 0 ? '8px' : '4px',
                transform: `rotate(${i * 30}deg) translateY(-60px)`,
                transformOrigin: '0 72px',
                left: 'calc(50% - 1px)',
                top: '4px',
              }}
            />
          ))}
          {/* 时针 */}
          <div
            className="absolute w-1 h-10 bg-blue-400 rounded-full bottom-1/2 left-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${(currentDay * 30 + 90) % 360}deg)` }}
          />
          {/* 分针 */}
          <div
            className="absolute w-0.5 h-14 bg-white/60 rounded-full bottom-1/2 left-1/2 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${(currentPeriod === 'morning' ? 0 : currentPeriod === 'afternoon' ? 90 : currentPeriod === 'evening' ? 180 : 270)}deg)` }}
          />
          {/* 中心 */}
          <div className="w-2 h-2 bg-blue-400 rounded-full z-10" />
        </div>

        {/* 时间文字 */}
        <p className="text-3xl text-gray-100 font-light tracking-wider mb-1">{clockTime}</p>
        {/* 日期 */}
        <p className="text-sm text-gray-400">
          第{currentDay}日 · {periodCN[currentPeriod]}
        </p>
        <p className="text-xs text-gray-500 mt-1">{dayOfWeek}</p>

        {/* 附加信息 */}
        <div className="mt-6 flex gap-4 text-[10px] text-gray-600">
          <span>📆 第{currentDay}日</span>
          <span>🕐 {periodCN[currentPeriod]}</span>
        </div>
      </div>
    );
  };

  // ── 信息 ──────────────────────────────────────────────────────────
  const renderMessagesApp = () => (
    <div className="flex flex-col h-full">
      {selectedMessage ? (
        /* 消息详情 */
        <div className="flex-1 flex flex-col p-3">
          {(() => {
            const msg = messages.find((m) => m.id === selectedMessage);
            if (!msg) return null;
            return (
              <>
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-200">{msg.sender}</p>
                  <p className="text-[10px] text-gray-500">{msg.time}</p>
                </div>
                <div className="flex-1 bg-gray-900/40 border border-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-300 leading-relaxed">{msg.content}</p>
                </div>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="mt-2 text-center text-xs text-blue-400 hover:text-blue-300"
                >
                  返回消息列表
                </button>
              </>
            );
          })()}
        </div>
      ) : (
        /* 消息列表 */
        <div className="flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleReadMessage(msg.id)}
              className={cn(
                'w-full text-left p-3 border-b border-white/5 flex items-start gap-3 transition-colors',
                !msg.read ? 'bg-blue-500/5' : 'hover:bg-white/5',
              )}
            >
              {/* 头像 */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center flex-shrink-0 text-xs">
                {msg.sender === '系统通知' ? '📢' : msg.sender === '匿名' ? '👤' : msg.sender.charAt(0)}
              </div>
              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={cn('text-xs', !msg.read ? 'text-gray-100 font-medium' : 'text-gray-400')}>
                    {msg.sender}
                  </span>
                  <span className="text-[9px] text-gray-600">{msg.time}</span>
                </div>
                <p className={cn('text-xs truncate', !msg.read ? 'text-gray-300' : 'text-gray-500')}>
                  {msg.content}
                </p>
              </div>
              {/* 未读指示 */}
              {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // ── 应用商店 ──────────────────────────────────────────────────────
  const renderAppStore = () => {
    interface StoreApp {
      id: string;
      name: string;
      icon: string;
      category: '催眠' | '现实改变' | '认知增强' | '娱乐';
      description: string;
      effect: string;
      price: number;
      tsfItem?: string;
    }

    const STORE_APPS: StoreApp[] = [
      { id: 'hypno_basic', name: '基础催眠', icon: '🌀', category: '催眠',
        description: '一款基础催眠音频应用。通过双耳节拍诱导轻度催眠状态。',
        effect: '使用后认知+3，侵蚀+2，可在探索中使用',
        price: 0 },
      { id: 'hypno_advanced', name: '深度催眠', icon: '🌙', category: '催眠',
        description: '高级催眠程序。包含潜意识暗示和记忆引导功能。',
        effect: '使用后认知+8，侵蚀+5，可能触发意识改变',
        price: 500, tsfItem: 'earphones_hypno' },
      { id: 'reality_editor', name: '现实编辑器', icon: '🔮', category: '现实改变',
        description: '一个声称能"编辑周围现实"的应用。界面上只有一个输入框和一个确认按钮。',
        effect: 'TSF触发: 添加现实编辑手册到背包',
        price: 1000, tsfItem: 'book_reality' },
      { id: 'identity_changer', name: '身份改写器', icon: '🆔', category: '现实改变',
        description: '输入你想成为的人的名字，应用会"更新"你的身份记录。',
        effect: 'TSF触发: 添加空白身份卡到背包',
        price: 800, tsfItem: 'card_identity' },
      { id: 'memory_viewer', name: '记忆浏览器', icon: '🧠', category: '认知增强',
        description: '一个可以"浏览"自己记忆的可视化工具。还能发现被改写的记忆。',
        effect: '使用后认知+10，可能发现隐藏线索',
        price: 300 },
      { id: 'perception_boost', name: '感知增强器', icon: '👁️', category: '认知增强',
        description: '通过屏幕频闪刺激潜意识，暂时提升对"异常"的感知力。',
        effect: '使用后认知+15（持续3回合），侵蚀+3',
        price: 200 },
      { id: 'charm_simulator', name: '魅力增幅器', icon: '💝', category: '娱乐',
        description: '一款通过屏幕色温调节来影响周围人对你印象的应用。',
        effect: 'NPC好感度获取量+20%，持续到次日',
        price: 150, tsfItem: 'perfume_charm' },
      { id: 'voice_changer', name: '声线转换器', icon: '🎤', category: '娱乐',
        description: '实时转换你的声音。但有些用户报告说转换效果"过于真实"。',
        effect: 'TSF触发: 声线可能永久改变',
        price: 400 },
    ];

    return (
      <div className="flex flex-col h-full">
        <div className="p-2 border-b border-white/5">
          <span className="text-[9px] text-gray-500">可下载应用 ({STORE_APPS.filter(a => !ownedApps.includes(a.id)).length} 个新应用)</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {STORE_APPS.map((app) => {
            const isOwned = ownedApps.includes(app.id);
            const isInstalling = appStoreInstalling === app.id;
            return (
              <div key={app.id} className="bg-gray-900/60 border border-white/5 rounded-lg p-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/40 to-purple-600/40 flex items-center justify-center text-lg flex-shrink-0">{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs text-gray-200 font-medium">{app.name}</h4>
                      <span className="text-[9px] text-gray-500">{app.category}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{app.description}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[9px] text-purple-300/60">{app.effect}</span>
                      {isOwned ? (
                        <span className="text-[9px] text-green-400/60">已拥有 ✓</span>
                      ) : isInstalling ? (
                        <span className="text-[9px] text-blue-400 animate-pulse">安装中...</span>
                      ) : (
                        <button onClick={() => handleInstallApp(app.id, app.tsfItem)} className="px-2.5 py-1 rounded text-[9px] bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30 transition-colors">
                          获取{app.price > 0 ? ` (${app.price}G)` : ''}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-2 border-t border-white/5">
          <span className="text-[9px] text-gray-500">已安装 {ownedApps.length} 个应用</span>
        </div>
      </div>
    );
  };

  // ── 应用渲染映射 ──────────────────────────────────────────────────
  const appRenderers: Record<AppId, () => React.ReactNode> = {
    camera: renderCameraApp,
    map: renderMapApp,
    notes: renderNotesApp,
    encyclopedia: renderEncyclopediaApp,
    gallery: renderGalleryApp,
    settings: renderSettingsApp,
    clock: renderClockApp,
    messages: renderMessagesApp,
    appstore: renderAppStore,
  };

  // ── 应用标题映射 ──────────────────────────────────────────────────
  const appTitles: Record<AppId, string> = {
    camera: '相机',
    map: '地图',
    notes: '笔记',
    encyclopedia: '图鉴',
    gallery: '相册',
    settings: '设置',
    clock: '时钟',
    messages: '信息',
    appstore: '应用商店',
  };

  // ── 应用内导航栏 ──────────────────────────────────────────────────
  const renderAppNav = (appId: AppId) => (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
      <button onClick={goToHome} className="text-xs text-blue-400 hover:text-blue-300">
        ← 返回
      </button>
      <h3 className="text-sm text-gray-200 font-medium">{appTitles[appId]}</h3>
      <div className="w-10" /> {/* 占位 */}
    </div>
  );

  // ====================================================================
  // 主渲染
  // ====================================================================

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      {/* 手机外框 */}
      <div
        className={cn(
          'relative',
          'bg-gray-900 rounded-[2.5rem] border-2 border-gray-700',
          'shadow-2xl shadow-black/60',
          'overflow-hidden',
        )}
        style={{
          width: 320,
          height: 660,
        }}
      >
        {/* 屏幕内容 */}
        <div
          className="absolute inset-0 bg-gray-950 text-white flex flex-col"
          style={{
            margin: 6,
            borderRadius: 22,
            overflow: 'hidden',
          }}
        >
          {/* ── 状态栏 ──────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-5 text-white select-none flex-shrink-0"
            style={{ height: STATUS_BAR_HEIGHT }}
          >
            {/* 时间（左侧） */}
            <span className="text-[11px] font-semibold tracking-wide">{phoneTime}</span>
            {/* 状态图标（右侧） */}
            <div className="flex items-center gap-1.5">
              {/* 信号 */}
              <div className="flex items-end gap-[1px]" style={{ height: 10 }}>
                {[3, 5, 7, 9].map((h, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-white rounded-sm"
                    style={{ height: h }}
                  />
                ))}
              </div>
              {/* 电量 */}
              <div className="relative w-[18px] h-[9px] border border-white/70 rounded-sm flex items-center ml-1">
                <div className="bg-green-400 rounded-sm mx-[1.5px]" style={{ width: '70%', height: 5 }} />
                <div className="absolute -right-[3px] w-[3px] h-[5px] bg-white/70 rounded-r-sm" />
              </div>
            </div>
          </div>

          {/* 刘海区域（听筒+摄像头） */}
          <div className="flex justify-center items-center h-0 relative -top-[1px]">
            <div className="w-20 h-[5px] bg-gray-900 rounded-b-lg" />
          </div>

          {/* ── 应用内容区 ──────────────────────────────────────── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentApp ? (
              /* 应用子视图 */
              <>
                {renderAppNav(currentApp)}
                <div className="flex-1 overflow-y-auto">
                  {appRenderers[currentApp]()}
                </div>
              </>
            ) : (
              /* ── 主屏幕（应用网格） ──────────────────────────── */
              <div className="flex-1 flex flex-col px-3 pt-2 pb-1">
                {/* 日期问候 */}
                <div className="mb-4 px-1">
                  <p className="text-xs text-gray-400">
                    第{currentDay}日 · {periodCN[currentPeriod]}
                  </p>
                  <p className="text-lg text-gray-100 font-light mt-0.5">手机</p>
                </div>

                {/* 应用网格 */}
                <div className="flex-1 grid grid-cols-4 gap-y-4 gap-x-1 content-start">
                  {APPS.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => setCurrentApp(app.id)}
                      className="flex flex-col items-center gap-1 group"
                    >
                      {/* 图标 */}
                      <div
                        className={cn(
                          'w-[52px] h-[52px] rounded-[14px]',
                          'bg-gradient-to-br shadow-lg',
                          'flex items-center justify-center',
                          'text-xl',
                          'group-hover:scale-105 transition-transform duration-150',
                          'group-active:scale-95',
                          app.gradient,
                        )}
                      >
                        <span className="drop-shadow-lg">{app.icon}</span>
                        {/* 角标 */}
                        {(app.badge ?? (app.id === 'messages' ? unreadCount : 0)) > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center font-bold shadow">
                            {app.id === 'messages' ? unreadCount : app.badge}
                          </span>
                        )}
                      </div>
                      {/* 标签 */}
                      <span className="text-[10px] text-gray-300 text-center leading-tight max-w-[60px] truncate">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Home Indicator ──────────────────────────────────── */}
          {!currentApp && (
            <div className="flex justify-center pb-1 flex-shrink-0">
              <div
                className="w-[120px] h-[4px] bg-white/20 rounded-full cursor-pointer active:bg-white/40 transition-colors"
                onClick={onClose}
                title="关闭手机"
              />
            </div>
          )}
        </div>

        {/* 手机边框装饰 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[3px] bg-gray-800 rounded-b-lg" />
      </div>
    </div>
  );
};

export default PhoneScreen;
