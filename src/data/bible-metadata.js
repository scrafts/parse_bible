import { disassemble, convertQwertyToHangul } from 'es-hangul';

const bibleBooks = [
  // 구약 39권
  { id: 1, korean: "창세기", english: "Genesis", englishShort: "Gen", testament: "old", chapters: 50 },
  { id: 2, korean: "출애굽기", english: "Exodus", englishShort: "Exo", testament: "old", chapters: 40 },
  { id: 3, korean: "레위기", english: "Leviticus", englishShort: "Lev", testament: "old", chapters: 27 },
  { id: 4, korean: "민수기", english: "Numbers", englishShort: "Num", testament: "old", chapters: 36 },
  { id: 5, korean: "신명기", english: "Deuteronomy", englishShort: "Deu", testament: "old", chapters: 34 },
  { id: 6, korean: "여호수아", english: "Joshua", englishShort: "Jos", testament: "old", chapters: 24 },
  { id: 7, korean: "사사기", english: "Judges", englishShort: "Jdg", testament: "old", chapters: 21 },
  { id: 8, korean: "룻기", english: "Ruth", englishShort: "Rut", testament: "old", chapters: 4 },
  { id: 9, korean: "사무엘상", english: "1 Samuel", englishShort: "1Sa", testament: "old", chapters: 31 },
  { id: 10, korean: "사무엘하", english: "2 Samuel", englishShort: "2Sa", testament: "old", chapters: 24 },
  { id: 11, korean: "열왕기상", english: "1 Kings", englishShort: "1Ki", testament: "old", chapters: 22 },
  { id: 12, korean: "열왕기하", english: "2 Kings", englishShort: "2Ki", testament: "old", chapters: 25 },
  { id: 13, korean: "역대상", english: "1 Chronicles", englishShort: "1Ch", testament: "old", chapters: 29 },
  { id: 14, korean: "역대하", english: "2 Chronicles", englishShort: "2Ch", testament: "old", chapters: 36 },
  { id: 15, korean: "에스라", english: "Ezra", englishShort: "Ezr", testament: "old", chapters: 10 },
  { id: 16, korean: "느헤미야", english: "Nehemiah", englishShort: "Neh", testament: "old", chapters: 13 },
  { id: 17, korean: "에스더", english: "Esther", englishShort: "Est", testament: "old", chapters: 10 },
  { id: 18, korean: "욥기", english: "Job", englishShort: "Job", testament: "old", chapters: 42 },
  { id: 19, korean: "시편", english: "Psalms", englishShort: "Psa", testament: "old", chapters: 150 },
  { id: 20, korean: "잠언", english: "Proverbs", englishShort: "Pro", testament: "old", chapters: 31 },
  { id: 21, korean: "전도서", english: "Ecclesiastes", englishShort: "Ecc", testament: "old", chapters: 12 },
  { id: 22, korean: "아가", english: "Song of Solomon", englishShort: "Sng", testament: "old", chapters: 8 },
  { id: 23, korean: "이사야", english: "Isaiah", englishShort: "Isa", testament: "old", chapters: 66 },
  { id: 24, korean: "예레미야", english: "Jeremiah", englishShort: "Jer", testament: "old", chapters: 52 },
  { id: 25, korean: "예레미야애가", english: "Lamentations", englishShort: "Lam", testament: "old", chapters: 5 },
  { id: 26, korean: "에스겔", english: "Ezekiel", englishShort: "Eze", testament: "old", chapters: 48 },
  { id: 27, korean: "다니엘", english: "Daniel", englishShort: "Dan", testament: "old", chapters: 12 },
  { id: 28, korean: "호세아", english: "Hosea", englishShort: "Hos", testament: "old", chapters: 14 },
  { id: 29, korean: "요엘", english: "Joel", englishShort: "Joe", testament: "old", chapters: 3 },
  { id: 30, korean: "아모스", english: "Amos", englishShort: "Amo", testament: "old", chapters: 9 },
  { id: 31, korean: "오바댜", english: "Obadiah", englishShort: "Oba", testament: "old", chapters: 1 },
  { id: 32, korean: "요나", english: "Jonah", englishShort: "Jon", testament: "old", chapters: 4 },
  { id: 33, korean: "미가", english: "Micah", englishShort: "Mic", testament: "old", chapters: 7 },
  { id: 34, korean: "나훔", english: "Nahum", englishShort: "Nah", testament: "old", chapters: 3 },
  { id: 35, korean: "하박국", english: "Habakkuk", englishShort: "Hab", testament: "old", chapters: 3 },
  { id: 36, korean: "스바냐", english: "Zephaniah", englishShort: "Zep", testament: "old", chapters: 3 },
  { id: 37, korean: "학개", english: "Haggai", englishShort: "Hag", testament: "old", chapters: 2 },
  { id: 38, korean: "스가랴", english: "Zechariah", englishShort: "Zec", testament: "old", chapters: 14 },
  { id: 39, korean: "말라기", english: "Malachi", englishShort: "Mal", testament: "old", chapters: 4 },
  
  // 신약 27권
  { id: 40, korean: "마태복음", english: "Matthew", englishShort: "Mat", testament: "new", chapters: 28 },
  { id: 41, korean: "마가복음", english: "Mark", englishShort: "Mar", testament: "new", chapters: 16 },
  { id: 42, korean: "누가복음", english: "Luke", englishShort: "Luk", testament: "new", chapters: 24 },
  { id: 43, korean: "요한복음", english: "John", englishShort: "Joh", testament: "new", chapters: 21 },
  { id: 44, korean: "사도행전", english: "Acts", englishShort: "Act", testament: "new", chapters: 28 },
  { id: 45, korean: "로마서", english: "Romans", englishShort: "Rom", testament: "new", chapters: 16 },
  { id: 46, korean: "고린도전서", english: "1 Corinthians", englishShort: "1Co", testament: "new", chapters: 16 },
  { id: 47, korean: "고린도후서", english: "2 Corinthians", englishShort: "2Co", testament: "new", chapters: 13 },
  { id: 48, korean: "갈라디아서", english: "Galatians", englishShort: "Gal", testament: "new", chapters: 6 },
  { id: 49, korean: "에베소서", english: "Ephesians", englishShort: "Eph", testament: "new", chapters: 6 },
  { id: 50, korean: "빌립보서", english: "Philippians", englishShort: "Phi", testament: "new", chapters: 4 },
  { id: 51, korean: "골로새서", english: "Colossians", englishShort: "Col", testament: "new", chapters: 4 },
  { id: 52, korean: "데살로니가전서", english: "1 Thessalonians", englishShort: "1Th", testament: "new", chapters: 5 },
  { id: 53, korean: "데살로니가후서", english: "2 Thessalonians", englishShort: "2Th", testament: "new", chapters: 3 },
  { id: 54, korean: "디모데전서", english: "1 Timothy", englishShort: "1Ti", testament: "new", chapters: 6 },
  { id: 55, korean: "디모데후서", english: "2 Timothy", englishShort: "2Ti", testament: "new", chapters: 4 },
  { id: 56, korean: "디도서", english: "Titus", englishShort: "Tit", testament: "new", chapters: 3 },
  { id: 57, korean: "빌레몬서", english: "Philemon", englishShort: "Phm", testament: "new", chapters: 1 },
  { id: 58, korean: "히브리서", english: "Hebrews", englishShort: "Heb", testament: "new", chapters: 13 },
  { id: 59, korean: "야고보서", english: "James", englishShort: "Jas", testament: "new", chapters: 5 },
  { id: 60, korean: "베드로전서", english: "1 Peter", englishShort: "1Pe", testament: "new", chapters: 5 },
  { id: 61, korean: "베드로후서", english: "2 Peter", englishShort: "2Pe", testament: "new", chapters: 3 },
  { id: 62, korean: "요한일서", english: "1 John", englishShort: "1Jn", testament: "new", chapters: 5 },
  { id: 63, korean: "요한이서", english: "2 John", englishShort: "2Jn", testament: "new", chapters: 1 },
  { id: 64, korean: "요한삼서", english: "3 John", englishShort: "3Jn", testament: "new", chapters: 1 },
  { id: 65, korean: "유다서", english: "Jude", englishShort: "Jud", testament: "new", chapters: 1 },
  { id: 66, korean: "요한계시록", english: "Revelation", englishShort: "Rev", testament: "new", chapters: 22 }
];

