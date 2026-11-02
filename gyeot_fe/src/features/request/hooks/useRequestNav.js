import { useNavigate } from "react-router-dom";

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

  // 한 페이지 전(이전 페이지)로 이동하는 함수
  const handleGoBack = (replace = false) => {
    navigate(-1, { replace });
  };

  // 두 페이지 전으로 이동하는 함수
  const handleGoBackTwice = (replace = false) => {
    navigate(-2, { replace });
  };

  // 다음 화면으로 이동하는 함수 (인자로 받은 nextpath로 이동)
  const handleGoNext = (nextPath, replace = false) => {
    navigate(nextPath, {
      replace,
    });
  };

  // 다음 화면으로 이동하는 함수 (인자로 받은 nextpath로 이동, key-value 쌍으로 여러 state를 함께 전달)
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
    handleGoBack,
    handleGoBackTwice,
    handleGoNext,
    handleGoNextWithState,
  };
}
