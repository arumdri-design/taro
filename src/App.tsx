import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Moon,
  Shuffle,
  Sparkles,
  Copy,
  RotateCcw,
  Settings,
  Check,
  Star,
  AlertTriangle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Starfield from '@/components/Starfield';
import TarotCardView from '@/components/TarotCardView';
import FanSpread from '@/components/FanSpread';
import ApiKeyModal from '@/components/ApiKeyModal';
import useAmbientBgm from '@/hooks/useAmbientBgm';
import { tarotCards, type TarotCard } from '@/data/tarotCards';
import { readers, type Reader } from '@/data/readers';
import { getTarotReading, type DrawnCard } from '@/services/gemini';

type Stage = 'question' | 'shuffle' | 'select' | 'loading' | 'result';

const MAX_PICKS = 3;
const TOTAL_SHOWN = 78;

const STORAGE_KEY = 'tarot-gemini-key';

function pickRandomCards(count: number): DrawnCard[] {
  const pool = [...tarotCards];
  const picked: DrawnCard[] = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    const card = pool.splice(idx, 1)[0];
    picked.push({ card, reversed: Math.random() < 0.4 });
  }
  return picked;
}

function getCardBriefInfo(card: TarotCard, reversed: boolean) {
  const directionData = reversed ? card.reversed : card.upright;
  const keywords =
    directionData?.keywords?.slice(0, 3).join(' · ') ||
    card.keywords?.slice(0, 3).join(' · ') ||
    '';
  const meaning =
    directionData?.meaning ||
    '새로운 흐름과 내면의 신호가 교차하는 시점입니다.';

  return { keywords, meaning };
}

