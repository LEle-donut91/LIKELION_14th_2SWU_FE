import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  getSharingsApi,
  postSharingReallowApi,
  postSharingRevokeApi,
} from "@/features/card/api/sharingApi";
import { getSharingsService } from "@/features/card/services/sharingService";
import { CARD_QUERY_KEYS } from "@/features/card/constants/cardQueryKeys";
import {
  SHARING_MOCK_FAIL_QUERY_KEY,
  SHARING_MOCK_QUERY_KEY,
} from "@/features/card/mocks/cardMockData";
import { INFO_SHARE_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

// 실패 시 '공유 중 목록 조회'를 다시 불러올 에러 코드 (명세 '프론트 처리: 다시 불러옴')
const RELOAD_ERROR_CODE_LIST = [
  INFO_SHARE_ERROR_CODE.SHARING_NOT_FOUND, // 철회·다시 허용: 없는 카드, 요청 종료 등
  INFO_SHARE_ERROR_CODE.SHARING_REALLOW_NOT_ALLOWED, // 다시 허용: 담당자 변경, 종료 시각 지남 등
  INFO_SHARE_ERROR_CODE.SHARING_NOTHING_TO_REALLOW, // 다시 허용: 철회한 항목이 모두 삭제됨
];

/**
 * [C-06] 공유 중 목록 조회 · 직접 철회 · 다시 허용 Hook
 * - 조회: 공유 중 목록 조회 → 카드 목록 (빈 배열이면 빈 상태 화면)
 * - 철회 / 다시 허용 성공: 서버 message 안내(onActionSuccess) + 공유 목록·C-00 메인 조회 무효화
 *   다시 불러오기가 끝날 때까지 처리 중 상태 유지 (바뀌기 전 카드가 잠깐 보이지 않도록)
 * - 철회 / 다시 허용 실패: 에러 문구 안내(onActionError), 404·409면 목록을 다시 불러옴
 *   (화면을 열어 둔 사이 요청이 끝나 서버에서 사라진 카드도 이때 정리됨)
 * - 처리 중(pendingId)에는 다른 카드의 버튼도 받지 않음
 * - 테스트: ?mock=empty·revokedOnly(시나리오), ?mockFail=true(철회 404 / 다시 허용 409) - USE_MOCK일 때만
 *
 * @param {number}   userId           받는 사람 ID (R-02-01처럼 한 사람 기준으로 볼 때만 전달)
 * @param {Function} onActionSuccess  성공 시 실행할 동작 (서버 message 전달, message가 없으면 호출하지 않음)
 * @param {Function} onActionError    실패 시 실행할 동작 (에러 문구 전달)
 */
export const useSharingList = ({ userId, onActionSuccess, onActionError } = {}) => {
  const queryClient = useQueryClient();

  // 테스트용 쿼리 (?mock=empty, ?mockFail=true) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(SHARING_MOCK_QUERY_KEY) ?? undefined;
  const shouldMockFail = searchParams.get(SHARING_MOCK_FAIL_QUERY_KEY) === "true";

  // 처리 중 여부 (상태 반영 전에 들어오는 연속 클릭까지 막기 위해 ref로도 관리)
  const pendingIdRef = useRef(null);

  const {
    data: items = [],
    isPending: isLoading,
    isError: hasError,
    error,
  } = useQuery({
    queryKey: CARD_QUERY_KEYS.sharings(userId ?? null),
    queryFn: () => getSharingsApi({ userId, mockScenario }),
    select: getSharingsService,
  });

  // 성공: 안내 후 다시 불러오기 (Promise를 반환해 다시 불러오기가 끝날 때까지 isPending 유지)
  // - 공유 중 건수가 바뀌므로 C-00 메인 조회도 함께 무효화
  // TODO: 홈(H-00) 연동 시 홈 조회 key(sharingCount)도 무효화
  const handleActionSuccess = (response) => {
    if (response?.message) onActionSuccess?.(response.message);
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.sharings() }),
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.summary() }),
    ]);
  };

  // 실패: 안내 + 명세상 다시 불러와야 하는 코드면 목록 무효화
  const handleActionError = (actionError) => {
    onActionError?.(getErrorMessage(actionError));
    if (RELOAD_ERROR_CODE_LIST.includes(getErrorCode(actionError))) {
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.sharings() });
    }
  };

  const mutationOptions = {
    onSuccess: handleActionSuccess,
    onError: handleActionError,
    onSettled: () => {
      pendingIdRef.current = null;
    },
  };

  const revokeMutation = useMutation({ mutationFn: postSharingRevokeApi, ...mutationOptions });
  const reallowMutation = useMutation({ mutationFn: postSharingReallowApi, ...mutationOptions });

  // 처리 중인 카드 ID (없으면 null)
  const pendingMutation = [revokeMutation, reallowMutation].find((mutation) => mutation.isPending);
  const pendingId = pendingMutation?.variables?.assignmentId ?? null;

  // 철회 / 다시 허용 공통 처리 (처리 중이면 무시)
  const runAction = (mutation, assignmentId) => {
    if (pendingIdRef.current !== null) return;
    pendingIdRef.current = assignmentId;
    mutation.mutate({ assignmentId, mockScenario, shouldMockFail });
  };

  // [직접 철회] → 다시 불러온 목록에서 철회됨 카드로 표시, canReallow에 따라 [다시 허용] 표시
  const handleRevoke = (assignmentId) => runAction(revokeMutation, assignmentId);

  // [다시 허용] → 다시 불러온 목록에서 공유 중 카드로 표시
  const handleReallow = (assignmentId) => runAction(reallowMutation, assignmentId);

  return {
    items,
    isLoading,
    hasError,
    error,
    pendingId,
    handleRevoke,
    handleReallow,
  };
};
