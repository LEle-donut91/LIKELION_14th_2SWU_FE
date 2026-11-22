import { create } from "zustand";
import { TOAST_DURATION } from "@/shared/constants/toastConstants";

/**
 * @typedef {Object} ToastMessage
 * @property {number} id 토스트 생성 순서에 따라 증가하는 고유 ID.
 * @property {string} message 화면에 표시할 안내 문구.
 */

/**
 * 페이지 사이에서 토스트 상태를 공유하는 Zustand 스토어.
 *
 * 페이지가 언마운트되어도 상태는 유지된다. persist를 사용하지 않으므로
 * 브라우저 새로고침 후에는 초기 상태로 돌아간다.
 * 타이머도 스토어에서 관리하여 Toast 마운트 여부와 관계없이 3초 후 만료된다.
 *
 * React에서 사용하는 예:
 *   const showToast = useToastStore((state) => state.showToast);
 *   showToast("저장했어요.");
 *
 * React 밖에서 사용하는 예:
 *   useToastStore.getState().showToast("저장했어요.");
 *
 * useToastStore(selector)의 selector는 필요한 상태나 함수를 골라 구독하는 함수다.
 * 아래 create 콜백의 set은 Zustand가 제공하는 상태 갱신 함수이며,
 * set((state) => ...)의 state는 갱신 시점의 최신 스토어 상태다.
 */
export const useToastStore = create((set, get) => {
  let timerId = null;

  return {
    /** @type {ToastMessage|null} 현재 토스트. null이면 표시할 메시지가 없다. */
    toast: null,

    // 다음 토스트에 부여할 ID. 닫을 때 초기화하지 않아 과거 ID의 재사용을 막는다.
    nextId: 1,

    /**
     * 새 토스트를 표시한다. 이미 표시 중이면 기존 메시지를 교체한다.
     * 같은 문구를 연속 전달해도 새 ID를 생성해 표시 타이머를 다시 시작한다.
     *
     * @param {string} message 화면에 표시할 안내 문구.
     * @returns {void}
     */
    showToast: (message) => {
      clearTimeout(timerId);
      const id = get().nextId;
      timerId = setTimeout(() => get().hideToast(id), TOAST_DURATION);
      set({ toast: { id, message }, nextId: id + 1 });
    },

    /**
     * 전달된 ID가 현재 토스트의 ID와 같을 때만 닫는다.
     * 이전 타이머가 새 토스트를 지우는 것을 막기 위해 ID를 반드시 전달한다.
     * ID가 다르거나 토스트가 없으면 기존 상태를 그대로 반환한다.
     * toast만 비우고 nextId는 유지한다.
     *
     * @param {number} id 닫으려는 토스트의 ID. 타이머를 만들 때의 ID를 전달한다.
     * @returns {void}
     */
    hideToast: (id) => {
      if (get().toast?.id !== id) return;
      clearTimeout(timerId);
      timerId = null;
      set({ toast: null });
    },
  };
});
