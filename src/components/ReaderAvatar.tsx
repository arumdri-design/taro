import { useState } from 'react';
import { readers, type Reader } from '@/data/readers';
import { lunaImageUrl, kaiImageUrl } from '@/config/readerImages';

const fallbackUrls: Record<Reader['id'], string> = {
  luna: lunaImageUrl || '/readers/luna.png',
  kai: kaiImageUrl || '/readers/kai.png',
};

interface ReaderAvatarProps {
  readerId: Reader['id'];
  className?: string;
  hidden?: boolean;
}

export default function ReaderAvatar({
  readerId,
  className = '',
  hidden = false,
}: ReaderAvatarProps) {
  if (hidden) {
    return null;
  }

  const reader = readers.find((r) => r.id === readerId);
  const primarySrc = reader?.image || fallbackUrls[readerId];
  const [imgSrc, setImgSrc] = useState(primarySrc);

  const handleError = () => {
    const backup = fallbackUrls[readerId];
    if (imgSrc !== backup) {
      setImgSrc(backup);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={reader ? `${reader.name} 점술가` : '점술가'}
      onError={handleError}
      className={`${className} object-cover block select-none`}
      draggable={false}
    />
  );
}
