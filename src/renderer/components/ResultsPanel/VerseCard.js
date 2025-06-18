import React, { useRef, useEffect } from 'react';

const VerseCard = ({ verse, index, isFocused, onClick }) => {
  const cardRef = useRef(null);
  
  // focus가 변경될 때 스크롤 처리
  useEffect(() => {
    if (isFocused && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [isFocused]);
  
  return (
    <div 
      ref={cardRef}
      className={`verse-card ${isFocused ? 'focused' : ''} ${verse.isAddress ? 'address-card' : ''}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {verse.isAddress ? (
        // 주소 카드 디스플레이
        <div className="address-content">
          <div className="address-title">주소</div>
          <div className="address-text">{verse.displayText}</div>
        </div>
      ) : (
        // 일반 verse 카드 디스플레이
        <>
          <div className="verse-reference">
            {verse.id}절
          </div>
          <div className="verse-text">
            {verse.text}
          </div>
        </>
      )}
    </div>
  );
};

export default VerseCard;