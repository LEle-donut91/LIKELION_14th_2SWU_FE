// Access Token 보관 (API 명세서 A-01 로그인: "프론트에서 메모리에 보관")
// - localStorage에 저장하지 않고 변수에만 둠 → 새로고침하면 사라짐
// - 새로고침 후 첫 요청이 401이면 axiosInstance가 Refresh Token 쿠키로 자동 재발급함

let accessToken = null;

export const getAccessToken = () => accessToken; // 현재 토큰 꺼내기

export const setAccessToken = (token) => {
  accessToken = token; // 로그인·재발급 성공 시 저장
};

export const clearAccessToken = () => {
  accessToken = null; // 로그아웃·재발급 실패 시 삭제
};