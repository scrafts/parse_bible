import { disassemble, convertQwertyToHangul } from 'es-hangul';
import { bibleBooks, findBookById, findBookByExactName, hasBookByExactName, findBooksByPartialName } from './bible-metadata.js';

// 입력값으로 성경책 검색 (드롭다운용 - 여러 결과 가능)
export const searchBooks = (input) => {
  return findBooksByPartialName(input);
};

// 정확한 매칭 여부 확인
export const isExactMatch = (input) => {
  return hasBookByExactName(input);
};

// 정확한 매칭된 책 반환
export const getExactBook = (input) => {
  return findBookByExactName(input);
};

// 드롭다운 표시 여부 결정
export const shouldShowDropdown = (input) => {
  if (!input || input.trim() === '') {
    return false; // 빈칸이면 드롭다운 안 보임
  }

  const searchResults = searchBooks(input);
  
  // 검색 결과가 1개 이상이면 드롭다운 보임 (정확한 매칭도 포함)
  return searchResults.length > 0;
};

// TAB 허용 여부 확인
export const canProceedToNextField = (input, selectedIndex = -1) => {
  if (!input || input.trim() === '') {
    return false;
  }

  // 정확한 매칭이면 항상 허용
  if (isExactMatch(input)) {
    return true;
  }

  const searchResults = searchBooks(input);
  
  // 검색 결과가 1개면 방향키 선택 없이도 허용
  if (searchResults.length === 1) {
    return true;
  }

  // 검색 결과가 여러 개면 반드시 선택되어야 함
  if (searchResults.length > 1) {
    return selectedIndex >= 0 && selectedIndex < searchResults.length;
  }

  // 검색 결과가 없으면 불허용
  return false;
};

// 현재 유효한 책 이름 반환 (TAB 시 자동완성용)
export const getValidBookName = (input, selectedIndex = -1) => {
  if (!input || input.trim() === '') {
    return null;
  }

  // 정확한 매칭이 있으면 그대로 반환
  const exactBook = getExactBook(input);
  if (exactBook) {
    return exactBook.korean;
  }

  const searchResults = searchBooks(input);
  
  // 검색 결과가 1개면 그것을 반환
  if (searchResults.length === 1) {
    return searchResults[0].korean;
  }

  // 검색 결과가 여러 개이고 선택된 인덱스가 유효하면 선택된 것 반환
  if (searchResults.length > 1 && selectedIndex >= 0 && selectedIndex < searchResults.length) {
    return searchResults[selectedIndex].korean;
  }

  return null;
};

// 드롭다운에서 방향키로 선택할 때 사용할 데이터
export const getDropdownItems = (input) => {
  return searchBooks(input);
};