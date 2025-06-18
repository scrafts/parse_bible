import React from 'react';
import VerseCard from './VerseCard.js';

const VersesList = ({ verses, focusedVerseIndex, onVerseCardClick }) => {
  if (!verses || verses.length === 0) {
    return (
      <div className="verses-list empty">
        <p>검색된 구절이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="verses-list">
      {verses.map((verse, index) => (
        <VerseCard
          key={`${verse.id}-${index}`}
          verse={verse}
          index={index}
          isFocused={index === focusedVerseIndex}
          onClick={() => onVerseCardClick(index)}
        />
      ))}
    </div>
  );
};

export default VersesList;