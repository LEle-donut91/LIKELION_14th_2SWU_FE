import { axiosInstance, getCsrfHeaders } from "@/shared/api/axiosInstance";
import { AUTH_API_URLS } from "@/shared/constants/apiUrlConstants";

// 회원가입·로그인·로그아웃 API (API 명세서 A-01 회원가입·로그인)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useMutation 쪽에서)
// - A 영역은 명세 확정 + 서버 배포 완료라 목업 없이 실제 서버로 요청
// - Access Token 재발급·CSRF 조회는 모든 API가 함께 쓰므로 shared/api/axiosInstance.js에 있음
// - 이미 로그인한 적 있는 브라우저는 Refresh Token 쿠키가 같이 전송되므로
//   회원가입·로그인도 CSRF 헤더를 함께 보냄 (없으면 403 FORBIDDEN)

// 1. 회원가입 (POST /api/auth/signup)
// - privacyConsent: 개인정보 제공 동의 (true만 허용)
// → data: { userId }  (가입 후 자동 로그인은 하지 않음)
export const postSignupApi = async ({ email, password, name, privacyConsent }) => {
  const headers = await getCsrfHeaders(); // 쿠키가 남아 있어도 막히지 않도록 CSRF 헤더 첨부
  const response = await axiosInstance.post(
    AUTH_API_URLS.signup,
    { email, password, name, privacyConsent },
    { headers },
  );
  return response.data;
};

// 2. 로그인 (POST /api/auth/login)
// → data: { accessToken, tokenType, expiresIn }
//   (Refresh Token은 응답 본문이 아니라 HttpOnly 쿠키로 받음)
export const postLoginApi = async ({ email, password }) => {
  const headers = await getCsrfHeaders(); // 쿠키가 남아 있어도 막히지 않도록 CSRF 헤더 첨부
  const response = await axiosInstance.post(AUTH_API_URLS.login, { email, password }, { headers });
  return response.data;
};

// 3. 로그아웃 (POST /api/auth/logout)
// - Refresh Token 쿠키가 포함된 상태 변경 요청이라 CSRF 헤더를 함께 보냄
// → data: null
export const postLogoutApi = async () => {
  const headers = await getCsrfHeaders();
  const response = await axiosInstance.post(AUTH_API_URLS.logout, null, { headers });
  return response.data;
};