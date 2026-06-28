import React, { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/game/engine/GameContext';
import { cn } from '@/lib/utils';
import type { ScreenId } from '@/App';

// ─── Types ───────────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  delay: number;
}

type Gender = 'male' | 'female' | 'secret';
type Identity = 'detective' | 'journalist' | 'doctor' | 'student';
type HairStyle = 'short' | 'long' | 'ponytail' | 'twintail';

interface CharacterData {
  gender: Gender | null;
  identity: Identity | null;
  hairStyle: HairStyle | null;
  hairColor: string | null;
  eyeColor: string | null;
  name: string;
}

// ─── Constants ───────────────────────────────────────────────────────

const GENDER_OPTIONS: { value: Gender; label: string; icon: string }[] = [
  { value: 'male', label: '男性', icon: '\u2642' },
  { value: 'female', label: '女性', icon: '\u2640' },
  { value: 'secret', label: '秘密', icon: '\u26A4' },
];

const IDENTITY_OPTIONS: { value: Identity; label: string; icon: string; bonus: string }[] = [
  { value: 'detective', label: '探偵', icon: '\uD83D\uDD75\uFE0F', bonus: '観察力+2' },
  { value: 'journalist', label: '記者', icon: '\uD83D\uDCF0', bonus: '洞察力+2' },
  { value: 'doctor', label: '医者', icon: '\uD83D\uDC89', bonus: '分析力+2' },
  { value: 'student', label: '学生', icon: '\uD83D\uDCDA', bonus: '適応力+2' },
];

const HAIR_STYLE_OPTIONS: { value: HairStyle; label: string }[] = [
  { value: 'short', label: '短髪' },
  { value: 'long', label: '長髪' },
  { value: 'ponytail', label: 'ポニーテール' },
  { value: 'twintail', label: 'ツインテール' },
];

const HAIR_COLORS: { value: string; label: string; color: string }[] = [
  { value: '#1a1a2e', label: '黒', color: '#1a1a2e' },
  { value: '#6b4226', label: '茶', color: '#6b4226' },
  { value: '#e8d48b', label: '金', color: '#e8d48b' },
  { value: '#c0c0c0', label: '銀', color: '#c0c0c0' },
  { value: '#e63946', label: '赤', color: '#e63946' },
  { value: '#457b9d', label: '青', color: '#457b9d' },
  { value: '#9b59b6', label: '紫', color: '#9b59b6' },
  { value: '#f4a261', label: '桃', color: '#f4a261' },
];

const EYE_COLORS: { value: string; label: string; color: string }[] = [
  { value: '#2d2d2d', label: '黒', color: '#2d2d2d' },
  { value: '#8b6914', label: '茶', color: '#8b6914' },
  { value: '#ffd700', label: '金', color: '#ffd700' },
  { value: '#a8d8ea', label: '銀', color: '#a8d8ea' },
  { value: '#e63946', label: '赤', color: '#e63946' },
  { value: '#1e90ff', label: '青', color: '#1e90ff' },
  { value: '#9b59b6', label: '紫', color: '#9b59b6' },
  { value: '#ff69b4', label: '桃', color: '#ff69b4' },
];

const STEP_LABELS = ['性別選択', '身分選択', '外見設定', '名前入力', '確認'];

const GENDER_LABEL_MAP: Record<Gender, string> = {
  male: '男性',
  female: '女性',
  secret: '秘密',
};

const IDENTITY_LABEL_MAP: Record<Identity, string> = {
  detective: '探偵',
  journalist: '記者',
  doctor: '医者',
  student: '学生',
};

const HAIR_STYLE_LABEL_MAP: Record<HairStyle, string> = {
  short: '短髪',
  long: '長髪',
  ponytail: 'ポニーテール',
  twintail: 'ツインテール',
};

const IDENTITY_ICON_MAP: Record<Identity, string> = {
  detective: '\uD83D\uDD75\uFE0F',
  journalist: '\uD83D\uDCF0',
  doctor: '\uD83D\uDC89',
  student: '\uD83D\uDCDA',
};

// ─── Helper: random Japanese name ────────────────────────────────────

const SURNAMES = [
  '佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤',
  '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水',
];

const GIVEN_NAMES_MALE = [
  '翔太', '健一', '大輔', '拓也', '悠真', '誠', '隆', '和也', '勇気', '蓮',
];

const GIVEN_NAMES_FEMALE = [
  '美咲', '愛', 'さくら', '優子', '美香', '真理子', '恵', '陽子', '真由美', '彩花',
];

