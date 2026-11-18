import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Moon,
  Sparkles,
  Copy,
  Settings,
  AlertTriangle,
  Volume2,
  VolumeX,
  Calendar as CalendarIcon,
  User,
  Check,
} from 'lucide-react';
import Starfield from '@/components/Starfield';
import TarotCardView from '@/components/TarotCardView';
import FanSpread from '@/components/FanSpread';
import useAmbientBgm from '@/hooks/useAmbientBgm';
import { tarotCards, type TarotCard } from '@/data/tarotCards';
import { readers, type Reader } from '@/data/readers';
import { getTarotReading, getSajuReading, type DrawnCard } from '@/services/gemini';
import type { SajuInput, SajuGender, SajuCalendar } from '@/data/sajuTypes';

type Stage =
  | 'question'
  | 'shuffle'
  | 'select'
  | 'loading'
  | 'result'
  | 'saju-input'
  | 'saju-loading'
  | 'saju-result';

const SLOT_LABELS = ['첫 번째 카드', '두 번째 카드', '세 번째 카드'] as const;
const MAX_PICKS = 3;
const TOTAL_SHOWN = Math.min(78, tarotCards.length);

function pickRandomCards(count: number): DrawnCard[] {
  const pool = [...tarotCards];
  const picked: DrawnCard[] = [];
  const limit = Math.min(count, pool.length);

  for (let i = 0; i < limit; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const card = pool.splice(idx, 1)[0];
    if (card) {
      picked.push({ card, reversed: Math.random() < 0.4 });
    }
  }
  return picked;
}

function getCardBriefInfo(card: TarotCard | undefined, reversed: boolean) {
  if (!card) {
    return {
      keywords: '',
      meaning: '새로운 흐름과 내면의 신호가 교차하는 시점입니다.',
    };
  }
  const directionData = reversed ? card.reversed : card.upright;
  const rawKeywords = directionData?.keywords ?? [];
  const keywords = Array.isArray(rawKeywords)
    ? rawKeywords.slice(0, 3).join(' · ')
    : '';
  const meaning =
    directionData?.meaning ||
    '새로운 흐름과 내면의 신호가 교차하는 시점입니다.';

  return { keywords, meaning };
}

