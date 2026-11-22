import { useEffect } from "react";
import styles from "@/shared/components/Toast/Toast.module.css";
import { TOAST_DURATION } from "@/shared/constants/toastConstants";
import { useToastStore } from "@/shared/stores/useToastStore";

/**
 * Zustand에 저장된 토스트를 페이지 안에서 표시하는 공통 컴포넌트.
 *
 * props(파라미터)는 받지 않는다. 메시지와 닫기 함수는 useToastStore에서 가져온다.
 * 메시지를 띄울 때는 페이지나 훅에서 showToast("안내 문구")를 호출한다.
 *
 * 사용 예:
 *   const showToast = useToastStore((state) => state.showToast);
 *   showToast("요청을 보냈어요.");
 *   // 페이지 JSX에 <Toast />를 한 번 배치한다.
 *
 * 라우터 밖이 아니라 각 페이지에서 렌더링하므로 이동할 도착 페이지에도
 * <Toast />가 있어야 한다. 표시 위치는 연결된 CSS와 부모 레이아웃에 따라 결정된다.
 * 상태는 페이지 이동 후에도 유지되며, 새 페이지에서 마운트되면 다시 3초간 표시한다.
 * 같은 화면에는 하나만 배치해 메시지와 타이머가 중복되지 않도록 한다.
 *
 * @returns {import("react").ReactElement|null} 토스트 요소. 메시지가 없으면 null.
 */
function Toast() {
  // selector로 필요한 상태만 구독한다. 메시지가 교체되거나 닫히면 다시 렌더링된다.
  const toast = useToastStore((state) => state.toast);
  const hideToast = useToastStore((state) => state.hideToast);
  // 메시지 내용이 같아도 새 showToast 호출은 다른 ID를 받아 타이머를 재시작한다.
  const toastId = toast?.id;
  useEffect(() => {
    // 아직 토스트가 없거나 이미 닫힌 경우에는 타이머를 만들지 않는다.
    if (toastId == null) return;

    // 이 effect가 시작될 때의 ID를 전달한다. 스토어에서도 ID를 비교하므로
    // 이전 토스트의 콜백이 뒤늦게 실행되어도 새 메시지를 지우지 않는다.
    const timerId = setTimeout(() => hideToast(toastId), TOAST_DURATION);

    // 메시지 교체 또는 페이지 이동으로 언마운트되면 이전 타이머를 해제한다.
    // 전역 토스트 상태는 지우지 않으므로 도착 페이지에서 이어서 표시할 수 있다.
    return () => clearTimeout(timerId);
  }, [hideToast, toastId]);

  // role="status"로 안내 메시지임을 보조 기술에 알린다.
  return toast ? (
    <div className={`${styles.requestToast} typoBodyMedium`} role="status">
      {toast.message}
    </div>
  ) : null;
}

export default Toast;