const hangulIncludes = (target, searchTerm) => {
  if (!target || !searchTerm) return false;
  
  try {
    // 둘 다 분리하고 공백 제거
    const disassembledTarget = disassemble(target).replace(/\s/g, '');
    const disassembledSearch = disassemble(searchTerm).replace(/\s/g, '');
    
    return disassembledTarget.includes(disassembledSearch);
  } catch (error) {
    // 정규식 에러나 기타 파싱 에러 시 조용히 false 반환
    return false;
  }
};

/**
 * 성경책 ID로 성경책 정보 찾기
 * @param {number} bookId - 성경책 번호
 * @returns {Object|null} 성경책 정보 또는 null
 */
export const findBookById = (bookId) => {
  return bibleBooks.find(b => b.id === bookId) || null;
};

/**
 * 정확한 이름으로 성경책 찾기
 * @param {string} input - 입력값 (한글, 영어, QWERTY 변환)
 * @returns {Object|null} 성경책 정보 또는 null
 */
export const findBookByExactName = (input) => {
  if (!input || input.trim() === '') {
    return null;
  }

  const trimmedInput = input.trim();
  const lowerInput = trimmedInput.toLowerCase();
  
  let convertedInput = trimmedInput;
  try {
    convertedInput = convertQwertyToHangul(trimmedInput);
  } catch (error) {
    // QWERTY 변환 실패 시 원본 값 사용
    convertedInput = trimmedInput;
  }

  return bibleBooks.find(book =>
    book.korean === trimmedInput ||
    book.korean === convertedInput ||  // QWERTY 변환 정확 매칭
    book.english.toLowerCase() === lowerInput ||
    book.englishShort.toLowerCase() === lowerInput
  ) || null;
};

