import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';

interface EndingDisplay {
  title: string;
  description: string;
  type: string;
  epilogue: string;
  playerFinalForm?: string;
}

const ENDINGS_DATABASE: Record<string, EndingDisplay> = {
  ending_return_to_normal: {
    title: '回归日常',
    description: '你选择了忽视一切异常。烧掉了调查笔记，卖掉了诅咒戒指，不再去那些奇怪的店铺。你告诉自己那些都是幻觉。你过上了普通的幸福生活。但有时在深夜，你会醒来——感觉窗外的月光太亮了。',
    type: 'normal_end',
    epilogue: '你选择了无知。无知是福。这座城市的秘密继续沉睡，而你在它的梦境中过着安稳的一生。',
  },
  ending_bystander: {
    title: '旁观者',
    description: '你知道了真相，但你选择了不介入。你继续上班、吃饭、睡觉，像一个幽灵一样穿梭在两个世界之间。世界在变，而你坐在旁边，看着。',
    type: 'normal_end',
    epilogue: '你不是英雄。你不是反派。你只是一个看到了真相却选择沉默的普通人。历史不会记住你。',
  },
  ending_peaceful_coexistence: {
    title: '和平共存',
    description: '你选择了站在怪物娘一边——但不是通过战斗，而是通过理解和沟通。你成为了人类和非人类之间的桥梁。十年后，这座城市成为了人类和怪物娘共存的典范。',
    type: 'true_end',
    epilogue: '世界不需要被改写——它需要被理解。你证明了这一点。',
  },
  ending_monster_paradise: {
    title: '怪物乐园',
    description: '你完全接受了常识改变。你加入了理事会，成为了龙映的得力助手。你亲眼见证了人类世界被改写成怪物乐园的全过程。旧世界在遗忘中消失，新世界在常识中诞生。',
    type: 'normal_end',
    epilogue: '旧世界在遗忘中消失。新世界在常识中诞生。你成为了改变的一部分。',
  },
  ending_truth_exposed: {
    title: '真相揭露',
    description: '你选择了反抗理事会。你收集了足够的证据，把这一切公之于众。世界永远地改变了——不是变得更好或更坏。它只是变得真实了。',
    type: 'true_end',
    epilogue: '真相让人自由——也让人恐惧。你给了世界一个选择的机会。',
  },
  ending_lord_of_abyss: {
    title: '深渊之主',
    description: '你走进了深渊回廊，没有退缩。你成为了新的"调整者"，掌控常识改变的力量。你独自站在深渊回廊的入口，守护着现实与虚无之间的界线。',
    type: 'hidden_end',
    epilogue: '你成为了世界之间的守门人。没有人知道你的牺牲。但每一个安定的夜晚——都是你的礼物。',
  },
  ending_new_normal: {
    title: '新的日常',
    description: '你没有选择任何极端的道路。你只是在两个世界之间找到了自己的位置。世界没有被拯救，也没有被毁灭。它只是继续存在——以它自己的方式。而你，生活在其中。',
    type: 'normal_end',
    epilogue: '世界从来不是非黑即白的。你在灰色地带找到了属于自己的色彩。',
  },
};

const BAD_END_DATABASE: Record<string, { title: string; narrative: string }> = {
  badend_prisoner: { title: '常识的囚徒', narrative: '你的侵蚀率达到了100%。你不再能区分什么是真实、什么是被植入的常识。你的自我意识像沙堡一样崩塌了。' },
  badend_operation: { title: '地下手术台', narrative: '你知道得太多了。所以他们让你忘记。你被带到了医院地下三层的手术室。' },
  badend_succubus_feast: { title: '魅魔的晚餐', narrative: '你接受了夜魅的"特制鸡尾酒"，但你的意志力不够强大。你陷入了无法醒来的梦境。' },
  badend_kitsune_ash: { title: '狐火的灰烬', narrative: '你成为了守护结界的代价。没有人记得你。' },
  badend_dragon_wrath: { title: '龙怒', narrative: '向龙挑战的蝼蚁——连灰烬都不会留下。' },
  badend_library_forever: { title: '图书馆的永眠', narrative: '知识是诅咒。有些书一旦翻开——就再也合不上了。' },
  badend_subway_lost: { title: '地铁迷失', narrative: '有些列车——没有回程。' },
  badend_home_stranger: { title: '家的陌生人', narrative: '家——是最温暖的牢笼。' },
  badend_vampire_hunger: { title: '空腹与渴望', narrative: '野兽的饥饿——终归会战胜人类的尊严。' },
  badend_broken_porcelain: { title: '碎瓷', narrative: '美丽是永恒的——也是残酷的。' },
  badend_flower_fertilizer: { title: '花肥', narrative: '每一朵美丽的花下——都埋着一个秘密。' },
  badend_abyss_echo: { title: '深渊回响', narrative: '深渊凝视你——然后把你变成它的一部分。' },
};

