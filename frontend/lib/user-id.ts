const USER_ID_KEY = 'user_id';

/**
 * UUID v4 생성
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 사용자 ID 가져오기 (없으면 생성)
 */
export function getUserId(): string {
  if (typeof window === 'undefined') {
    return ''; // 서버 사이드에서는 빈 문자열 반환
  }

  let userId = localStorage.getItem(USER_ID_KEY);

  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(USER_ID_KEY, userId);
  }

  return userId;
}

/**
 * 사용자 ID 초기화 (개발/테스트용)
 */
export function clearUserId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_ID_KEY);
  }
}
