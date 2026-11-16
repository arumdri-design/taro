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
import { tarotCards } from '@/data/tarotCards';
import { readers, type Reader } from '@/data/readers';
import { getTarotReading, type DrawnCard } from '@/services/gemini';

type Stage = 'question' | 'shuffle' | 'select' | 'loading' | 'result';

const POSITIONS = ['과거', '현재', '미래'] as const;
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

export default function App() {
  const [stage, setStage] = useState<Stage>('question');
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<DrawnCard[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
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
    () =>
      picked.map((cardIdx, posIdx) => ({
        ...deck[cardIdx],
        position: POSITIONS[posIdx],
      })),
    [deck, picked]
  );

  const beginShuffle = useCallback(() => {
    setStage('shuffle');
    setDeck(pickRandomCards(TOTAL_SHOWN));
    setPicked([]);
    setReading('');
    setError('');
    setTimeout(() => setStage('select'), 1600);
  }, []);

  const startShuffle = useCallback(() => {
    if (!question.trim()) return;
    bgm.start();
    beginShuffle();
  }, [question, bgm, beginShuffle]);

  const pickCard = (index: number) => {
    if (stage !== 'select' || picked.includes(index) || picked.length >= MAX_PICKS) return;
    setPicked((prev) => [...prev, index]);
  };

  const showReading = async () => {
    if (picked.length < MAX_PICKS) return;
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
          .map((c) => `${c.position} - ${c.card.nameKo}(${c.reversed ? '역방향' : '정방향'})`)
          .join(', ')}\n\n${reading}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('복사에 실패했어요. 텍스트를 직접 선택해 주세요.');
    }
  };

  const selectHeader = (title: string, subtitle?: React.ReactNode) => (
    <div className="flex flex-col items-center text-center mb-4 animate-fade-in">
      <p className="text-xs text-gold-400 font-serif tracking-widest">{reader.nameEn}</p>
      <h2 className="font-serif text-lg sm:text-xl font-bold text-gold-200 mt-0.5">{title}</h2>
      {subtitle && <div className="mt-1 text-xs text-mystic-300/80">{subtitle}</div>}
    </div>
  );

  return (
    <div className="starfield-bg min-h-screen min-h-dvh text-mystic-300 font-sans relative overflow-x-hidden">
      <Starfield />
      <ApiKeyModal open={keyModalOpen} onClose={() => setKeyModalOpen(false)} onSave={saveKey} />

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6 max-w-lg mx-auto">
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

      {!apiKey && (
        <div className="relative z-10 max-w-lg mx-auto px-4 mt-3">
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

      <main className="relative z-10 max-w-lg mx-auto px-4 pb-16 sm:px-6">
        {/* 1단계: 점술가 선택 + 고민 입력 */}
        {stage === 'question' && (
          <section className="mt-4 animate-fade-in-up">
            {/* 1:1 비율 점술가 선택 영역 (선명한 배경 + 하단 선택 버튼) */}
            <div className="relative w-full aspect-square overflow-hidden rounded-2xl border border-gold-500/35 mb-4 shadow-xl shadow-black/40">
              <img
                src={reader.image}
                alt={`${reader.name} 점술가`}
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-night-950/25 via-transparent to-night-950/75" />

              <div className="relative z-10 flex flex-col justify-between h-full p-4 text-center">
                {/* 상단 해석자 문구 */}
                <p className="text-xs sm:text-sm text-white leading-relaxed max-w-xs mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
                  &ldquo;{reader.greeting}&rdquo;
                </p>

                {/* 가장 밑쪽 루나/카이 선택 버튼 */}
                <div className="mt-auto flex items-center justify-center gap-2 pb-1">
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

            {/* 고민 입력 영역 (높이 절반 축소 + 태그 한 줄 출력) */}
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

        {/* 2단계: 카드 선택 */}
        {(stage === 'select' || stage === 'loading') && (
          <section className="mt-5 animate-fade-in-up">
            {selectHeader(
              `${reader.name}가 세 장의 카드를 기다립니다`,
              <p>
                순서대로 <span className="text-gold-300">과거</span> ·{' '}
                <span className="text-gold-300">현재</span> ·{' '}
                <span className="text-gold-300">미래</span>의 카드가 됩니다
              </p>
            )}

            <div className="mt-2 flex items-center justify-center gap-2">
              {POSITIONS.map((pos, i) => (
                <div
                  key={pos}
                  className={`w-12 text-center rounded-full border px-2 py-1 text-[10px] transition-colors ${
                    picked.length > i
                      ? 'border-gold-400 bg-gold-500/20 text-gold-200'
                      : 'border-mystic-500/40 text-mystic-300/60'
                  }`}
                >
                  {pos}
                </div>
              ))}
            </div>

            <FanSpread
              deck={deck}
              picked={picked}
              disabled={stage === 'loading'}
              onPick={pickCard}
            />

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={showReading}
              disabled={picked.length < MAX_PICKS}
              className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-night-950 shadow-lg shadow-gold-500/20 disabled:opacity-40 disabled:shadow-none hover:brightness-110 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              {picked.length < MAX_PICKS
                ? `카드 ${picked.length}/${MAX_PICKS}장 선택됨`
                : `${reader.name}의 해석 보기`}
            </button>
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
                    label={drawn.position}
                    index={i}
                  />
                </div>
              ))}
            </div>

            <article className="rounded-2xl gold-border bg-night-900/70 backdrop-blur-sm p-5 sm:p-6">
              {/* 점술가 프로필 */}
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
      <footer className="relative z-10 max-w-lg mx-auto px-4 pb-6 sm:px-6">
        <div
          aria-label="배너 광고"
          className="w-full min-h-[60px] sm:min-h-[90px] rounded-2xl border border-gold-500/25 bg-night-900/75 backdrop-blur-sm flex items-center justify-center overflow-hidden"
        >
          <span className="text-[10px] tracking-widest text-mystic-300/45 select-none">
            AD BANNER
          </span>
        </div>
      </footer>
    </div>
  );
}