export default function App() {
  const [stage, setStage] = useState<Stage>('question');
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<DrawnCard[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [revealingIndex, setRevealingIndex] = useState<number | null>(null);
  const [revealFlipped, setRevealFlipped] = useState(false);
  const [reading, setReading] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [manualKey, setManualKey] = useState('');
  const [reader, setReader] = useState<Reader>(readers[0]);
  const bgm = useAmbientBgm();

  const envKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  const apiKey = manualKey || envKey || '';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setManualKey(saved);
  }, []);

  const saveKey = (key: string) => {
    setManualKey(key);
    localStorage.setItem(STORAGE_KEY, key);
  };

  const revealedCards = useMemo(
    () => picked.map((cardIdx) => deck[cardIdx]),
    [deck, picked]
  );

  const revealingItem = useMemo(() => {
    if (revealingIndex === null) return null;
    const drawn = deck[revealingIndex];
    if (!drawn) return null;
    const brief = getCardBriefInfo(drawn.card, drawn.reversed);
    return {
      ...drawn,
      keywords: brief.keywords,
      meaning: brief.meaning,
    };
  }, [revealingIndex, deck]);

  const beginShuffle = useCallback(() => {
    setStage('shuffle');
    setDeck(pickRandomCards(TOTAL_SHOWN));
    setPicked([]);
    setRevealingIndex(null);
    setRevealFlipped(false);
    setReading('');
    setError('');
    setTimeout(() => setStage('select'), 1600);
  }, []);

  const startShuffle = useCallback(() => {
    if (!question.trim()) return;
    bgm.start();
    beginShuffle();
  }, [question, bgm, beginShuffle]);

  // 카드 선택 시 중앙 확대 뒤집기 연출로 진입
  const pickCard = (index: number) => {
    if (
      stage !== 'select' ||
      revealingIndex !== null ||
      picked.includes(index) ||
      picked.length >= MAX_PICKS
    ) {
      return;
    }

    setRevealFlipped(false);
    setRevealingIndex(index);

    requestAnimationFrame(() => {
      setTimeout(() => {
        setRevealFlipped(true);
      }, 90);
    });
  };

  // 확대된 카드를 터치/클릭하면 축소되며 선택 완료 처리
  const confirmRevealedCard = () => {
    if (revealingIndex === null) return;
    const targetIdx = revealingIndex;
    setRevealingIndex(null);
    setRevealFlipped(false);
    setPicked((prev) => (prev.includes(targetIdx) ? prev : [...prev, targetIdx]));
  };

  const showReading = async () => {
    if (picked.length < MAX_PICKS || revealingIndex !== null) return;
    if (!apiKey) {
      setKeyModalOpen(true);
      return;
    }
    setStage('loading');
    setError('');
    try {
      const drawn = picked.map((i) => deck[i]);
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
    try {
      await navigator.clipboard.writeText(
        `[밤하늘 타로 상담 - ${reader.name} 점술가]\n고민: ${question}\n카드: ${revealedCards
          .map((c) => `${c.card.nameKo}(${c.reversed ? '역방향' : '정방향'})`)
          .join(', ')}\n\n${reading}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('복사에 실패했어요. 텍스트를 직접 선택해 주세요.');
    }
  };

  return (
    <div
      className={`starfield-bg min-h-screen min-h-dvh text-mystic-300 font-sans relative overflow-hidden flex flex-col ${
        stage === 'select' ? 'h-dvh' : ''
      }`}
    >
      <Starfield />
      <ApiKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} onSave={saveKey} />

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-3 sm:px-6 sm:pt-5 w-full max-w-lg mx-auto shrink-0">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-gold-400" />
          <span className="font-serif font-bold text-gold-200 text-sm sm:text-base">
            밤하늘 타로 상담소
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={bgm.toggle}
            className="p-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
            aria-label={bgm.playing ? '배경음악 끄기' : '배경음악 켜기'}
          >
            {bgm.playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setKeyModalOpen(true)}
            className="p-2 rounded-full border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-colors"
            aria-label="설정"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {!apiKey && stage !== 'select' && (
        <div className="relative z-10 w-full max-w-lg mx-auto px-4 mt-2 shrink-0">
          <button
            type="button"
            onClick={() => setKeyModalOpen(true)}
            className="w-full flex items-center gap-2 rounded-xl border border-gold-500/40 bg-gold-500/10 px-3 py-2.5 text-left text-xs text-gold-300 hover:bg-gold-500/15 transition-colors"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              AI 해석을 위해 Gemini API 키가 필요해요. 여기를 눌러 입력해 주세요.
            </span>
          </button>
        </div>
      )}

      <main
        className={`relative z-10 w-full max-w-lg mx-auto px-4 sm:px-6 flex-1 ${
          stage === 'select'
            ? 'flex flex-col justify-between overflow-hidden pt-2 pb-3 min-h-0'
            : 'pb-10 overflow-y-auto'
        }`}
      >
        {/* 1단계: 점술가 선택 + 고민 입력 */}
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
                  오늘의 고민
                </label>
                <span className="text-[10px] text-mystic-300/50">{question.length}/500</span>
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
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

              <button
                type="button"
                onClick={startShuffle}
                disabled={!question.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-night-950 shadow-lg shadow-gold-500/20 disabled:opacity-40 disabled:shadow-none hover:shadow-gold-400/30 hover:brightness-110 transition-all active:scale-[0.98]"
              >
                <Shuffle className="w-4 h-4" />
                카드 셔플하기
              </button>
            </div>
          </section>
        )}

        {/* 셔플 중 */}
        {stage === 'shuffle' && (
          <section className="mt-20 sm:mt-28 flex flex-col items-center animate-fade-in">
            <div className="flex gap-2 mb-8">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-14 h-24 sm:w-16 sm:h-28 rounded-lg border border-gold-500/40 bg-night-900 overflow-hidden animate-shuffle"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <img
                    src="/images/card-back.png"
                    alt="카드 뒷면"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="font-serif text-gold-300 text-sm animate-pulse">
              카드를 섞고 있어요...
            </p>
          </section>
        )}

        {/* 2단계: 카드 선택 (스크롤 없이 한 화면에 고정 배치) */}
        {stage === 'select' && (
          <section className="flex flex-col justify-between h-full w-full overflow-hidden min-h-0 animate-fade-in-up">
            <div className="flex flex-col items-center text-center mb-1 shrink-0">
              <p className="text-[11px] text-gold-400 font-serif tracking-widest">{reader.nameEn}</p>
              <h2 className="font-serif text-base sm:text-xl font-bold text-gold-200 mt-0.5">
                {reader.name}가 세 장의 카드를 기다립니다
              </h2>
            </div>

            {/* 스크롤 없이 한 화면에 들어오는 2줄 겹침 덱 영역 */}
            <div className="relative flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden my-1">
              <FanSpread
                deck={deck}
                picked={picked}
                disabled={revealingIndex !== null}
                onPick={pickCard}
              />
            </div>

            <div className="shrink-0">
              {error && (
                <div className="mb-2 flex items-start gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={showReading}
                disabled={picked.length < MAX_PICKS || revealingIndex !== null}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-night-950 shadow-lg shadow-gold-500/20 disabled:opacity-40 disabled:shadow-none hover:brightness-110 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4" />
                {picked.length < MAX_PICKS
                  ? `카드 ${picked.length}/${MAX_PICKS}장 선택됨`
                  : `${reader.name}의 해석 보기`}
              </button>
            </div>
          </section>
        )}

        {/* 로딩 */}
        {stage === 'loading' && (
          <section className="mt-8 flex flex-col items-center animate-fade-in">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-gold-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-gold-400 animate-spin" />
              <Star
                className="absolute inset-0 m-auto w-7 h-7 text-gold-300 animate-pulse"
                strokeWidth={1.2}
              />
            </div>
            <p className="font-serif text-gold-300 text-base animate-pulse">
              별들의 목소리를 듣고 있습니다...
            </p>
            <p className="mt-2 text-xs text-mystic-300/60">
              {reader.name}가 당신의 고민과 카드를 하나로 이어보고 있어요
            </p>
          </section>
        )}

        {/* 4단계: 결과 */}
        {stage === 'result' && (
          <section className="mt-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold gold-text">
                {reader.name}가 전하는 이야기
              </h2>
              <p className="mt-1.5 text-xs text-mystic-300/70 leading-relaxed">
                &ldquo;{question.trim()}&rdquo;
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {revealedCards.map((drawn, i) => (
                <div key={i} className="w-28 sm:w-32">
                  <TarotCardView
                    card={drawn.card}
                    reversed={drawn.reversed}
                    revealed
                    index={i}
                  />
                </div>
              ))}
            </div>

            <article className="rounded-2xl gold-border bg-night-900/70 backdrop-blur-sm p-5 sm:p-6">
              <div className="mb-4">
                <p className="text-[10px] text-gold-400 font-serif tracking-[0.2em]">
                  {reader.nameEn}
                </p>
                <p className="text-sm font-bold font-serif text-gold-200">
                  {reader.name} 점술가
                </p>
                <p className="text-[10px] text-white/85 leading-snug mt-0.5">
                  {reader.trait}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/40" />
                <Moon className="w-4 h-4 text-gold-400" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/40" />
              </div>
              <div className="space-y-4 text-sm text-white/95 leading-[1.8] font-serif whitespace-pre-wrap">
                {reading.split(/(\[[^\]]+\])/g).map((chunk, i) =>
                  chunk.startsWith('[') && chunk.endsWith(']') ? (
                    <p
                      key={i}
                      className="pt-2 font-bold text-gold-300 text-base tracking-wide"
                    >
                      {chunk.slice(1, -1)}
                    </p>
                  ) : (
                    chunk.trim() && <p key={i}>{chunk.trim()}</p>
                  )
                )}
              </div>
            </article>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={beginShuffle}
                className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold border border-gold-500/40 bg-night-800/60 text-gold-300 hover:bg-gold-500/10 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                다시 뽑기
              </button>
              <button
                type="button"
                onClick={copyResult}
                className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold bg-gradient-to-r transition-all active:scale-[0.98] ${
                  copied
                    ? 'from-emerald-500 to-emerald-400 text-night-950'
                    : 'from-gold-500 to-gold-400 text-night-950 hover:brightness-110'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '복사 완료!' : '결과 복사하기'}
              </button>
            </div>
          </section>
        )}
      </main>

      {/* 하단 배너 광고 영역 */}
      {stage !== 'select' && (
        <footer className="relative z-10 w-full max-w-lg mx-auto px-4 pb-6 sm:px-6 shrink-0">
          <div
            aria-label="배너 광고"
            className="w-full min-h-[60px] sm:min-h-[90px] rounded-2xl border border-gold-500/25 bg-night-900/75 backdrop-blur-sm flex items-center justify-center overflow-hidden"
          >
            <span className="text-[10px] tracking-widest text-mystic-300/45 select-none">
              AD BANNER
            </span>
          </div>
        </footer>
      )}

      {/* 카드 선택 시 중앙 확대 뒤집기 + 간단 해석 오버레이 (터치/클릭 시 축소 완료) */}
      {revealingItem && (
        <div
          onClick={confirmRevealedCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') confirmRevealedCard();
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/85 backdrop-blur-sm px-5 py-6 select-none cursor-pointer transition-opacity duration-300 overflow-y-auto"
        >
          <div className="h-2 shrink-0" />

          {/* 세로 영역을 넉넉히 확보해 카드 이미지가 잘리지 않도록 구성 */}
          <div
            className={`w-52 sm:w-60 h-[46dvh] max-h-[420px] min-h-[260px] shrink-0 flex items-center justify-center transition-all duration-500 ease-out ${
              revealFlipped
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-50 opacity-0 translate-y-12'
            }`}
          >
            <div className="w-full h-full flex items-center justify-center [&>*]:h-full [&>*]:w-auto [&>*]:max-w-full">
              <TarotCardView
                card={revealingItem.card}
                reversed={revealingItem.reversed}
                revealed={revealFlipped}
                index={picked.length}
              />
            </div>
          </div>

          {/* 카드 간단 해석 박스 */}
          <div className="w-full max-w-sm shrink-0 flex flex-col items-center">
            <div
              className={`w-full rounded-2xl border border-gold-400/40 bg-night-900/90 px-4 py-3 text-center shadow-xl transition-all duration-500 ${
                revealFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-xs font-serif text-gold-300">
                <span>{revealingItem.card.nameKo}</span>
                <span className="rounded-full border border-gold-400/40 bg-gold-500/15 px-2 py-0.5 text-[10px]">
                  {revealingItem.reversed ? '역방향' : '정방향'}
                </span>
              </div>
{/* 카드 선택 시 중앙 확대 뒤집기 + 간단 해석 오버레이 (터치/클릭 시 축소 완료) */}
      {revealingItem && (
        <div
          onClick={confirmRevealedCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') confirmRevealedCard();
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/85 backdrop-blur-sm px-5 py-6 select-none cursor-pointer transition-opacity duration-300"
        >
          {/* 카드 세로 높이 기준으로 너비가 자동 계산되어 상하단이 잘리지 않음 */}
          <div
            className={`h-[48dvh] max-h-[420px] min-h-[250px] aspect-[2/3] shrink-0 transition-all duration-500 ease-out ${
              revealFlipped
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-50 opacity-0 translate-y-10'
            }`}
          >
            <TarotCardView
              card={revealingItem.card}
              reversed={revealingItem.reversed}
              revealed={revealFlipped}
              fit="contain"
              index={picked.length}
            />
          </div>

          {/* 카드 간단 해석 박스 */}
          <div
            className={`w-full max-w-sm shrink-0 rounded-2xl border border-gold-400/40 bg-night-900/90 px-4 py-3 text-center shadow-xl transition-all duration-500 ${
              revealFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-serif text-gold-300">
              <span>{revealingItem.card.nameKo}</span>
              <span className="rounded-full border border-gold-400/40 bg-gold-500/15 px-2 py-0.5 text-[10px]">
                {revealingItem.reversed ? '역방향' : '정방향'}
              </span>
            </div>
            {revealingItem.keywords && (
              <p className="mt-1 text-[11px] text-gold-200/80">
                #{revealingItem.keywords.replace(/\s·\s/g, ' #')}
              </p>
            )}
            <p className="mt-1.5 text-xs sm:text-sm text-white/95 leading-relaxed font-serif">
              {revealingItem.meaning}
            </p>
          </div>

          <p className="text-xs text-gold-200/80 animate-pulse shrink-0">
            화면을 터치하면 선택이 완료됩니다
          </p>
        </div>
      )}
              <p className="mt-1.5 text-xs sm:text-sm text-white/95 leading-relaxed font-serif">
                {revealingItem.meaning}
              </p>
            </div>

            <p className="mt-3 text-xs text-gold-200/80 animate-pulse">
              화면을 터치하면 선택이 완료됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
