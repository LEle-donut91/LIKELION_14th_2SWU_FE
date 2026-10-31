import { useNavigate, useLocation } from "react-router-dom";

/**
 * =====================================================================
 *
 * [request/ 공통] useNavigate 관련 커스텀 훅
 *  - 다음 페이지로 이동
 *  - 이전 페이지로 이동
 *
 * =====================================================================
 */

export function useRequestNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO : 추후 삭제
  // 초기 진입 경로
  // 요청 작성(H-03-02)에서 targetPath를 import 시, 이전 페이지(H-00, H-03, H-03-01-A)에서 넘겨받은 경로 (시작 진입점)가 저장되어 있음. 이때 targetPath에 저장된 실제 값은 이 셋 중 하나 -> '/home', '/situation/detail', '/request/requester'
  const targetPath = location.state?.from;

  // TODO : 추후 삭제
  // 초기 진입 경로에서 최초로 targetPath(from)를 지정하며 다음 화면으로 이동 (요청 흐름을 시작, 초기 진입 경로를 state로 넘겨줌)
  // 사용 예: handleGoStart('/request', '/request/requester')
  const handleGoStart = (nextPath, currentPath, replace = false) => {
    navigate(nextPath, {
      replace,
      state: { from: currentPath },
    });
  };

  // TODO : 추후 삭제
  // 초기 진입 경로로 이동 (targetPath로 이동)
  const handleGoBackToTarget = (replace = false) => {
    const fallbackPath = targetPath || "/home"; // 없다면 "/home"으로 이동
    navigate(fallbackPath, { replace });
  };

  // TODO : 추후 삭제
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

  // 다음 화면으로 이동하는 함수 (인자로 받은 nextpath로 이동)
  const handleGoNext = (nextPath, replace = false) => {
    navigate(nextPath, {
      replace,
    });
  };

  // 다음 화면으로 이동 (인자로 받은 nextpath로 이동, key-value 쌍으로 여러 state를 함께 전달)
  const handleGoNextWithState = (
    nextPath,
    stateObject = {},
    replace = false,
  ) => {
    navigate(nextPath, {
      replace,
      state: {
        ...stateObject,
      },
    });
  };

  return {
    targetPath,
    handleGoStart,
    handleGoBackToTarget,
    handleGoNextWithTarget,
    handleGoBack,
    handleGoNext,
    handleGoNextWithState,
  };
}