function generateRandomName(gender: Gender | null): string {
  const surname = SURNAMES[Math.floor(Math.random() * SURNAMES.length)];
  const pool =
    gender === 'female' ? GIVEN_NAMES_FEMALE
    : gender === 'male' ? GIVEN_NAMES_MALE
    : Math.random() > 0.5 ? GIVEN_NAMES_MALE : GIVEN_NAMES_FEMALE;
  const given = pool[Math.floor(Math.random() * pool.length)];
  return `${surname} ${given}`;
}

// ─── Step Indicator ──────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-3 mb-8">
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300',
            i === current
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-110'
              : i < current
                ? 'bg-purple-500/40 text-purple-200 border border-purple-400/30'
                : 'bg-white/5 text-gray-500 border border-white/10',
          )}
        >
          {i < current ? '✓' : i + 1}
        </div>
        <div
          className={cn(
            'h-[2px] w-12 transition-all duration-300',
            i < current ? 'bg-purple-500/60' : 'bg-white/10',
          )}
        />
      </React.Fragment>
    ))}
    <div
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300',
        current === total - 1
          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-110'
          : current >= total
            ? 'bg-purple-500/40 text-purple-200 border border-purple-400/30'
            : 'bg-white/5 text-gray-500 border border-white/10',
      )}
    >
      {current >= total ? '✓' : total}
    </div>
  </div>
);

// ─── Step 1: Gender Selection ────────────────────────────────────────

interface StepGenderProps {
  value: Gender | null;
  onChange: (g: Gender) => void;
  onNext: () => void;
}

const StepGender: React.FC<StepGenderProps> = ({ value, onChange, onNext }) => (
  <div className="flex flex-col items-center w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">性別選択</h2>
    <p className="text-sm text-purple-200/60 mb-8 tracking-wider">あなたの性別を選んでください</p>

    <div className="grid grid-cols-3 gap-4 w-full mb-10">
      {GENDER_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex flex-col items-center gap-3 p-6 rounded-xl transition-all duration-300',
            'border border-white/10 bg-white/5 backdrop-blur-sm',
            'hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
            value === opt.value
              ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
              : '',
          )}
        >
          <span className="text-4xl">{opt.icon}</span>
          <span className="font-game text-sm text-gray-300 tracking-wider">{opt.label}</span>
        </button>
      ))}
    </div>

    <button
      onClick={onNext}
      disabled={!value}
      className={cn(
        'w-48 px-6 py-3 rounded-lg font-game text-sm tracking-wider transition-all duration-300',
        value
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
          : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed',
      )}
    >
      次へ →
    </button>
  </div>
);

// ─── Step 2: Identity Selection ──────────────────────────────────────

interface StepIdentityProps {
  value: Identity | null;
  onChange: (i: Identity) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepIdentity: React.FC<StepIdentityProps> = ({ value, onChange, onNext, onBack }) => (
  <div className="flex flex-col items-center w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">身分選択</h2>
    <p className="text-sm text-purple-200/60 mb-8 tracking-wider">あなたの身分を選んでください</p>

    <div className="grid grid-cols-2 gap-4 w-full mb-10">
      {IDENTITY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex flex-col items-center gap-2 p-5 rounded-xl transition-all duration-300',
            'border border-white/10 bg-white/5 backdrop-blur-sm',
            'hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
            value === opt.value
              ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_25px_rgba(234,179,8,0.25)]'
              : '',
          )}
        >
          <span className="text-3xl">{opt.icon}</span>
          <span className="font-game text-base text-white tracking-wider">{opt.label}</span>
          <span className="text-xs text-purple-300/70 tracking-wider">{opt.bonus}</span>
        </button>
      ))}
    </div>

    <div className="flex gap-3">
      <button
        onClick={onBack}
        className="w-24 px-4 py-3 rounded-lg border border-white/10 bg-white/5 font-game text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        ← 戻る
      </button>
      <button
        onClick={onNext}
        disabled={!value}
        className={cn(
          'w-36 px-6 py-3 rounded-lg font-game text-sm tracking-wider transition-all duration-300',
          value
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed',
        )}
      >
        次へ →
      </button>
    </div>
  </div>
);

// ─── Step 3: Appearance ─────────────────────────────────────────────

