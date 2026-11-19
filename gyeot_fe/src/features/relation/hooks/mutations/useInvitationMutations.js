import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteInvitationApi,
  postAcceptInvitationApi,
  postInvitationApi,
  postReciprocalApi,
  postRejectInvitationApi,
} from "@/features/relation/api/invitationApi";
import { RELATION_QUERY_KEYS } from "@/features/relation/constants/relationQueryKeys";
import { getErrorMessage } from "@/shared/utils/apiError";

// 초대 링크 생성 (R-01 나의 사람 초대, N-02 보호자 요청)
// - onSuccess로 응답 data({ invitationId, invitationUrl, expiresAt })를 넘겨줌
export function useCreateInvitationMutation({ showToast, onSuccess }) {
  const { mutate, isPending } = useMutation({
    mutationFn: postInvitationApi,
    onSuccess: (response) => onSuccess?.(response.data),
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const createInvitation = (params) => {
    if (isPending) return; // 중복 클릭 방지
    mutate(params);
  };

  return { createInvitation, isCreating: isPending };
}

// 발신 초대 취소 (R-01)
export function useCancelInvitationMutation({ showToast, onSuccess }) {
  const { mutate, isPending } = useMutation({
    mutationFn: deleteInvitationApi,
    onSuccess,
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const cancelInvitation = (invitationId) => {
    if (isPending) return;
    mutate(invitationId);
  };

  return { cancelInvitation, isCanceling: isPending };
}

// 초대 수락·거절 공통 (R-03, N-03)
// - 성공·실패 모두 초대 상태를 다시 조회 (이미 응답했거나 만료된 경우 결과 화면으로 바뀌도록)
// - 수락하면 관계가 생기므로 관계 목록도 다시 조회
function useRespondInvitationMutation(token, mutationFn, { showToast, onSuccess }) {
  const queryClient = useQueryClient();

  const refetchInvitation = () =>
    queryClient.invalidateQueries({ queryKey: RELATION_QUERY_KEYS.invitation(token) });

  const { mutate, isPending } = useMutation({
    mutationFn,
    onSuccess: () => {
      refetchInvitation();
      queryClient.invalidateQueries({ queryKey: RELATION_QUERY_KEYS.relationships() });
      onSuccess?.();
    },
    onError: (error) => {
      showToast(getErrorMessage(error));
      refetchInvitation();
    },
  });

  const respond = () => {
    if (isPending || !token) return;
    mutate(token);
  };

  return { respond, isResponding: isPending };
}

// 초대 수락 (POST /api/invitations/{token}/accept)
export function useAcceptInvitationMutation(token, options) {
  const { respond, isResponding } = useRespondInvitationMutation(token, postAcceptInvitationApi, options);
  return { acceptInvitation: respond, isAccepting: isResponding };
}

// 초대 거절 (POST /api/invitations/{token}/reject)
export function useRejectInvitationMutation(token, options) {
  const { respond, isResponding } = useRespondInvitationMutation(token, postRejectInvitationApi, options);
  return { rejectInvitation: respond, isRejecting: isResponding };
}

// 반대 방향 나의 사람 추가 (N-01)
// - 성공하면 관계 목록 다시 조회
export function useReciprocalMutation(token, { showToast, onSuccess }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postReciprocalApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RELATION_QUERY_KEYS.relationships() });
      onSuccess?.();
    },
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const addReciprocal = () => {
    if (isPending || !token) return;
    mutate(token);
  };

  return { addReciprocal, isAdding: isPending };
}
