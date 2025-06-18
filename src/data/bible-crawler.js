import { findBookById } from './bible-metadata.js';

/**
 * 성경 구절 크롤링 최종 엔트리 포인트
 * @param {number} bookId - 성경책 번호 (1=창세기, 2=출애굽기, ...)
 * @param {number} chapter - 장 번호
 * @param {number} startVerse - 시작 절 번호
 * @param {number} endVerse - 끝 절 번호
 * @returns {Promise<Array<string>>} 성경 구절 텍스트 배열
 */
export const fetchBibleVerses = async (bookId, chapter, startVerse, endVerse) => {
  // 1. isValidChapter로 장 유효성 검사 유효하지 않으면 []반환
  if (!isValidChapter(bookId, chapter)) {
    return [];
  }
  
  // 2. buildCrawlUrl로 url생성
  const url = buildCrawlUrl(bookId, chapter);
  console.log(`Crawling URL: ${url}`);
  
  // 3. getVersesByUrl로 웹 크롤링. 이 함수의 반환값이 null이면 [] 반환
  const verses = await getVersesByUrl(url);
  if (verses === null) {
    return [];
  }

  // 4. areValidVerses로 절 범위 유효성 검사
  if (!areValidVerses(verses, bookId, chapter, startVerse, endVerse)) {
    return [];
  }

  // 5. 절 범위에 해당하는 구절들만 필터링하여 반환
  if (startVerse === endVerse) {
    return verses.filter(verse => parseInt(verse.id, 10) === startVerse);
  }
  if (startVerse < endVerse) {
    return verses.filter(verse => {
      const verseNumber = parseInt(verse.id, 10);
      return verseNumber >= startVerse && verseNumber <= endVerse;
    });
  }
  
  return verses;
};

/**
 * URL에서 성경 구절 크롤링
 * @param {string} url - 크롤링할 URL
 * @returns {Promise<Array<{id: string, text: string}>|null>} 성경 구절 객체 배열 또는 null
 */
export const getVersesByUrl = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    
    // UTF-8 인코딩으로 텍스트 가져오기
    const arrayBuffer = await response.arrayBuffer();
    const decoder = new TextDecoder('euc-kr');
    const html = decoder.decode(arrayBuffer);
    
    // HTML을 파싱하기 위해 DOMParser 사용
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 프로토타입 함수의 핵심 로직: font.tk4l 셀렉터로 절 요소들 찾기
    const verseElements = doc.querySelectorAll('font.tk4l');
    
    if (verseElements.length === 0) {
      return null;
    }
    console.log(verseElements)
    
    // 각 절을 객체로 변환 (id는 1부터 시작)
    return Array.from(verseElements).map((element, index) => ({
      id: String(index + 1),
      text: element.textContent || element.innerText || ''
    }));
    
  } catch (error) {
    // 네트워크 오류나 파싱 오류 시 null 반환
    return null;
  }
};

/**
 * 크롤링 URL 생성
 * @param {number} bookId - 성경책 번호
 * @param {number} chapter - 장 번호
 * @returns {string} 크롤링 URL
 */
export const buildCrawlUrl = (bookId, chapter) => {
  return `http://www.holybible.or.kr/B_GAE/cgi/bibleftxt.php?VR=GAE&VL=${bookId}&CN=${chapter}&CV=99`;
};

/**
 * 유효한 장 번호인지 검사
 * @param {number} bookId - 성경책 번호
 * @param {number} chapter - 장 번호
 * @returns {boolean} 유효하면 true, 아니면 false
 */
export const isValidChapter = (bookId, chapter) => {
  // 음수와 0 먼저 거르기
  if (chapter <= 0) {
    return false;
  }
  
  // 성경책 찾기
  const book = findBookById(bookId);
  if (!book) {
    return false;
  }
  
  // 해당 성경책의 최대 장 수보다 큰지 확인
  return chapter <= book.chapters;
};

/**
 * 유효한 절 범위인지 검사
 * @param {Array<string>} data - 성경 데이터
 * @param {number} bookId - 성경책 번호
 * @param {number} chapter - 장 번호
 * @param {number} startVerse - 시작 절 번호
 * @param {number} endVerse - 끝 절 번호
 * @returns {boolean} 유효하면 true, 아니면 false
 */
export const areValidVerses = (data, bookId, chapter, startVerse, endVerse) => {
  // 음수와 0 먼저 거르기
  if (startVerse <= 0 || endVerse <= 0) {
    return false;
  }
  
  // 시작절 > 끝절 검사
  if (startVerse > endVerse) {
    return false;
  }
  
  // 데이터가 없거나 길이가 0이면 not valid
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  // 시작절이나 끝절이 배열의 길이보다 작아야함
  if (startVerse > data.length || endVerse > data.length) {
    return false;
  }
  
  return true;
};