interface StepAppearanceProps {
  hairStyle: HairStyle | null;
  hairColor: string | null;
  eyeColor: string | null;
  onHairStyleChange: (s: HairStyle) => void;
  onHairColorChange: (c: string) => void;
  onEyeColorChange: (c: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepAppearance: React.FC<StepAppearanceProps> = ({
  hairStyle,
  hairColor,
  eyeColor,
  onHairStyleChange,
  onHairColorChange,
  onEyeColorChange,
  onNext,
  onBack,
}) => (
  <div className="flex flex-col items-center w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">外見設定</h2>
    <p className="text-sm text-purple-200/60 mb-8 tracking-wider">あなたの外見を設定してください</p>

    {/* 发型选择 */}
    <div className="w-full mb-6">
      <p className="text-xs text-purple-300/70 tracking-wider mb-3">髪型</p>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/30">
        {HAIR_STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onHairStyleChange(opt.value)}
            className={cn(
              'flex-shrink-0 px-5 py-3 rounded-lg text-sm font-game tracking-wider transition-all duration-300',
              'border border-white/10 bg-white/5',
              'hover:border-yellow-400/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)]',
              hairStyle === opt.value
                ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_25px_rgba(234,179,8,0.25)] text-white'
                : 'text-gray-400',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    {/* 发色选择 */}
    <div className="w-full mb-6">
      <p className="text-xs text-purple-300/70 tracking-wider mb-3">髪色</p>
      <div className="grid grid-cols-8 gap-2">
        {HAIR_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onHairColorChange(c.value)}
            className={cn(
              'w-full aspect-square rounded-full transition-all duration-200',
              'border-2 hover:scale-110',
              hairColor === c.value
                ? 'border-yellow-400 ring-2 ring-yellow-400/40 scale-110'
                : 'border-transparent hover:border-white/30',
            )}
            style={{ backgroundColor: c.color }}
            title={c.label}
          />
        ))}
      </div>
    </div>

    {/* 瞳色选择 */}
    <div className="w-full mb-10">
      <p className="text-xs text-purple-300/70 tracking-wider mb-3">瞳色</p>
      <div className="grid grid-cols-8 gap-2">
        {EYE_COLORS.map((c) => (
          <button
            key={c.value}
            onClick={() => onEyeColorChange(c.value)}
            className={cn(
              'w-full aspect-square rounded-full transition-all duration-200',
              'border-2 hover:scale-110',
              eyeColor === c.value
                ? 'border-yellow-400 ring-2 ring-yellow-400/40 scale-110'
                : 'border-transparent hover:border-white/30',
            )}
            style={{ backgroundColor: c.color }}
            title={c.label}
          />
        ))}
      </div>
    </div>

    <div className="flex gap-3">
      <button
        onClick={onBack}
        className="w-24 px-4 py-3 rounded-lg border border-white/10 bg-white/5 font-game text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        ← 戻る
      </button>
      <button
        onClick={onNext}
        disabled={!hairStyle || !hairColor || !eyeColor}
        className={cn(
          'w-36 px-6 py-3 rounded-lg font-game text-sm tracking-wider transition-all duration-300',
          hairStyle && hairColor && eyeColor
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed',
        )}
      >
        次へ →
      </button>
    </div>
  </div>
);

// ─── Step 4: Name Input ─────────────────────────────────────────────

interface StepNameProps {
  name: string;
  gender: Gender | null;
  onChange: (n: string) => void;
  onRandomize: () => void;
  onNext: () => void;
  onBack: () => void;
}

const StepName: React.FC<StepNameProps> = ({ name, gender, onChange, onRandomize, onNext, onBack }) => (
  <div className="flex flex-col items-center w-full max-w-lg mx-auto">
    <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">名前入力</h2>
    <p className="text-sm text-purple-200/60 mb-8 tracking-wider">あなたの名前を入力してください</p>

    <div className="w-full mb-6">
      <label className="block text-xs text-purple-300/70 tracking-wider mb-2">名前</label>
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="例：佐藤 翔太"
          maxLength={20}
          className={cn(
            'w-full px-5 py-4 rounded-xl text-lg tracking-wider',
            'bg-white/5 border border-white/10 text-white placeholder-gray-500',
            'focus:outline-none focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/20',
            'transition-all duration-300',
          )}
        />
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5" />
      </div>
    </div>

    <button
      onClick={onRandomize}
      className={cn(
        'mb-10 px-6 py-2.5 rounded-lg text-sm font-game tracking-wider transition-all duration-300',
        'border border-purple-400/30 bg-purple-500/10 text-purple-200',
        'hover:bg-purple-500/20 hover:border-purple-400/50',
      )}
    >
      ランダム生成
    </button>

    <div className="flex gap-3">
      <button
        onClick={onBack}
        className="w-24 px-4 py-3 rounded-lg border border-white/10 bg-white/5 font-game text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
      >
        ← 戻る
      </button>
      <button
        onClick={onNext}
        disabled={!name.trim()}
        className={cn(
          'w-36 px-6 py-3 rounded-lg font-game text-sm tracking-wider transition-all duration-300',
          name.trim()
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
            : 'bg-white/5 text-gray-500 border border-white/10 cursor-not-allowed',
        )}
      >
        次へ →
      </button>
    </div>
  </div>
);

