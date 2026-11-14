import { useState } from 'react';
import { KeyRound, X, MoonStar } from 'lucide-react';

interface ApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export default function ApiKeyModal({ open, onClose, onSave }: ApiKeyModalProps) {
  const [value, setValue] = useState('');

  if (!open) return null;

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSave(trimmed);
    setValue('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-2xl gold-border bg-night-900 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <MoonStar className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif font-bold text-gold-200">설정</h2>
          </div>
          <button
            onClick={onClose}
            className="text-mystic-300/70 hover:text-gold-300 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-mystic-300/90 leading-relaxed mb-4">
          Google Gemini API 키를 입력하면 별들의 메시지를 들을 수 있어요.
          키는 이 브라우저에만 저장되고 서버로 전송되지 않아요.
        </p>
        <div className="relative mb-4">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/70" />
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="AIza로 시작하는 API 키"
            className="w-full rounded-xl bg-night-800 border border-gold-500/30 pl-9 pr-3 py-2.5 text-sm text-gold-100 placeholder:text-mystic-300/40 focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={!value.trim()}
          className="w-full rounded-xl py-2.5 text-sm font-bold bg-gradient-to-r from-gold-500 to-gold-400 text-night-950 disabled:opacity-40 hover:from-gold-400 hover:to-gold-300 transition-all"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