export default function App() {
  const [stage, setStage] = useState<Stage>('question');
  const [question, setQuestion] = useState('');
  
  // 사주 입력 상태
  const [sajuName, setSajuName] = useState('');
  const [sajuGender, setSajuGender] = useState<SajuGender>('male');
  const [sajuCalendar, setSajuCalendar] = useState<SajuCalendar>('solar');
  const [sajuYear, setSajuYear] = useState('1995');
  const [sajuMonth, setSajuMonth] = useState('5');
  const [sajuDay, setSajuDay] = useState('15');
  const [sajuHour, setSajuHour] = useState('모름');

  const [deck, setDeck] = useState<DrawnCard[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [revealingIndex, setRevealingIndex] = useState<number | null>(null);
  const [revealFlipped, setRevealFlipped] = useState(false);
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [reader, setReader] = useState<Reader>(readers[0]);
  const bgm = useAmbientBgm();

  // 서버리스 백엔드 사용으로 프론트엔드 키 불필요
  const apiKey = 'server-managed';

  const revealedCards = useMemo(
    () =>
      picked
        .map((cardIdx, posIdx) => {
          const drawn = deck[cardIdx];
          if (!drawn || !drawn.card) return null;
          return {
            ...drawn,
            position: SLOT_LABELS[posIdx] ?? `${posIdx + 1}번째 카드`,
          };
        })
        .filter((item): item is DrawnCard & { position: string } => Boolean(item)),
    [deck, picked]
  );

  const revealingItem = useMemo(() => {
    if (revealingIndex === null) return null;
    const drawn = deck[revealingIndex];
    if (!drawn || !drawn.card) return null;
    const brief = getCardBriefInfo(drawn.card, drawn.reversed);
    return {
      ...drawn,
      position: SLOT_LABELS[picked.length] ?? `${picked.length + 1}번째 카드`,
      keywords: brief.keywords,
      meaning: brief.meaning,
    };
  }, [revealingIndex, deck, picked.length]);

  const goHome = useCallback(() => {
    setStage('question');
    setQuestion('');
    setDeck([]);
    setPicked([]);
    setRevealingIndex(null);
    setRevealFlipped(false);
    setReading('');
    setError('');
  }, []);

  const beginShuffle = useCallback(() => {
    if (!question.trim()) return;
    try {
      bgm.start();
    } catch {
      // 무시
    }
    setStage('shuffle');
    setDeck(pickRandomCards(TOTAL_SHOWN));
    setPicked([]);
    setRevealingIndex(null);
    setRevealFlipped(false);
    setReading('');
    setError('');
    setTimeout(() => setStage('select'), 1600);
  }, [question, bgm]);

  const submitSaju = async () => {
    const y = parseInt(sajuYear, 10);
    const m = parseInt(sajuMonth, 10);
    const d = parseInt(sajuDay, 10);
    if (!y || !m || !d) {
      setError('올바른 생년월일을 입력해 주세요.');
      return;
    }

    setStage('saju-loading');
    setError('');

    const input: SajuInput = {
      name: sajuName.trim() || '내담자',
      gender: sajuGender,
      calendar: sajuCalendar,
      birthYear: y,
      birthMonth: m,
      birthDay: d,
      birthHour: sajuHour === '모름' ? undefined : parseInt(sajuHour, 10),
    };

    try {
      const text = await getSajuReading(input, reader, apiKey);
      setReading(text);
      setStage('saju-result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요.');
      setStage('saju-input');
    }
  };

  const pickCard = (index: number) => {
    if (
      stage !== 'select' ||
      revealingIndex !== null ||
      picked.includes(index) ||
      picked.length >= MAX_PICKS ||
      !deck[index]
    ) {
      return;
    }

    setRevealFlipped(false);
    setRevealingIndex(index);

    requestAnimationFrame(() => {
      setTimeout(() => {
        setRevealFlipped(true);
      }, 100);
    });
  };

  const handlePopupClick = () => {
    if (revealFlipped && revealingIndex !== null) {
      const targetIdx = revealingIndex;
      setRevealingIndex(null);
      setRevealFlipped(false);
      setPicked((prev) => (prev.includes(targetIdx) ? prev : [...prev, targetIdx]));
    }
  };

  const showReading = async () => {
    if (picked.length < MAX_PICKS || revealingIndex !== null) return;
    setStage('loading');
    setError('');
    try {
      const drawn = revealedCards.map(({ card, reversed }) => ({ card, reversed }));
      const text = await getTarotReading(
        { question: question.trim(), cards: drawn, reader },
        apiKey
      );
      setReading(text);
      setStage('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했어요.');
      setStage('select');
    }
  };

  const copyResult = async () => {
    const payload = `[밤하늘 타로 상담 - ${reader.name} 점술가]\n고민: ${question}\n카드: ${revealedCards
      .map((c) => `${c.position} - ${c.card.nameKo}(${c.reversed ? '역방향' : '정방향'})`)
      .join(', ')}\n\n${reading}`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = payload;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('복사에 실패했어요. 텍스트를 직접 선택해 주세요.');
    }
  };

  const selectHeader = (title: string, subtitle?: React.ReactNode) => (
    <div className="flex flex-col items-center text-center mb-1 animate-fade-in">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-400/60 shadow-md mb-1.5 mx-auto">
        <img src={reader.image} alt={reader.name} className="w-full h-full object-cover" />
      </div>
      <p className="text-[11px] text-gold-400 font-serif tracking-widest">{reader.nameEn}</p>
      <h2 className="font-serif text-base sm:text-xl font-bold text-gold-200 mt-0.5">{title}</h2>
      {subtitle && <div className="mt-0.5 text-xs text-mystic-300/80">{subtitle}</div>}
    </div>
  );

  return (
    <div className="starfield-bg min-h-screen min-h-dvh text-mystic-300 font-sans relative overflow-x-hidden flex flex-col">
      <Starfield />

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-3 sm:px-6 sm:pt-5 w-full max-w-lg mx-auto shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={goHome}>
          <Moon className="w-5 h-5 text-gold-400" />
          <span className="font-serif font-bold text-gold-200 text-sm sm:text-base">
            밤하늘 타로 상담소
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                bgm.toggle();
              } catch {
                // 무시
              }
            }}
            className="p-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
            aria-label={bgm.playing ? '배경음악 끄기' : '배경음악 켜기'}
          >
            {bgm.playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 flex-1 pb-10">
        {/* 1단계: 점술가 선택 + 고민 입력 + 듀얼 버튼 */}
        {stage === 'question' && (
          <section className="mt-4 animate-fade-in-up">
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl border border-gold-500/35 mb-4 shadow-xl shadow-black/40">
              <img
                src={reader.image}
                alt={`${reader.name} 점술가`}
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night-950/20 to-night-950/80" />

              <div className="relative z-10 flex flex-col justify-end h-full p-4 text-center">
                <p className="mb-3 text-xs sm:text-sm text-white leading-relaxed max-w-xs mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  &ldquo;{reader.greeting}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-2 pb-1">
                  {readers.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setReader(r)}
                      className={`rounded-full px-4 py-1.5 text-xs font-serif font-bold transition-all border backdrop-blur-sm ${
                        reader.id === r.id
                          ? 'border-gold-400 bg-gold-500/30 text-white shadow-sm shadow-gold-500/20'
                          : 'border-white/35 bg-night-950/55 text-white/85 hover:border-gold-400/70 hover:text-white'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl gold-border bg-night-900/70 backdrop-blur-sm p-3">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs text-gold-400 font-serif">
                  오늘의 고민 및 이름
                </label>
                <span className="text-[10px] text-mystic-300/50">{question.length}/500</span>
              </div>
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (!sajuName && e.target.value.trim()) {
                    setSajuName(e.target.value.trim().slice(0, 10));
                  }
                }}
                placeholder="예: 요즘 연애운이 궁금해요. 좋은 인연이 있을까요?"
                rows={2}
                maxLength={500}
                className="w-full resize-none rounded-xl bg-night-800 border border-gold-500/25 px-3 py-2 text-xs sm:text-sm text-gold-100 placeholder:text-mystic-300/40 leading-snug focus:outline-none focus:border-gold-400 transition-colors"
              />
              <div className="flex items-center justify-between gap-1.5 mt-2 mb-3 overflow-x-auto">
                {['연애운', '직업운', '재물운', '오늘의 운세'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuestion(`${tag}이 궁금해요. 앞으로 어떻게 될까요?`)}
                    className="flex-1 whitespace-nowrap rounded-full border border-mystic-500/40 bg-mystic-500/10 px-2 py-1 text-[11px] text-mystic-300 hover:border-gold-400 hover:text-gold-300 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* 하단 동일 크기 듀얼 버튼 */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={beginShuffle}
                  disabled={!question.trim()}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs sm:text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-night-950 shadow-lg shadow-gold-500/20 disabled:opacity-40 disabled:shadow-none hover:brightness-110 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  타로카드로 확인하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (question.trim() && !sajuName) setSajuName(question.trim().slice(0, 10));
                    setStage('saju-input');
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs sm:text-sm font-bold border border-gold-500/50 bg-night-800 text-gold-300 shadow-lg hover:bg-gold-500/10 transition-all active:scale-[0.98]"
                >
                  <CalendarIcon className="w-4 h-4 shrink-0" />
                  사주팔자로 알아보기
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 사주 정보 입력 단계 */}
        {stage === 'saju-input' && (
          <section className="mt-4 animate-fade-in-up">
            {selectHeader(
              `${reader.name}가 사주 명식을 살핍니다`,
              <p>생년월일과 정보를 입력해 주세요</p>
            )}

            <div className="mt-4 rounded-2xl gold-border bg-night-900/80 backdrop-blur-sm p-4 space-y-4">
              <div>
                <label className="block text-xs text-gold-400 font-serif mb-1">성함 (또는 닉네임)</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-gold-400/60" />
                  <input
                    type="text"
                    value={sajuName}
                    onChange={(e) => setSajuName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full rounded-xl bg-night-800 border border-gold-500/25 pl-9 pr-3 py-2.5 text-xs sm:text-sm text-gold-100 placeholder:text-mystic-300/40 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gold-400 font-serif mb-1">성별</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-night-800 p-1 rounded-xl border border-gold-500/25">
                    <button
                      type="button"
                      onClick={() => setSajuGender('male')}
                      className={`py-1.5 text-xs font-serif rounded-lg transition-colors ${
                        sajuGender === 'male' ? 'bg-gold-500 text-night-950 font-bold' : 'text-mystic-300'
                      }`}
                    >
                      남성
                    </button>
                    <button
                      type="button"
                      onClick={() => setSajuGender('female')}
                      className={`py-1.5 text-xs font-serif rounded-lg transition-colors ${
                        sajuGender === 'female' ? 'bg-gold-500 text-night-950 font-bold' : 'text-mystic-300'
                      }`}
                    >
                      여성
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gold-400 font-serif mb-1">양/음력</label>
                  <div className="grid grid-cols-2 gap-1.5 bg-night-800 p-1 rounded-xl border border-gold-500/25">
                    <button
                      type="button"
                      onClick={() => setSajuCalendar('solar')}
                      className={`py-1.5 text-xs font-serif rounded-lg transition-colors ${
                        sajuCalendar === 'solar' ? 'bg-gold-500 text-night-950 font-bold' : 'text-mystic-300'
                      }`}
                    >
                      양력
                    </button>
                    <button
                      type="button"
                      onClick={() => setSajuCalendar('lunar')}
                      className={`py-1.5 text-xs font-serif rounded-lg transition-colors ${
                        sajuCalendar === 'lunar' ? 'bg-gold-500 text-night-950 font-bold' : 'text-mystic-300'
                      }`}
                    >
                      음력
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gold-400 font-serif mb-1">생년월일</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={sajuYear}
                    onChange={(e) => setSajuYear(e.target.value)}
                    placeholder="년도"
                    className="rounded-xl bg-night-800 border border-gold-500/25 px-3 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400 text-center"
                  />
                  <input
                    type="number"
                    value={sajuMonth}
                    onChange={(e) => setSajuMonth(e.target.value)}