// ─── Summary / Confirmation ─────────────────────────────────────────

interface StepSummaryProps {
  character: CharacterData;
  onConfirm: () => void;
  onBack: () => void;
}

const StepSummary: React.FC<StepSummaryProps> = ({ character, onConfirm, onBack }) => {
  const colorLabelHair = HAIR_COLORS.find((c) => c.value === character.hairColor)?.label ?? '';
  const colorLabelEye = EYE_COLORS.find((c) => c.value === character.eyeColor)?.label ?? '';

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">確認</h2>
      <p className="text-sm text-purple-200/60 mb-8 tracking-wider">以下の設定でよろしいですか？</p>

      {/* 角色卡片 */}
      <div className="w-full p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/20 mb-10">
        {/* 角色预览 */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-400/30 flex items-center justify-center">
            <span className="text-4xl">
              {character.gender === 'male' ? '\u2642' : character.gender === 'female' ? '\u2640' : '\u26A4'}
            </span>
            {/* 发色小标记 */}
            {character.hairColor && (
              <div
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-purple-400/30"
                style={{ backgroundColor: character.hairColor }}
              />
            )}
            {/* 瞳色小标记 */}
            {character.eyeColor && (
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-purple-400/30"
                style={{ backgroundColor: character.eyeColor }}
              />
            )}
          </div>
        </div>

        <div className="space-y-3">
          {/* 名前 */}
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-purple-300/60 tracking-wider">名前</span>
            <span className="text-sm text-white tracking-wider">{character.name}</span>
          </div>
          {/* 性別 */}
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-purple-300/60 tracking-wider">性別</span>
            <span className="text-sm text-white tracking-wider">
              {character.gender ? GENDER_LABEL_MAP[character.gender] : '-'}
            </span>
          </div>
          {/* 身分 */}
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-purple-300/60 tracking-wider">身分</span>
            <span className="text-sm text-white tracking-wider">
              {character.identity
                ? `${IDENTITY_ICON_MAP[character.identity]} ${IDENTITY_LABEL_MAP[character.identity]}`
                : '-'}
            </span>
          </div>
          {/* 髪型 */}
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-purple-300/60 tracking-wider">髪型</span>
            <span className="text-sm text-white tracking-wider">
              {character.hairStyle ? HAIR_STYLE_LABEL_MAP[character.hairStyle] : '-'}
            </span>
          </div>
          {/* 髪色 */}
          <div className="flex justify-between items-center py-2 border-b border-white/5">
            <span className="text-xs text-purple-300/60 tracking-wider">髪色</span>
            <span className="text-sm text-white tracking-wider">
              {character.hairColor ? colorLabelHair : '-'}
            </span>
          </div>
          {/* 瞳色 */}
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-purple-300/60 tracking-wider">瞳色</span>
            <span className="text-sm text-white tracking-wider">
              {character.eyeColor ? colorLabelEye : '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="w-28 px-4 py-3 rounded-lg border border-white/10 bg-white/5 font-game text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          ← 戻る
        </button>
        <button
          onClick={onConfirm}
          className={cn(
            'px-8 py-3 rounded-lg font-game text-sm tracking-wider transition-all duration-300',
            'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold',
            'hover:shadow-lg hover:shadow-yellow-500/30 hover:scale-105',
          )}
        >
          この姿で街に降り立つ
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────

const TitleScreen: React.FC<{ onNavigate?: (screen: string) => void }> = ({ onNavigate }) => {
  const { state, dispatch } = useGame();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // 角色创建状态
  const [showCreator, setShowCreator] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [character, setCharacter] = useState<CharacterData>({
    gender: null,
    identity: null,
    hairStyle: null,
    hairColor: null,
    eyeColor: null,
    name: '',
  });
  const [creatorFadeIn, setCreatorFadeIn] = useState(false);

  const playthroughCount = state?.playthrough?.current ?? 0;
  const maxUnlocked = state?.playthrough?.maxUnlocked ?? 1;

  // 生成粒子背景
  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.5 + 0.1,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
    setTimeout(() => setFadeIn(true), 100);
    setTimeout(() => setShowMenu(true), 1500);
  }, []);

  // 进入角色创建时的淡入
  useEffect(() => {
    if (showCreator) {
      setTimeout(() => setCreatorFadeIn(true), 50);
    } else {
      setCreatorFadeIn(false);
    }
  }, [showCreator]);

  // ── 菜单按钮处理 ──

  const handleNewGame = useCallback(() => {
    setCharacter({
      gender: null,
      identity: null,
      hairStyle: null,
      hairColor: null,
      eyeColor: null,
      name: '',
    });
    setStepIndex(0);
    setShowCreator(true);
  }, []);

  const handleContinue = useCallback(() => {
    if (onNavigate) onNavigate('exploration');
  }, [onNavigate]);

  const handleSelectPlaythrough = useCallback(
    (pt: number) => {
      dispatch({ type: 'SET_FLAG', payload: { key: '_selected_playthrough', value: pt } });
      dispatch({ type: 'NEW_GAME', payload: undefined });
      if (onNavigate) onNavigate('exploration');
    },
    [dispatch, onNavigate],
  );

  // ── 角色创建回调 ──

  const handleCreatorBackToMenu = useCallback(() => {
    setShowCreator(false);
  }, []);

  const handleSetGender = useCallback((g: Gender) => {
    setCharacter((prev) => ({ ...prev, gender: g }));
  }, []);

  const handleSetIdentity = useCallback((i: Identity) => {
    setCharacter((prev) => ({ ...prev, identity: i }));
  }, []);

  const handleSetHairStyle = useCallback((s: HairStyle) => {
    setCharacter((prev) => ({ ...prev, hairStyle: s }));
  }, []);

  const handleSetHairColor = useCallback((c: string) => {
    setCharacter((prev) => ({ ...prev, hairColor: c }));
  }, []);

  const handleSetEyeColor = useCallback((c: string) => {
    setCharacter((prev) => ({ ...prev, eyeColor: c }));
  }, []);

  const handleSetName = useCallback((n: string) => {
    setCharacter((prev) => ({ ...prev, name: n }));
  }, []);

  const handleRandomizeName = useCallback(() => {
    const randomName = generateRandomName(character.gender);
    setCharacter((prev) => ({ ...prev, name: randomName }));
  }, [character.gender]);

  const handleNextStep = useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, 4));
  }, []);

  const handlePrevStep = useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleConfirmCharacter = useCallback(() => {
    dispatch({ type: 'NEW_GAME', payload: undefined });
    if (onNavigate) onNavigate('exploration');
  }, [dispatch, onNavigate]);

  const periodLabels: Record<string, string> = {
    morning: '早晨',
    afternoon: '下午',
    evening: '傍晚',
    night: '深夜',
  };

  // ── 渲染角色创建流程 ──

  const renderCreator = () => {
    const stepContent = (() => {
      switch (stepIndex) {
        case 0:
          return (
            <StepGender
              value={character.gender}
              onChange={handleSetGender}
              onNext={handleNextStep}
            />
          );
        case 1:
          return (
            <StepIdentity
              value={character.identity}
              onChange={handleSetIdentity}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          );
        case 2:
          return (
            <StepAppearance
              hairStyle={character.hairStyle}
              hairColor={character.hairColor}
              eyeColor={character.eyeColor}
              onHairStyleChange={handleSetHairStyle}
              onHairColorChange={handleSetHairColor}
              onEyeColorChange={handleSetEyeColor}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          );
        case 3:
          return (
            <StepName
              name={character.name}
              gender={character.gender}
              onChange={handleSetName}
              onRandomize={handleRandomizeName}
              onNext={handleNextStep}
              onBack={handlePrevStep}
            />
          );
        case 4:
          return (
            <StepSummary
              character={character}
              onConfirm={handleConfirmCharacter}
              onBack={handlePrevStep}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <div
        className={cn(
          'relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-700',
          creatorFadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        )}
      >
        {/* 返回菜单按钮 */}
        <button
          onClick={handleCreatorBackToMenu}
          className="absolute top-6 left-6 px-4 py-2 rounded-lg border border-white/10 bg-white/5 font-game text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          ← タイトルへ
        </button>

        {/* 步骤指示器 */}
        <StepIndicator current={stepIndex} total={4} />

        {/* 步骤标题 */}
        <p className="text-xs text-purple-300/40 tracking-wider mb-6">
          Step {stepIndex + 1} / 4 — {STEP_LABELS[stepIndex]}
        </p>

        {/* 步骤内容 */}
        {stepContent}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {/* 粒子背景层 (始终运行) */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: 0,
              animation: `particle-float ${3 + p.speed * 2}s ease-in-out ${p.delay}s infinite alternate`,
              boxShadow: `0 0 ${p.size * 3}px ${p.size}px rgba(255,255,255,0.1)`,
            }}
          />
        ))}
        {/* 额外星光粒子 */}
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              opacity: 0,
              background: '#fff',
              animation: `star-twinkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 3}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* 暗色遮罩渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0c29]/80" />

      {/* 条件渲染：菜单界面 vs 角色创建界面 */}
      {showCreator ? (
        renderCreator()
      ) : (
        /* ── 主菜单 ── */
        <div
          className={cn(
            'relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000',
            fadeIn ? 'opacity-100' : 'opacity-0',
          )}
        >
          {/* 装饰性上划线 */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
            <span className="text-xs tracking-[0.3em] text-purple-300/60 uppercase">TSF · Reality · CYOA</span>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          </div>

          {/* 主标题 */}
          <h1
            className={cn(
              'font-title text-6xl md:text-8xl text-center leading-tight',
              'bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent',
              'drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]',
              'mb-2 tracking-wider',
            )}
          >
            常識改変の街
          </h1>

          {/* 副标题 */}
          <p className="font-game text-sm md:text-base text-purple-200/70 tracking-[0.5em] mb-10">
            在那個常識被改寫的街道上——你還能保持自我嗎？
          </p>

          {/* 装饰分隔线 */}
          <div className="flex items-center gap-3 mb-12">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-pink-400/40 to-transparent" />
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
          </div>

          {/* 菜单按钮 */}
          <div
            className={cn(
              'flex flex-col items-center gap-4 transition-all duration-700',
              showMenu ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
            )}
          >
            {/* 开始新游戏 */}
            <button
              onClick={handleNewGame}
              className={cn(
                'group relative w-64 px-8 py-3.5 rounded-lg overflow-hidden',
                'border border-purple-500/30 bg-purple-500/10',
                'hover:bg-purple-500/20 hover:border-purple-400/50',
                'transition-all duration-300',
              )}
            >
              <span className="relative z-10 font-game text-lg text-purple-200 group-hover:text-white tracking-wider">
                开始新游戏
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>

            {/* 继续游戏 */}
            <button
              onClick={handleContinue}
              className={cn(
                'w-64 px-8 py-3 rounded-lg',
                'border border-white/10 bg-white/5',
                'hover:bg-white/10 hover:border-white/20',
                'transition-all duration-300',
                'font-game text-sm text-gray-300 hover:text-white tracking-wider',
              )}
            >
              继续游戏
            </button>

            {/* 周目选择（playthrough > 1） */}
            {maxUnlocked > 1 && (
              <div className="mt-4 w-64">
                <p className="text-xs text-gray-500 mb-2 text-center tracking-wider">
                  选择周目
                </p>
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: maxUnlocked }, (_, i) => i + 1).map((pt) => (
                    <button
                      key={pt}
                      onClick={() => handleSelectPlaythrough(pt)}
                      className={cn(
                        'w-10 h-10 rounded-full text-sm transition-all duration-200',
                        pt === playthroughCount
                          ? 'bg-purple-500/40 border-purple-400 text-purple-200 border'
                          : 'bg-white/5 border-white/10 text-gray-400 border hover:bg-white/10 hover:text-white',
                      )}
                    >
                      {pt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部信息 */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2">
            {playthroughCount > 0 && (
              <p className="text-xs text-gray-500 tracking-wider">
                当前周目：第 {playthroughCount} 周目
              </p>
            )}
            <p className="text-[10px] text-gray-600 tracking-widest">
              TSF Reality CYOA v1.0.0
            </p>
            <p className="text-[10px] text-gray-700">
              制作：常識改変プロジェクト
            </p>
          </div>
        </div>
      )}

      {/* 关键帧动画 */}
      <style>{`
        @keyframes particle-float {
          0% { opacity: 0; transform: translateY(0) scale(0.5); }
          50% { opacity: 0.6; transform: translateY(-20px) scale(1); }
          100% { opacity: 0.2; transform: translateY(-40px) scale(0.8); }
        }
        @keyframes star-twinkle {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default TitleScreen;
