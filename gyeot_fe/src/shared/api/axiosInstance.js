import axios from "axios";
import { AUTH_API_URLS } from "@/shared/constants/apiUrlConstants";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/shared/api/accessToken";

// 공통 설정
// - baseURL: 로컬은 비워두고 /api 상대 경로 + Vite proxy 사용, 배포 환경은 env에 백엔드 주소 등록
// - withCredentials: Refresh Token(HttpOnly 쿠키)을 주고받기 위해 필요
const baseConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
};

// env에 등록된 baseURL 연결 (모든 API 요청에 사용)
export const axiosInstance = axios.create(baseConfig);

// 토큰 재발급·CSRF 조회 전용 (인터셉터 없음 → 재발급 실패가 다시 재발급을 부르는 무한 반복 방지)
const authClient = axios.create(baseConfig);

// 401이 나도 재발급을 시도하지 않을 요청 (인증 API 자체)
const NO_REFRESH_URLS = [
  AUTH_API_URLS.signup,
  AUTH_API_URLS.login,
  AUTH_API_URLS.refresh,
  AUTH_API_URLS.logout,
  AUTH_API_URLS.csrf,
];

/**
 * CSRF 토큰 헤더 만들기 (GET /api/auth/csrf)
 * - Refresh Token 쿠키가 포함된 상태 변경 요청(재발급·로그아웃)에 X-XSRF-TOKEN 헤더로 전달
 */
export const getCsrfHeaders = async () => {
  const response = await authClient.get(AUTH_API_URLS.csrf);
  return { "X-XSRF-TOKEN": response.data.data.token };
};

// 재발급 요청이 동시에 여러 번 나가지 않도록 진행 중인 요청을 하나만 유지
let refreshPromise = null;

/**
 * Access Token 재발급 (POST /api/auth/refresh)
 * - Refresh Token 쿠키 + CSRF 헤더로 요청 → 새 Access Token을 메모리에 저장
 * → 새 Access Token 반환
 */
export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const headers = await getCsrfHeaders();
      const response = await authClient.post(AUTH_API_URLS.refresh, null, { headers });
      const { accessToken } = response.data.data;
      setAccessToken(accessToken);
      return accessToken;
    })().finally(() => {
      refreshPromise = null; // 끝나면 다음 재발급을 받을 수 있게 비움
    });
  }
  return refreshPromise;
};

// 요청 보내기 전: Access Token이 있으면 Authorization 헤더에 첨부
axiosInstance.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 받은 후: 401이면 한 번만 재발급하고 원래 요청을 다시 보냄
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthUrl = NO_REFRESH_URLS.includes(config?.url);

    // 401이 아니거나, 이미 다시 보낸 요청이거나, 인증 API 자체면 그대로 에러 전달
    if (response?.status !== 401 || !config || config._retry || isAuthUrl) {
      return Promise.reject(error);
    }

    config._retry = true; // 같은 요청으로 재발급을 반복하지 않도록 표시

    try {
      const accessToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
      return axiosInstance(config); // 새 토큰으로 원래 요청 다시 보내기
    } catch (refreshError) {
      // 재발급 실패 (쿠키 없음·만료·폐기 등) → 로그아웃 상태로 전환하고 시작 화면(A-01)으로 이동
      clearAccessToken();
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
      return Promise.reject(refreshError);
    }
  },
);