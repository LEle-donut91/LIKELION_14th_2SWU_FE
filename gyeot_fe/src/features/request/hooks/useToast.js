import { useCallback, useState } from "react";

/**
 * =====================================================================
 * [request/ 공통] 토스트 상태 관리 커스텀 훅
 *  - showToast(message): 토스트 노출 (이미 떠 있으면 새 메시지로 교체 + 타이머 재시작)
 *  - hideToast(): 토스트 숨김 (DefaultToast 의 onHide 에 전달)
 *
 * 사용 예:
 *   const { toast, showToast, hideToast } = useToast();
 *   {toast && <DefaultToast key={toast.id} message={toast.message} onHide={hideToast} />}
 * =====================================================================
 */
export function useToast() {
  // { id, message } | null  (id 는 key 용도: 연속 호출 시 DefaultToast 를 새로 마운트해 타이머 리셋)
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast((prev) => ({ id: (prev?.id ?? 0) + 1, message }));
  }, []);

  // DefaultToast 의 useEffect 의존성에 들어가므로 참조가 유지되어야 함
  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}
