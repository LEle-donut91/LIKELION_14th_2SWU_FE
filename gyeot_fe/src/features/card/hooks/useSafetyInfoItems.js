import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  deleteSafetyInfoApi,
  getSafetyInfoItemsApi,
  patchSafetyInfoApi,
  postSafetyInfoApi,
} from "@/features/card/api/safetyInfoApi";
import {
  getSafetyInfoItemsByKeyService,
  toSafetyInfoRequest,
} from "@/features/card/services/safetyInfoService";
import { CARD_QUERY_KEYS } from "@/features/card/constants/cardQueryKeys";
import { SAFETY_INFO_MOCK_FAIL_QUERY_KEY } from "@/features/card/mocks/safetyInfoMockData";
import { INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

// 실패 시 '분류별 항목 조회'를 다시 불러올 에러 코드 (명세 '프론트 처리: 다시 불러옴')
const RELOAD_ERROR_CODE_LIST = [
  INFO_SHARE_ERROR_CODE.SAFETY_INFO_NOT_FOUND, // 수정·삭제: 이미 삭제된 항목
  INFO_SHARE_ERROR_CODE.SAFETY_INFO_ALREADY_EXISTS, // 작성: 다른 곳에서 이미 등록함
];

/**
 * [C-02 · C-04 · C-05] 안심카드 분류별 항목 조회 · 작성 · 수정 · 삭제 Hook
 * - 조회: 분류별 항목 조회 → 페이지 설정 key별 항목 목록 (기존 화면 mock과 같은 형태)
 *   예: { disease: [{ id, name, diagnosedYear, updatedAt }], medicine: [...] }
 * - 저장: 항목이 없으면 작성(POST), 있으면 수정(PATCH) / 값이 그대로면 요청 없이 완료 처리
 * - 성공: 서버 message 안내 + 안심카드 전체 key 무효화 (목록 + C-00 갱신일)
 *         다시 불러오기가 끝난 뒤 호출한 쪽의 onSuccess 실행 (편집 화면을 닫을 때 이전 값이 보이지 않도록)
 * - 실패: 에러 문구 안내, 404·409면 목록을 다시 불러옴
 * - 테스트: ?mockFail=true면 목업에서 작성 409 / 수정·삭제 404 응답 (USE_MOCK일 때만)
 * - C-01(useBasicInfo)과 같은 규칙. C-01은 화면 구성(생년월일·혈액형 전용 입력)이 달라 별도 Hook 사용
 *
 * @param {string}   category        분류 (SAFETY_INFO_CATEGORY 값)
 * @param {Array}    typeConfigList  페이지 설정 목록 (informationType, titleKey, descriptionKey, descriptionSuffix 포함)
 *                                   모듈 상수를 넘겨야 함 (매번 새 배열이면 가공을 매번 다시 함)
 * @param {Function} onMessage       성공·실패 안내 문구를 전달받는 함수 (토스트)
 */
export const useSafetyInfoItems = ({ category, typeConfigList, onMessage }) => {
  const queryClient = useQueryClient();

  // 테스트용 쿼리 (?mockFail=true) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const shouldMockFail = searchParams.get(SAFETY_INFO_MOCK_FAIL_QUERY_KEY) === "true";

  // 응답 → 페이지 설정 key별 목록 (설정 목록이 같으면 같은 함수 유지)
  const selectInfoByKey = useCallback(
    (raw) => getSafetyInfoItemsByKeyService(raw, typeConfigList),
    [typeConfigList],
  );

  const {
    data: infoByKey,
    isPending,
    error,
  } = useQuery({
    queryKey: CARD_QUERY_KEYS.items(category),
    queryFn: () => getSafetyInfoItemsApi({ category }),
    select: selectInfoByKey,
  });

  // 성공: 안내 후 다시 불러오기 (Promise를 반환해 다시 불러오기가 끝날 때까지 isPending 유지)
  const handleMutationSuccess = (response) => {
    if (response?.message) onMessage?.(response.message);
    return queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.safetyInfo });
  };

  // 실패: 안내 + 명세상 다시 불러와야 하는 코드면 무효화
  const handleMutationError = (mutationError) => {
    onMessage?.(getErrorMessage(mutationError));
    if (RELOAD_ERROR_CODE_LIST.includes(getErrorCode(mutationError))) {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.safetyInfo });
    }
  };

  const mutationOptions = {
    onSuccess: handleMutationSuccess,
    onError: handleMutationError,
  };

  const createMutation = useMutation({ mutationFn: postSafetyInfoApi, ...mutationOptions });
  const updateMutation = useMutation({ mutationFn: patchSafetyInfoApi, ...mutationOptions });
  const deleteMutation = useMutation({ mutationFn: deleteSafetyInfoApi, ...mutationOptions });

  // 저장·삭제 처리 중 (버튼 중복 클릭 방지용)
  const isSaving =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  /**
   * 항목 저장 (작성 또는 수정)
   * @param {Object} config    편집 중인 페이지 설정 (카테고리 / 유형)
   * @param {Object} item      수정할 항목 (infoByKey의 항목) / 없으면 작성
   * @param {Object} draft     필드 키별 입력값 (앞뒤 공백 제거 후)
   * @param {Object} callbacks mutate 옵션 (onSuccess, onSettled 등)
   */
  const saveItem = ({ config, item, draft }, callbacks = {}) => {
    // 값이 그대로면 요청하지 않고 완료 처리
    const isUnchanged =
      item && config.fields.every((field) => item[field.key] === draft[field.key]);
    if (isUnchanged) {
      callbacks.onSuccess?.();
      callbacks.onSettled?.();
      return;
    }

    const request = toSafetyInfoRequest(config, draft);

    if (item) {
      updateMutation.mutate({ informationId: item.id, ...request, shouldMockFail }, callbacks);
      return;
    }

    createMutation.mutate(
      { informationType: config.informationType, ...request, shouldMockFail },
      callbacks,
    );
  };

  /**
   * 항목 삭제
   * @param {Object} item      삭제할 항목 (infoByKey의 항목) / 없으면 요청 없이 완료 처리
   * @param {Object} callbacks mutate 옵션 (onSuccess, onSettled 등)
   */
  const deleteItem = (item, callbacks = {}) => {
    if (!item) {
      callbacks.onSuccess?.();
      callbacks.onSettled?.();
      return;
    }

    deleteMutation.mutate({ informationId: item.id, shouldMockFail }, callbacks);
  };

  return {
    infoByKey,
    isPending,
    error,
    isSaving,
    saveItem,
    deleteItem,
  };
};
