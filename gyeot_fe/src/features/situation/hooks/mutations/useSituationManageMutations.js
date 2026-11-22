import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addSituationParticipantApi,
  endSituationApi,
  leaveSituationApi,
  removeSituationParticipantApi,
} from "@/features/situation/api/situationApi";
import { SITUATION_QUERY_KEYS } from "@/features/situation/constants/situationQueryKeys";
import { getErrorCode, getErrorMessage } from "@/shared/utils/apiError";

// H-03-05 상황 관리 변경 요청 (참여자 추가 · 제외, 상황 종료 · 나가기)
// - 성공하면 상황 관련 조회를 다시 불러옴
// - 실패하면 서버 안내 문구로 토스트

// 이미 참여 중인 사람을 추가한 경우: 결과적으로 참여 중이므로 실패로 보지 않음
const PARTICIPANT_ALREADY_EXISTS_CODE = "SITUATION_PARTICIPANT_ALREADY_EXISTS";

export function useSituationManageMutations({ situationId, showToast }) {
  const queryClient = useQueryClient();

  const refreshSituation = () =>
    queryClient.invalidateQueries({ queryKey: SITUATION_QUERY_KEYS.all() });

  // 1. 참여자 추가: 체크한 사람 수만큼 한 명씩 추가 (API가 한 명씩 받음)
  const addMutation = useMutation({
    mutationFn: async (userIdList) => {
      const results = await Promise.allSettled(
        userIdList.map((userId) =>
          addSituationParticipantApi(situationId, { userId }),
        ),
      );
      return results
        .filter(({ status }) => status === "rejected")
        .map(({ reason }) => reason)
        .filter((error) => getErrorCode(error) !== PARTICIPANT_ALREADY_EXISTS_CODE);
    },
    onSuccess: (failedErrors) => {
      if (failedErrors.length > 0) showToast(getErrorMessage(failedErrors[0]));
    },
    onError: (error) => showToast(getErrorMessage(error)),
    onSettled: refreshSituation,
  });

  // 2. 참여자 제외
  const removeMutation = useMutation({
    mutationFn: (participantId) =>
      removeSituationParticipantApi(situationId, participantId),
    onError: (error) => showToast(getErrorMessage(error)),
    onSettled: refreshSituation,
  });

  // 3. 상황 종료 · 4. 상황 나가기: 성공 시 onSuccess(목록 이동 등)
  const endMutation = useMutation({
    mutationFn: () => endSituationApi(situationId),
    onSuccess: refreshSituation,
    onError: (error) => showToast(getErrorMessage(error)),
  });
  const leaveMutation = useMutation({
    mutationFn: () => leaveSituationApi(situationId),
    onSuccess: refreshSituation,
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const isPending =
    addMutation.isPending ||
    removeMutation.isPending ||
    endMutation.isPending ||
    leaveMutation.isPending;

  // 처리 중에는 다른 요청을 막아 중복 클릭 방지
  const runIfIdle = (mutation, variables, options) => {
    if (isPending) return;
    mutation.mutate(variables, options);
  };

  return {
    addParticipants: (userIdList) => runIfIdle(addMutation, userIdList),
    removeParticipant: (participantId) => runIfIdle(removeMutation, participantId),
    endSituation: (options) => runIfIdle(endMutation, undefined, options),
    leaveSituation: (options) => runIfIdle(leaveMutation, undefined, options),
    isPending,
  };
}
