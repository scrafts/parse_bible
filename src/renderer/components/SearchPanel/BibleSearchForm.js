import React, { useState, useRef } from 'react';
import BookDropdown from './BookDropdown.js';
import {
  shouldShowDropdown,
  canProceedToNextField,
  getValidBookName,
  getDropdownItems
} from '../../../data/bible-search.js';

const BibleSearchForm = ({
  bookName,
  setBookName,
  chapter,
  setChapter,
  startVerse,
  setStartVerse,
  endVerse,
  setEndVerse,
  onSearch,
  onReset,
  onInputFocus
}) => {
  // 드롭다운 상태
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownItems, setDropdownItems] = useState([]);
  
  // 한글 입력 상태 추적
  const [isComposing, setIsComposing] = useState(false);

  // refs
  const bookInputRef = useRef(null);
  const chapterInputRef = useRef(null);
  const startVerseInputRef = useRef(null);
  const endVerseInputRef = useRef(null);

  // 성경책 입력 핸들러
  const handleBookNameChange = (e) => {
    const value = e.target.value;
    setBookName(value);
    
    const shouldShow = shouldShowDropdown(value);
    setShowDropdown(shouldShow);
    
    if (shouldShow) {
      const items = getDropdownItems(value);
      setDropdownItems(items);
      setSelectedIndex(-1);
    }
  };

  // 키보드 이벤트 핸들러
  const handleBookNameKeyDown = (e) => {
    // 한글 입력 중일 때는 키보드 네비게이션 무시
    if (isComposing) {
      return;
    }
    
    // Tab 키 처리 (드롭다운 여부와 무관하게 항상 검사)
    if (e.key === 'Tab') {
      if (canProceedToNextField(bookName, selectedIndex)) {
        const validBookName = getValidBookName(bookName, selectedIndex);
        if (validBookName) {
          setBookName(validBookName);
        }
        setShowDropdown(false);
        // TAB은 기본 동작으로 다음 필드로 이동
      } else {
        e.preventDefault(); // TAB 막기
      }
      return;
    }
    
    if (!showDropdown) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < dropdownItems.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectBook(dropdownItems[selectedIndex]);
        }
        break;
        
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // 성경책 선택
  const selectBook = (book) => {
    setBookName(book.korean);
    setShowDropdown(false);
    setSelectedIndex(-1);
    // 한글 입력 완료 후 포커스 이동
    setTimeout(() => {
      chapterInputRef.current?.focus();
    }, 0);
  };

  // 드롭다운 항목 클릭
  const handleDropdownItemClick = (book) => {
    selectBook(book);
  };

  // 숫자만 입력 가능하도록 제한
  const handleNumberInput = (e, setValue) => {
    const value = e.target.value;
    // 숫자만 허용 (빈 문자열도 허용)
    if (value === '' || /^\d+$/.test(value)) {
      setValue(value);
    }
  };

  // 숫자가 아닌 키 입력 방지
  const handleNumberKeyPress = (e) => {
    // Ctrl/Cmd 조합 단축키들은 허용
    if (e.ctrlKey || e.metaKey) {
      return; // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X 등 허용
    }
    
    // 숫자, Backspace, Delete, Tab, Enter, 방향키만 허용
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End' // 커서 이동도 허용
    ];
    
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="bible-search-form">
      {/* 성경책 입력 */}
      <div className="form-group">
        <label htmlFor="bookName">성경책</label>
        <div className="input-container">
          <input
            ref={bookInputRef}
            id="bookName"
            type="text"
            value={bookName}
            onChange={handleBookNameChange}
            onKeyDown={handleBookNameKeyDown}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onFocus={onInputFocus}
            placeholder="성경책을 입력하세요"
            autoComplete="off"
          />
          {showDropdown && (
            <BookDropdown
              items={dropdownItems}
              selectedIndex={selectedIndex}
              onItemClick={handleDropdownItemClick}
            />
          )}
        </div>
      </div>

      {/* 장 입력 */}
      <div className="form-group">
        <label htmlFor="chapter">장</label>
        <input
          ref={chapterInputRef}
          id="chapter"
          type="text"
          value={chapter}
          onChange={(e) => handleNumberInput(e, setChapter)}
          onKeyDown={handleNumberKeyPress}
          onKeyPress={e => {
            if (e.key === 'Enter') {
              onSearch();
            }
          }}
          onFocus={onInputFocus}
          placeholder="장"
          min="1"
        />
      </div>

      {/* 절 범위 입력 */}
      <div className="form-group verse-range">
        <div className="verse-input">
          <label htmlFor="startVerse">시작절</label>
          <input
            ref={startVerseInputRef}
            id="startVerse"
            type="text"
            value={startVerse}
            onChange={(e) => handleNumberInput(e, setStartVerse)}
            onKeyDown={handleNumberKeyPress}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            onFocus={onInputFocus}
            placeholder="시작절"
            min="1"
          />
        </div>
        <div className="verse-input">
          <label htmlFor="endVerse">끝절</label>
          <input
            ref={endVerseInputRef}
            id="endVerse"
            type="text"
            value={endVerse}
            onChange={(e) => handleNumberInput(e, setEndVerse)}
            onKeyDown={handleNumberKeyPress}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            onFocus={onInputFocus}
            placeholder="끝절"
            min="1"
          />
        </div>
      </div>

      {/* 버튼들 */}
      <div className="form-buttons">
        <button type="button" onClick={onSearch} className="search-btn">
          검색
        </button>
        <button type="button" onClick={onReset} className="reset-btn">
          리셋
        </button>
      </div>
    </div>
  );
};

export default BibleSearchForm;