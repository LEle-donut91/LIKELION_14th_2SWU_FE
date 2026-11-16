export const getErrorMessage = (error, fallback = "잠시 후 다시 시도해 주세요.") => {
  const serverMessage = error?.response?.data?.message;

  // 서버가 보낸 안내 문구가 있으면 사용 (빈 문자열 or 공백은 제외)
  if (typeof serverMessage === "string" && serverMessage.trim()) {
    return serverMessage;
  }

  // 그 외(네트워크 오류, 타임아웃, 코드 오류 등)는 개발 환경에서만 원인을 콘솔에 남김
  if (import.meta.env.DEV) console.error(error);

  return fallback;
};

export const getErrorCode = (error) => error?.response?.data?.code ?? null;