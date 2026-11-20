import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { getRequestTargetsApi } from "@/features/request/api/getApi";
import { getRequestTargetsService } from "@/features/request/services/requestTargetService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

/**
 * 대상 후보 조회
 *  - 현재 경로에 따라 요청 작성은 { situationId }, 다시 부탁하기는 { situationId, requestId } 전송
 *  - 화면에 필요한 ID가 모두 준비되면 조회하며, 전송 값이 바뀌면 자동으로 다시 조회
 *  - 상황이 유효하지 않으면 전달받은 콜백으로 요청 작성 화면의 시트를 연다.
 */
export const useRequestTargetsQuery = (
  { situationId, requestId } = {},
  { onSituationInvalid, showToast } = {},
) => {
  // 해당 API를 어디서 호출했는지 구분 (다시 부탁하기 / 요청 작성 )
  const { pathname } = useLocation();
  const isRequest = Boolean(matchPath(REQUEST_ROUTES.request(":id"), pathname));
  const isAskAgain = Boolean(matchPath(REQUEST_ROUTES.askAgain(":id"), pathname));
  const params = { // 요청 작성은 situationId만, 다시 부탁하기는 situationId+requestId
    situationId,
    ...(isAskAgain && { requestId }),
  };

  // 에러 처리를 위한 함수 및 객체 선언
  const { handleGoBack, handleGoNext } = useRequestNav();
  const handledError = useRef(null);

  // API 호출
  const query = useQuery({
    // 요청 작성은 requestId에 undefined가 저장됨
    // (Axios가 URL의 쿼리 문자열을 만들 때 값이 undefined 또는 null인 항목은 생략하므로 API 호출 시 문제는 X)
    queryKey: REQUEST_QUERY_KEYS.targets(params.situationId, params.requestId),
    queryFn: () => getRequestTargetsApi(params),
    select: getRequestTargetsService,
    enabled: Boolean(
      (isRequest && situationId != null) ||
      (isAskAgain && situationId != null && requestId != null),
    ),
  });

  // React Query v5의 조회 에러는 effect에서 처리하고, 같은 실패의 중복 처리를 막는다.
  // - query.error -> 조회하다 생긴 에러
  // - query.isFetching -> 지금 조회 중인지
  // - query.errorUpdatedAt -> 에러가 발생한 시각
  // - handledError.current -> 마지막으로 처리한 에러를 적어둔 메모
  useEffect(() => {
    // 에러가 없으면 에러를 기록하지 않고 (null) 리턴
    if (!query.error) {
      handledError.current = null;
      return;
    }

    // 재조회 중에는 기존 에러로 화면을 이동하지 않는다.
    if (query.isFetching || !showToast) return;

    // 기록의 에러 발생 시각과 현재 에러 발생 시각이 같으면 이미 처리한 것 -> 리턴
    if (
      handledError.current?.error === query.error &&
      handledError.current?.updatedAt === query.errorUpdatedAt
    ) return;

    // 이번 실패를 처리했다고 메모하고, 에러 처리 함수를 실행
    handledError.current = { error: query.error, updatedAt: query.errorUpdatedAt };
    showToast(getErrorMessage(query.error));
    switch (getErrorCode(query.error)) {
      case REQUEST_ERROR_CODE.REQUEST_SITUATION_INVALID:
        onSituationInvalid?.(); // 인자로 받은 함수(상황 선택 시트 열기) 실행
        break;
      case REQUEST_ERROR_CODE.REQUEST_SITUATION_ENDED:
        handleGoNext(REQUEST_ROUTES.home, true);
        break;
      case COMMON_ERROR_CODE.FORBIDDEN:
        handleGoBack();
        break;
      case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
        handleGoBack();
        break;
    }
  }, [query.error, query.errorUpdatedAt, query.isFetching, onSituationInvalid, showToast, handleGoNext, handleGoBack]);

  return query;
};
