import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { getRequestTargetsApi } from "@/features/request/api/getApi";
import { getRequestTargetsService } from "@/features/request/services/requestTargetService";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";
import { COMMON_ERROR_CODE, REQUEST_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { REQUEST_ERROR_TARGET_PAGE } from "@/features/request/constants/requestErrorConstants";
import { REQUEST_ROUTES } from "@/features/request/constants/routerConstants";
import { REQUEST_SHEET } from "@/features/request/constants/requestFormConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";
import { useRequestErrorStore } from "@/features/request/stores/useRequestErrorStore";
import { useRequestNav } from "@/features/request/hooks/useRequestNav";

const toNumberOrUndefined = (value) =>
  value == null ? undefined : Number(value);

/**
 * 대상 후보 조회
 *  - 요청 작성: { situationId } / 다시 부탁하기: { requestId }
 *  - 둘 중 하나라도 있어야 조회하며, 값이 바뀌면 queryKey가 달라져 자동으로 다시 조회
 *  - 현재 경로로 화면을 구분하고, 요청 작성 화면의 시트는 콜백으로 연다.
 */
export const useRequestTargetsQuery = (
  { situationId, requestId } = {},
  { onSituationInvalid } = {},
) => {
  const { pathname } = useLocation();
  const isInfoPreview = Boolean(matchPath(REQUEST_ROUTES.infoPreview(":id"), pathname));
  const isRequest = Boolean(matchPath(REQUEST_ROUTES.request(":id"), pathname));
  const { handleGoBack, handleGoNext } = useRequestNav();
  const setError = useRequestErrorStore((state) => state.setError);
  const handledError = useRef(null);
  const query = useQuery({
    queryKey: REQUEST_QUERY_KEYS.targets(situationId, requestId),
    queryFn: () =>
      getRequestTargetsApi({
        situationId: toNumberOrUndefined(situationId),
        requestId: toNumberOrUndefined(requestId),
      }),
    select: getRequestTargetsService,
    enabled: Boolean(situationId || requestId),
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
    if (query.isFetching) return;

    // 기록의 에러 발생 시각과 현재 에러 발생 시각이 같으면 이미 처리한 것 -> 리턴
    if (
      handledError.current?.error === query.error &&
      handledError.current?.updatedAt === query.errorUpdatedAt
    ) return;

    // 이번 실패를 처리했다고 메모하고, 에러 처리 함수를 실행
    handledError.current = { error: query.error, updatedAt: query.errorUpdatedAt };
    switch (getErrorCode(query.error)) {
      case REQUEST_ERROR_CODE.REQUEST_SITUATION_INVALID:
        if (isInfoPreview) { // 공개 정보 미리보기 화면인 경우
          setError({
            targetPage: requestId
              ? REQUEST_ERROR_TARGET_PAGE.ASK_AGAIN // 다시 부탁하기 화면에 에러 전달
              : REQUEST_ERROR_TARGET_PAGE.REQUEST, // 요청 작성 화면에 에러 전달
            requestId,
            message: getErrorMessage(query.error),
            ...(!requestId && { sheet: REQUEST_SHEET.SITUATION }), // 새 요청 작성 흐름인 경우 상황 선택 시트가 뜨도록
          });
          handleGoBack();
        } else if (isRequest) { // 요청 작성 화면인 경우
          onSituationInvalid?.(); // 인자로 받은 함수(상황 선택 시트 열기) 실행
        }
        break;
      case REQUEST_ERROR_CODE.REQUEST_SITUATION_ENDED:
        setError({
          targetPage: REQUEST_ERROR_TARGET_PAGE.HOME,
          message: getErrorMessage(query.error),
        });
        handleGoNext(REQUEST_ROUTES.home, true);
        break;
      case COMMON_ERROR_CODE.FORBIDDEN:
        handleGoBack();
        break;
      case REQUEST_ERROR_CODE.REQUEST_NOT_FOUND:
        handleGoBack();
        break;
    }
  }, [query.error, query.errorUpdatedAt, query.isFetching, isInfoPreview, isRequest, requestId, onSituationInvalid, setError, handleGoNext, handleGoBack]);

  return query;
};