type EndingType = 'true_end' | 'normal_end' | 'bad_end' | 'hidden_end' | 'route_end';

const ENDING_TYPE_COLORS: Record<string, string> = {
  true_end: 'from-amber-400/30 via-yellow-500/20 to-amber-600/10',
  normal_end: 'from-blue-400/20 via-blue-500/10 to-blue-600/5',
  bad_end: 'from-rose-600/30 via-red-700/20 to-rose-900/10',
  hidden_end: 'from-purple-400/30 via-fuchsia-500/20 to-purple-600/10',
  route_end: 'from-emerald-400/20 via-teal-500/10 to-emerald-600/5',
};

const ENDING_TYPE_NAMES: Record<string, string> = {
  true_end: 'TRUE END',
  normal_end: 'NORMAL END',
  bad_end: 'BAD END',
  hidden_end: 'HIDDEN END',
  route_end: 'ROUTE END',
};

const EndingScreen: React.FC = () => {
  const { state, dispatch, newGame } = useGame();

  const endingsUnlocked = state?.ending?.endingsUnlocked ?? [];
  const badEndsUnlocked = state?.ending?.badEndsUnlocked ?? [];

  // 通过标志判断当前显示的结局
  const currentEndingId = ((state.flags ?? {})['_current_ending'] as string) ?? endingsUnlocked[endingsUnlocked.length - 1] ?? '';
  const isBadEnd = badEndsUnlocked.some((b) => b === currentEndingId);

  const daysSpent = state.currentDay ?? 1;
  const discoveriesCount = state?.discoveries?.entries?.length ?? 0;
  const finalErosion = state.erosionLevel ?? 0;
  const finalAwareness = state.awarenessLevel ?? 0;
  const metNpcs = Object.values(state?.npcRelations ?? {}).filter((r: any) => r?.met).length;
  const solvedPuzzles = Object.values(state?.puzzles ?? {}).filter((s: any) => s === 'solved').length;

  const endingData = isBadEnd
    ? BAD_END_DATABASE[currentEndingId] ?? null
    : ENDINGS_DATABASE[currentEndingId] ?? null;

  const endingType = isBadEnd
    ? 'bad_end'
    : (endingData as EndingDisplay)?.type ?? 'normal_end';

  const isErosionEnding = finalErosion > 70;
  const isAwarenessEnding = finalAwareness > 70;

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 200);
  }, []);

  const handleReturnToTitle = useCallback(() => {
    dispatch({ type: 'NEW_GAME', payload: undefined });
  }, [dispatch]);

  const handleNewPlaythrough = useCallback(() => {
    dispatch({ type: 'NEW_GAME', payload: undefined });
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  const handleViewEndings = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'journal' },
    });
  }, [dispatch]);

  const handleBack = useCallback(() => {
    dispatch({
      type: 'SET_FLAG',
      payload: { key: '_screen', value: 'exploration' },
    });
  }, [dispatch]);

  return (
    <div
      className={cn(
        'relative min-h-screen overflow-hidden transition-all duration-1000',
        isErosionEnding
          ? 'bg-gradient-to-b from-[#1a0a0a] via-[#2d0f1a] to-[#1a0a0a]'
          : isAwarenessEnding
          ? 'bg-gradient-to-b from-[#0a0a1a] via-[#0f1a2d] to-[#0a0a1a]'
          : 'bg-gradient-to-b from-[#0f0c29] via-[#1a1530] to-[#0f0c29]',
      )}
    >
      {/* 背景特效 */}
      <div
        className={cn(
          'absolute inset-0 opacity-20',
          isErosionEnding
            ? 'bg-gradient-to-b from-pink-500/10 via-red-500/5 to-transparent'
            : isAwarenessEnding
            ? 'bg-gradient-to-b from-blue-500/10 via-cyan-500/5 to-transparent'
            : 'bg-gradient-to-b from-purple-500/5 via-transparent to-transparent',
        )}
      />

      <div
        className={cn(
          'relative z-10 game-container min-h-screen flex flex-col items-center justify-center text-center transition-all duration-1000',
          fadeIn ? 'opacity-100' : 'opacity-0',
        )}
      >
        {/* 结局类型标识 */}
        <div
          className={cn(
            'mb-6 px-4 py-1.5 rounded-full text-xs tracking-[0.3em] border',
            endingType === 'bad_end'
              ? 'border-rose-500/30 text-rose-300/80 bg-rose-500/5'
              : endingType === 'true_end'
              ? 'border-amber-500/30 text-amber-300/80 bg-amber-500/5'
              : endingType === 'hidden_end'
              ? 'border-purple-500/30 text-purple-300/80 bg-purple-500/5'
              : 'border-blue-500/20 text-blue-300/60 bg-blue-500/5',
          )}
        >
          {ENDING_TYPE_NAMES[endingType] ?? endingType}
        </div>

        {/* 结局标题 */}
        <h1
          className={cn(
            'font-title text-5xl md:text-6xl mb-6 tracking-wider',
            endingType === 'bad_end'
              ? 'text-rose-300 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : endingType === 'true_end'
              ? 'text-amber-200 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]'
              : endingType === 'hidden_end'
              ? 'text-purple-200 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]'
              : 'text-blue-200',
          )}
        >
          {endingData?.title ?? '未知的结局'}
        </h1>

        {/* 结局叙事 */}
        <div className="max-w-2xl mx-auto mb-8">
          <p className="narrative-text text-sm md:text-base leading-relaxed text-gray-200/90 mb-6">
            {endingData?.description ?? endingData?.narrative ?? '结局描述未找到。'}
          </p>

          {/* 终语 */}
          {endingData?.epilogue && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm italic text-gray-300/80 font-journal">
                {endingData.epilogue}
              </p>
            </div>
          )}
        </div>

        {/* 数据统计 */}
        <div className="game-panel w-full max-w-md mb-8">
          <h3 className="text-xs text-gray-400 mb-3 tracking-wider">
            这次旅程的轨迹
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{daysSpent}</p>
              <p className="text-[10px] text-gray-500">经历天数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{discoveriesCount}</p>
              <p className="text-[10px] text-gray-500">发现数量</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-pink-300">{finalErosion}%</p>
              <p className="text-[10px] text-gray-500">最终侵蚀</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-blue-300">{finalAwareness}%</p>
              <p className="text-[10px] text-gray-500">最终认知</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{metNpcs}</p>
              <p className="text-[10px] text-gray-500">结识的NPC</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-title text-gray-200">{solvedPuzzles}</p>
              <p className="text-[10px] text-gray-500">解开的谜题</p>
            </div>
          </div>
        </div>

        {/* 结局收集进度 */}
        <div className="game-panel w-full max-w-md mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">结局收集</span>
            <span className="text-xs text-gray-500">
              {endingsUnlocked.length + badEndsUnlocked.length} / 19
            </span>
          </div>
          <div className="flex gap-1 mb-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={`normal-${i}`}
                className={cn(
                  'flex-1 h-2 rounded-full',
                  i < endingsUnlocked.length ? 'bg-amber-400/40' : 'bg-gray-800/50',
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500">普通结局 {endingsUnlocked.length}/7</span>
            <span className="text-gray-500">Bad End {badEndsUnlocked.length}/12</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleBack}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
            )}
          >
            ← 返回探索
          </button>
          <button
            onClick={handleReturnToTitle}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:text-white',
            )}
          >
            返回标题
          </button>
          <button
            onClick={handleNewPlaythrough}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 hover:text-white',
            )}
          >
            开始新周目
          </button>
          <button
            onClick={handleViewEndings}
            className={cn(
              'w-64 px-8 py-3 rounded-lg border transition-all duration-300 font-game text-sm',
              'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white',
            )}
          >
            查看结局图鉴
          </button>
        </div>

        {/* 版本信息 */}
        <p className="mt-8 text-[10px] text-gray-700 tracking-widest">
          TSF Reality CYOA — 你的每一段旅程都值得铭记。
        </p>
      </div>
    </div>
  );
};

export default EndingScreen;
