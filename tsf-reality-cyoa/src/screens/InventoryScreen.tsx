import React, { useState, useCallback, useMemo } from 'react';
import { useGame } from '@/game/engine/GameContext';
import type { InventoryItem, EquipSlot, ClueEntry } from '@/game/engine/types';
import { cn } from '@/lib/utils';

type ItemTab = 'all' | 'consumable' | 'equipment' | 'key_item' | 'tsf';
type DetailTab = 'items' | 'clues';

const EQUIP_SLOT_LABELS: Record<EquipSlot, string> = {
  head: '头部',
  body: '身体',
  accessory: '饰品',
  weapon: '武器',
};

const ITEM_CATEGORY_LABELS: Record<string, string> = {
  consumable: '消耗品',
  equipment: '装备',
  key_item: '关键物品',
  material: '材料',
  clue: '线索',
  special: '特殊',
  tsf_trigger: 'TSF触发物',
};

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-300',
  uncommon: 'text-green-300',
  rare: 'text-blue-300',
  legendary: 'text-purple-300',
  unique: 'text-amber-300',
};

const InventoryScreen: React.FC = () => {
  const { state, dispatch } = useGame();

  const [activeTab, setActiveTab] = useState<ItemTab>('all');
  const [detailTab, setDetailTab] = useState<DetailTab>('items');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedClue, setSelectedClue] = useState<ClueEntry | null>(null);

  const items = state?.inventory?.items ?? [];
  const equipment = state?.inventory?.equipment ?? { head: null, body: null, accessory: null, weapon: null };
  const clues = state?.inventory?.clues ?? [];
  const money = state?.inventory?.money ?? 0;

  // 根据选项卡过滤物品
  const filteredItems = useMemo(() => {
    switch (activeTab) {
      case 'consumable':
        return items.filter((item) => item.category === 'consumable');
      case 'equipment':
        return items.filter((item) => item.category === 'equipment');
      case 'key_item':
        return items.filter((item) => item.category === 'key_item');
      case 'tsf':
        return items.filter((item) => item.category === 'special' || (item as any)?.triggerConfig);
      default:
        return items;
    }
  }, [items, activeTab]);

  // 装备处理
  const handleEquip = useCallback(
    (item: InventoryItem) => {
      if (item.category !== 'equipment') return;

      // 简化：根据物品名称推断装备槽
      let slot: EquipSlot = 'body';
      if (item.name.includes('帽') || item.name.includes('头') || item.name.includes('面具')) slot = 'head';
      else if (item.name.includes('戒') || item.name.includes('坠') || item.name.includes('链')) slot = 'accessory';
      else if (item.name.includes('剑') || item.name.includes('杖') || item.name.includes('武')) slot = 'weapon';
      else slot = 'body';

      dispatch({
        type: 'EQUIP_ITEM',
        payload: { itemId: item.id, slot },
      });

      dispatch({
        type: 'SET_FLAG',
        payload: { key: `equipped_${slot}`, value: item.id },
      });
    },
    [dispatch],
  );

  // 使用物品
  const handleUse = useCallback(
    (item: InventoryItem) => {
      if (item.useEffect) {
        item.useEffect.forEach((eff) => {
          if (eff.target.includes('erosion')) {
            dispatch({
              type: 'APPLY_EROSION',
              payload: { amount: eff.value as number, reason: `使用 ${item.name}` },
            });
          } else if (eff.target.includes('awareness')) {
            dispatch({
              type: 'APPLY_AWARENESS',
              payload: { amount: eff.value as number, reason: `使用 ${item.name}` },
            });
          }
        });
      }
      if (item.useFeedback) {
        dispatch({
          type: 'SET_FLAG',
          payload: { key: `use_feedback`, value: item.useFeedback },
        });
      }
      // 消耗品使用后移除
      if (item.category === 'consumable') {
        dispatch({ type: 'REMOVE_ITEM', payload: item.id });
      }
      // TSF触发物
      if ((item as any)?.triggerConfig) {
        dispatch({ type: 'TRIGGER_TSF_ITEM', payload: { itemId: item.id } });
      }
    },
    [dispatch],
  );

  // 丢弃物品
  const handleDiscard = useCallback(
    (item: InventoryItem) => {
      if (!item.droppable) return;
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
      setSelectedItem(null);
    },
    [dispatch],
  );

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  const isTsfItem = (item: InventoryItem): boolean =>
    item.category === 'special' || !!(item as any)?.triggerConfig;

  const tabs: { key: ItemTab; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'consumable', label: '消耗品' },
    { key: 'equipment', label: '装备' },
    { key: 'key_item', label: '关键物品' },
    { key: 'tsf', label: 'TSF触发物' },
  ];

  return (
    <div className="game-container min-h-screen">
      {/* 顶部 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleBack}
          className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
        >
          返回探索
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300/60">货币</span>
          <span className="text-sm text-amber-200">{money} G</span>
        </div>
      </div>

      {/* 装备栏 */}
      <div className="game-panel mb-4">
        <h3 className="text-xs text-gray-400 mb-2 tracking-wider">装备栏</h3>
        <div className="grid grid-cols-4 gap-2">
          {(['head', 'body', 'accessory', 'weapon'] as EquipSlot[]).map((slot) => {
            const equipped = equipment[slot];
            const equippedItem = equipped
              ? items.find((i) => i.id === equipped.itemId || i.id === equipped)
              : null;
            return (
              <div
                key={slot}
                className={cn(
                  'p-2 rounded-lg border text-center transition-all',
                  equippedItem
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-black/20 border-white/5',
                )}
              >
                <p className="text-[10px] text-gray-500 mb-1">{EQUIP_SLOT_LABELS[slot]}</p>
                {equippedItem ? (
                  <p className="text-xs text-green-300/80 truncate">{equippedItem.name}</p>
                ) : (
                  <p className="text-xs text-gray-600">空</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 详情选项卡 */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setDetailTab('items')}
          className={cn(
            'px-3 py-1 text-xs rounded transition-all',
            detailTab === 'items'
              ? 'bg-purple-500/20 border border-purple-400/30 text-purple-200'
              : 'text-gray-500 hover:text-gray-300',
          )}
        >
          物品
        </button>
        <button
          onClick={() => setDetailTab('clues')}
          className={cn(
            'px-3 py-1 text-xs rounded transition-all',
            detailTab === 'clues'
              ? 'bg-blue-500/20 border border-blue-400/30 text-blue-200'
              : 'text-gray-500 hover:text-gray-300',
          )}
        >
          线索 ({clues.length})
        </button>
      </div>

      {/* 物品选项卡 */}
      {detailTab === 'items' && (
        <div className="game-panel mb-4">
          <div className="flex border-b border-white/5 mb-3 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedItem(null);
                }}
                className={cn(
                  'px-3 py-1.5 text-xs transition-all border-b-2 whitespace-nowrap',
                  activeTab === tab.key
                    ? 'border-purple-400 text-purple-200'
                    : 'border-transparent text-gray-500 hover:text-gray-300',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 物品网格 */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {filteredItems.map((item) => {
              const isTsf = isTsfItem(item);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    'p-2 rounded-lg border text-center transition-all',
                    selectedItem?.id === item.id
                      ? 'bg-purple-500/10 border-purple-400/30'
                      : 'bg-black/20 border-white/5 hover:bg-black/40',
                    isTsf && 'item-glow border-pink-500/30',
                  )}
                >
                  <div className="w-8 h-8 mx-auto mb-1 rounded bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <span className="text-xs text-gray-400">{item.name.charAt(0)}</span>
                  </div>
                  <p className="text-[10px] text-gray-300 truncate">{item.name}</p>
                  {item.quantity > 1 && (
                    <span className="text-[8px] text-gray-500">x{item.quantity}</span>
                  )}
                  {isTsf && <div className="w-full h-[2px] mt-1 rounded-full bg-gradient-to-r from-pink-500/0 via-pink-400/50 to-pink-500/0" />}
                </button>
              );
            })}
          </div>

          {/* 物品详情 */}
          {selectedItem && (
            <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-game text-sm text-purple-200">{selectedItem.name}</h4>
                  <p className="text-[10px] text-gray-500">
                    {ITEM_CATEGORY_LABELS[selectedItem.category] ?? selectedItem.category}
                    {selectedItem.rarity && (
                      <span className={cn('ml-2', RARITY_COLORS[selectedItem.rarity])}>
                        · {selectedItem.rarity}
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-500">x{selectedItem.quantity}</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {selectedItem.description}
              </p>
              {isTsfItem(selectedItem) && (
                <p className="text-xs text-pink-300/70 mb-2">
                  ⚠ 此物品含有TSF触发能量
                </p>
              )}
              <div className="flex gap-2">
                {selectedItem.category === 'consumable' && (
                  <button
                    onClick={() => handleUse(selectedItem)}
                    className="px-3 py-1 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded hover:bg-blue-500/20 transition-all"
                  >
                    使用
                  </button>
                )}
                {selectedItem.category === 'equipment' && (
                  <button
                    onClick={() => handleEquip(selectedItem)}
                    className="px-3 py-1 text-xs bg-green-500/10 border border-green-500/20 text-green-300 rounded hover:bg-green-500/20 transition-all"
                  >
                    装备
                  </button>
                )}
                {isTsfItem(selectedItem) && (
                  <button
                    onClick={() => handleUse(selectedItem)}
                    className="px-3 py-1 text-xs bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded hover:bg-pink-500/20 transition-all"
                  >
                    触发
                  </button>
                )}
                {selectedItem.droppable && (
                  <button
                    onClick={() => handleDiscard(selectedItem)}
                    className="px-3 py-1 text-xs bg-red-500/10 border border-red-500/20 text-red-300 rounded hover:bg-red-500/20 transition-all"
                  >
                    丢弃
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 线索选项卡 */}
      {detailTab === 'clues' && (
        <div className="game-panel mb-4">
          {clues.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">尚未收集到线索。</p>
          ) : (
            <div className="space-y-2">
              {clues.map((clue) => (
                <button
                  key={clue.id}
                  onClick={() => setSelectedClue(clue)}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-all',
                    selectedClue?.id === clue.id
                      ? 'bg-blue-500/10 border-blue-400/30'
                      : 'bg-black/20 border-white/5 hover:bg-black/40',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-200">{clue.name}</span>
                    <span className="text-[10px] text-gray-500">
                      {clue.interpreted ? '已解读' : '未解读'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{clue.description}</p>
                  {clue.interpreted && clue.interpretation && (
                    <p className="text-[10px] text-green-300/60 mt-1">
                      解读：{clue.interpretation}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
          {selectedClue && (
            <div className="mt-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <h4 className="font-journal text-sm text-blue-200 mb-1">{selectedClue.name}</h4>
              <p className="text-xs text-gray-300">{selectedClue.content}</p>
              {selectedClue.isCritical && (
                <p className="text-xs text-rose-300/70 mt-1">* 关键线索</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryScreen;