/**
 * 정확한 이름 매칭 여부 확인
 * @param {string} input - 입력값 (한글, 영어, QWERTY 변환)
 * @returns {boolean} 정확히 매칭되면 true, 아니면 false
 */
export const hasBookByExactName = (input) => {
  if (!input || input.trim() === '') {
    return false;
  }

  const trimmedInput = input.trim();
  const lowerInput = trimmedInput.toLowerCase();
  
  let convertedInput = trimmedInput;
  try {
    convertedInput = convertQwertyToHangul(trimmedInput);
  } catch (error) {
    // QWERTY 변환 실패 시 원본 값 사용
    convertedInput = trimmedInput;
  }

  return bibleBooks.some(book =>
    book.korean === trimmedInput ||
    book.korean === convertedInput ||  // QWERTY 변환 정확 매칭
    book.english.toLowerCase() === lowerInput ||
    book.englishShort.toLowerCase() === lowerInput
  );
};

/**
 * 부분 이름으로 성경책들 찾기
 * @param {string} input - 입력값 (한글, 영어, QWERTY 변환)
 * @returns {Array} 매칭되는 성경책 배열
 */
export const findBooksByPartialName = (input) => {
  if (!input || input.trim() === '') {
    return [];
  }

  const trimmedInput = input.trim();
  const lowerInput = trimmedInput.toLowerCase();
  
  let convertedInput = trimmedInput;
  try {
    convertedInput = convertQwertyToHangul(trimmedInput);
  } catch (error) {
    // QWERTY 변환 실패 시 원본 값 사용
    convertedInput = trimmedInput;
  }

  return bibleBooks.filter(book => 
    hangulIncludes(book.korean, trimmedInput) ||  // 원본 한글 검색
    hangulIncludes(book.korean, convertedInput) ||  // QWERTY 변환 검색
    book.english.toLowerCase().includes(lowerInput) ||  // 영어 부분 검색
    book.englishShort.toLowerCase().includes(lowerInput)  // 영어 축약 검색
  );
};

export { bibleBooks };