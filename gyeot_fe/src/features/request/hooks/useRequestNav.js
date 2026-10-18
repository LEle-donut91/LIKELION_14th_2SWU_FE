import { useNavigate, useLocation } from "react-router-dom";

export function useRequestNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // 초기 진입 경로
  // 요청 작성(H-03-02)에서 targetPath를 import 시, 이전 페이지(H-00, H-03, H-03-01-A)에서 넘겨받은 경로 (시작 진입점)가 저장되어 있음. 이때 targetPath에 저장된 실제 값은 이 셋 중 하나 -> '/home', '/situation/detail', '/request/requester'
  const targetPath = location.state?.from;

  // 초기 진입 경로에서 최초로 targetPath(from)를 지정하며 다음 화면으로 이동 (요청 흐름을 시작, 초기 진입 경로를 state로 넘겨줌)
  // 사용 예: handleGoStart('/request', '/request/requester')
  const handleGoStart = (nextPath, currentPath, replace = false) => {
    navigate(nextPath, {
      replace,
      state: { from: currentPath },
    });
  };

  // 초기 진입 경로로 이동 (targetPath로 이동)
  const handleGoBackToTarget = (replace = false) => {
    const fallbackPath = targetPath || "/home"; // 없다면 "/home"으로 이동
    navigate(fallbackPath, { replace });
  };

  // 다음 화면으로 이동 (targetPath를 state로 넘겨줌)
  const handleGoNextWithTarget = (nextPath, replace = false) => {
    navigate(nextPath, {
      replace,
      state: { from: targetPath },
    });
  };

  // 이전 페이지로 이동하는 함수
  const handleGoBack = (replace = false) => {
    navigate(-1, { replace });
  };

  // 다음 화면으로 이동 (targetPath를 state로 넘겨주지 X)
  const handleGoNext = (nextPath, replace = false) => {
    navigate(nextPath, {
      replace,
    });
  };

  return {
    targetPath,
    handleGoStart,
    handleGoBackToTarget,
    handleGoNextWithTarget,
    handleGoBack,
    handleGoNext,
  };
}
