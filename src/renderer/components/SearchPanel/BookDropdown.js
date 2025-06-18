import React from 'react';

const BookDropdown = ({ items, selectedIndex, onItemClick }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="book-dropdown">
      <ul className="dropdown-list">
        {items.map((book, index) => (
          <li
            key={book.id}
            className={`dropdown-item ${index === selectedIndex ? 'selected' : ''}`}
            onClick={() => onItemClick(book)}
            onMouseEnter={() => {
              // 마우스 호버시 선택 상태는 변경하지 않음
              // 키보드 네비게이션과 충돌 방지
            }}
          >
            <div className="book-info">
              <span className="book-korean">{book.korean}</span>
              <span className="book-english">({book.english})</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookDropdown;