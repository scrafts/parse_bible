import { 
  shouldShowDropdown, 
  canProceedToNextField, 
  getValidBookName, 
  getDropdownItems 
} from '../bible-search.js';

describe('bible-search', () => {
  
  describe('shouldShowDropdown', () => {
    test('빈 입력시 false', () => {
      expect(shouldShowDropdown('')).toBe(false);
      expect(shouldShowDropdown('   ')).toBe(false);
    });

    test('검색 결과가 있으면 true', () => {
      expect(shouldShowDropdown('창')).toBe(true);
      expect(shouldShowDropdown('마')).toBe(true);
    });

    test('정확한 매칭도 true (변경된 로직)', () => {
      expect(shouldShowDropdown('창세기')).toBe(true);
    });

    test('검색 결과가 없으면 false', () => {
      expect(shouldShowDropdown('없는책')).toBe(false);
    });
  });

  describe('canProceedToNextField', () => {
    test('빈 입력시 false', () => {
      expect(canProceedToNextField('')).toBe(false);
    });

    test('정확한 매칭시 true', () => {
      expect(canProceedToNextField('창세기')).toBe(true);
    });

    test('검색 결과 1개시 true (선택 불필요)', () => {
      expect(canProceedToNextField('창')).toBe(true);
    });

    test('검색 결과 여러개시 선택 없으면 false', () => {
      expect(canProceedToNextField('마')).toBe(false);
      expect(canProceedToNextField('마', -1)).toBe(false);
    });

    test('검색 결과 여러개시 선택 있으면 true', () => {
      expect(canProceedToNextField('마', 0)).toBe(true);
      expect(canProceedToNextField('마', 1)).toBe(true);
    });

    test('잘못된 선택 인덱스시 false', () => {
      expect(canProceedToNextField('마', 999)).toBe(false);
      expect(canProceedToNextField('마', -2)).toBe(false);
    });
  });

  describe('getValidBookName', () => {
    test('정확한 매칭시 한글명 반환', () => {
      expect(getValidBookName('창세기')).toBe('창세기');
      expect(getValidBookName('Genesis')).toBe('창세기');
    });

    test('검색 결과 1개시 한글명 반환', () => {
      expect(getValidBookName('창')).toBe('창세기');
    });

    test('검색 결과 여러개시 선택 없으면 null', () => {
      expect(getValidBookName('마')).toBeNull();
    });

    test('빈 입력시 null', () => {
      expect(getValidBookName('')).toBeNull();
    });
  });

  describe('getDropdownItems', () => {
    test('검색 결과 반환', () => {
      const createResults = getDropdownItems('창');
      const markResults = getDropdownItems('마');
      
      expect(Array.isArray(createResults)).toBe(true);
      expect(Array.isArray(markResults)).toBe(true);
      expect(markResults.length).toBeGreaterThan(1);
    });
  });
});