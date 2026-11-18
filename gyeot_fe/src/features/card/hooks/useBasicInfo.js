import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  deleteSafetyInfoApi,
  getSafetyInfoItemsApi,
  patchSafetyInfoApi,
  postSafetyInfoApi,
} from "@/features/card/api/safetyInfoApi";
import { getBasicInfoService } from "@/features/card/services/safetyInfoService";
import { CARD_QUERY_KEYS } from "@/features/card/constants/cardQueryKeys";
import {
  BASIC_INFO_ITEM_LIST,
  SAFETY_INFO_CATEGORY,
} from "@/features/card/constants/cardConstants";
import { SAFETY_INFO_MOCK_FAIL_QUERY_KEY } from "@/features/card/mocks/safetyInfoMockData";
import { INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

// 실패 시 '분류별 항목 조회'를 다시 불러올 에러 코드 (명세 '프론트 처리: 다시 불러옴')
const RELOAD_ERROR_CODE_LIST = [
  INFO_SHARE_ERROR_CODE.SAFETY_INFO_NOT_FOUND, // 수정·삭제: 이미 삭제된 항목
  INFO_SHARE_ERROR_CODE.SAFETY_INFO_ALREADY_EXISTS, // 작성: 다른 곳에서 이미 등록함
];

/**
 * [C-01] 기본 정보 조회 · 작성 · 수정 · 삭제 Hook
 * - 조회: 분류별 항목 조회(BASIC) → { birthDate, bloodType } (등록 전이면 null)
 * - 저장: 항목이 없으면 작성(POST), 있으면 수정(PATCH) / 값이 그대로면 요청 없이 완료 처리
 * - 성공: 서버 message 안내 + 안심카드 전체 key 무효화 (C-01 목록 + C-00 갱신일)
 *         다시 불러오기가 끝난 뒤 호출한 쪽의 onSuccess 실행 (편집 화면을 닫을 때 이전 값이 보이지 않도록)
 * - 실패: 에러 문구 안내, 404·409면 목록을 다시 불러옴 (이후 저장은 최신 데이터 기준으로 작성/수정 결정)
 * - 테스트: ?mockFail=true면 목업에서 작성 409 / 수정·삭제 404 응답 (USE_MOCK일 때만)
 *
 * @param {Function} onMessage 성공·실패 안내 문구를 전달받는 함수 (토스트)
 */
export const useBasicInfo = ({ onMessage } = {}) => {
  const queryClient = useQueryClient();

  // 테스트용 쿼리 (?mockFail=true) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const shouldMockFail = searchParams.get(SAFETY_INFO_MOCK_FAIL_QUERY_KEY) === "true";

  const {
    data: basicInfo,
    isPending,
    error,
  } = useQuery({
    queryKey: CARD_QUERY_KEYS.items(SAFETY_INFO_CATEGORY.BASIC),
    queryFn: () => getSafetyInfoItemsApi({ category: SAFETY_INFO_CATEGORY.BASIC }),
    select: getBasicInfoService,
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
   * @param {string} key      BASIC_INFO_KEY 값
   * @param {string} value    저장값 (생년월일 "YYYY-MM-DD", 혈액형 "A" / "B" / "O" / "AB")
   * @param {Object} callbacks mutate 옵션 (onSuccess, onSettled 등)
   */
  const saveBasicInfo = ({ key, value }, callbacks = {}) => {
    const item = basicInfo?.[key];

    // 값이 그대로면 요청하지 않고 완료 처리
    if (item && item.value === value) {
      callbacks.onSuccess?.();
      callbacks.onSettled?.();
      return;
    }

    if (item) {
      updateMutation.mutate(
        { informationId: item.informationId, title: null, informationValue: value, shouldMockFail },
        callbacks,
      );
      return;
    }

    const { informationType } = BASIC_INFO_ITEM_LIST.find((listItem) => listItem.key === key);
    createMutation.mutate(
      { informationType, title: null, informationValue: value, shouldMockFail },
      callbacks,
    );
  };

  /**
   * 항목 삭제
   * @param {string} key       BASIC_INFO_KEY 값
   * @param {Object} callbacks mutate 옵션 (onSuccess, onSettled 등)
   */
  const deleteBasicInfo = (key, callbacks = {}) => {
    const item = basicInfo?.[key];

    // 지울 항목이 없으면 요청하지 않고 완료 처리
    if (!item) {
      callbacks.onSuccess?.();
      callbacks.onSettled?.();
      return;
    }

    deleteMutation.mutate({ informationId: item.informationId, shouldMockFail }, callbacks);
  };

  return {
    basicInfo,
    isPending,
    error,
    isSaving,
    saveBasicInfo,
    deleteBasicInfo,
  };
};
