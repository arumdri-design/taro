import { useCallback, useEffect, useRef, useState } from 'react';

type Nodes = {
  ctx: AudioContext;
  master: GainNode;
  stopArp: () => void;
  stopPad: () => void;
};

// 아주 느린 템포 (약 58 BPM 기준): 여백이 많은 앰비언트
// 음표는 드문드문, 낮은 음역 중심으로 재구성
const ARP_STEP = 3.4; // seconds per note (약 58 BPM의 4분음표보다 훨씬 긴 간격)
const ARP_NOTES = [220, 329.63, 261.63, 440, 392, 261.63]; // A3 E4 C4 A4 G4 C4 — 잔잔한 A minor

// 낮은 베이스 패드 화음 (Am -> F -> C -> G, 낮은 음역)
const PAD_CHORDS: number[][] = [
  [55, 110, 164.81],
  [43.65, 87.31, 174.61],
  [65.41, 130.81, 261.63],
  [49, 98, 196],
];
const PAD_LENGTH = 13.6; // seconds per chord (아주 느린 전환)

function useAmbientBgm() {
  const nodesRef = useRef<Nodes | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    nodes.stopArp();
    nodes.stopPad();
    const { master } = nodes;
    master.gain.cancelScheduledValues(nodes.ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, nodes.ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, nodes.ctx.currentTime + 1.5);
    setTimeout(() => {
      nodes.ctx.close().catch(() => {});
    }, 1800);
    nodesRef.current = null;
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (nodesRef.current) return;
    type WindowWithLegacyAudio = Window & { webkitAudioContext?: typeof AudioContext };
    const Ctor = window.AudioContext || (window as WindowWithLegacyAudio).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    void ctx.resume().catch(() => {});

    // 부드럽고 어둡게: 낮은 로우패스 컷오프
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.3;

    // 긴 잔향 느낌: 딜레이 타임을 길게, 피드백을 높게
    const delay = ctx.createDelay(4);
    delay.delayTime.value = 1.1;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.5;
    const wet = ctx.createGain();
    wet.gain.value = 0.45;

    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 4);

    filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    filter.connect(master);
    wet.connect(master);
    master.connect(ctx.destination);

    // 드문드문 울리는 오르골/하프 음표
    let arpTimer: number | undefined;
    let arpIndex = 0;
    const playArpNote = () => {
      const freq = ARP_NOTES[arpIndex % ARP_NOTES.length];
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq * 2;
      const body = ctx.createOscillator();
      body.type = 'sine';
      body.frequency.value = freq;
      const gain = ctx.createGain();
      // 아주 천천히 울리고 길게 사라지는 잔향형 엔벨로프
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.32, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
      osc.connect(gain);
      body.connect(gain);
      gain.connect(filter);
      osc.start(t);
      body.start(t);
      osc.stop(t + 4.6);
      body.stop(t + 4.6);
      arpIndex++;
    };
    playArpNote();
    arpTimer = window.setInterval(playArpNote, ARP_STEP * 1000);

    // 낮은 베이스 패드
    let padTimer: number | undefined;
    let chordIndex = 0;
    const playPadChord = () => {
      const chord = PAD_CHORDS[chordIndex % PAD_CHORDS.length];
      const t = ctx.currentTime;
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const detune = ctx.createOscillator();
        detune.type = 'sine';
        detune.frequency.value = freq * 1.004;
        const gain = ctx.createGain();
        // 가장 낮은 음(베이스)은 작게, 위 음은 은은하게
        const level = i === 0 ? 0.14 : 0.07;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(level, t + 4.5);
        gain.gain.setValueAtTime(level, t + PAD_LENGTH - 4.5);
        gain.gain.linearRampToValueAtTime(0.0001, t + PAD_LENGTH);
        osc.connect(gain);
        detune.connect(gain);
        gain.connect(filter);
        osc.start(t);
        detune.start(t);
        osc.stop(t + PAD_LENGTH + 0.1);
        detune.stop(t + PAD_LENGTH + 0.1);
      });
      chordIndex++;
    };
    playPadChord();
    padTimer = window.setInterval(playPadChord, PAD_LENGTH * 1000);

    nodesRef.current = {
      ctx,
      master,
      stopArp: () => window.clearInterval(arpTimer),
      stopPad: () => window.clearInterval(padTimer),
    };
    setPlaying(true);
  }, []);

  useEffect(() => stop, [stop]);

  const toggle = useCallback(() => {
    if (nodesRef.current) stop();
    else start();
  }, [start, stop]);

  return { playing, toggle, start, stop };
}

export default useAmbientBgm;
