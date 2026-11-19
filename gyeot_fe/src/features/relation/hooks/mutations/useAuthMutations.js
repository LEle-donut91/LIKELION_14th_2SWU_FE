import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLoginApi, postLogoutApi, postSignupApi } from "@/features/relation/api/authApi";
import { clearAccessToken, setAccessToken } from "@/shared/api/accessToken";
import { getErrorMessage } from "@/shared/utils/apiError";

// 회원가입 (A-01)
// - 실패 시 서버 안내 문구를 토스트로 표시 (예: 이미 가입된 이메일입니다.)
export function useSignupMutation({ showToast, onSuccess }) {
  const { mutate, isPending } = useMutation({
    mutationFn: postSignupApi,
    onSuccess,
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const signup = (form) => {
    if (isPending) return; // 중복 클릭 방지
    mutate(form);
  };

  return { signup, isSigningUp: isPending };
}

// 로그인 (A-01)
// - 성공하면 받은 Access Token을 메모리에 저장
export function useLoginMutation({ showToast, onSuccess }) {
  const { mutate, isPending } = useMutation({
    mutationFn: postLoginApi,
    onSuccess: (response) => {
      setAccessToken(response.data.accessToken);
      onSuccess?.(response);
    },
    onError: (error) => showToast(getErrorMessage(error)),
  });

  const login = (form) => {
    if (isPending) return; // 중복 클릭 방지
    mutate(form);
  };

  return { login, isLoggingIn: isPending };
}

// 로그아웃
// - 성공·실패와 상관없이 프론트의 Access Token과 저장된 조회 결과를 지움 (명세: 프론트에서도 삭제해야 함)
export function useLogoutMutation({ onSettled } = {}) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: postLogoutApi,
    onSettled: () => {
      clearAccessToken();
      queryClient.clear(); // 이전 사용자 데이터가 화면에 남지 않도록
      onSettled?.();
    },
  });

  const logout = () => {
    if (isPending) return;
    mutate();
  };

  return { logout, isLoggingOut: isPending };
}