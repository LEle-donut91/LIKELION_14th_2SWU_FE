import { create } from "zustand";
import { INITIAL_FORM } from "@/features/request/constants/requestConstants";

export const useRequestCreateStore = create((set) => ({
// 상태 변수
  entryId: null, // 이 폼이 어떤 상황 ID(URL :id)로 열렸는지
  form: INITIAL_FORM,

  // 진입 시 초기화
  initForm: (entryId, initialValues = {}) =>
    set({ entryId, form: { ...INITIAL_FORM, ...initialValues } }),

  // 상황 변경 (URL :id 교체와 짝). 이전 요청 대상은 해제
  changeSituation: (situationId) =>
    set((state) => ({
      entryId: situationId,
      form: { ...state.form, situationId, userId: null },
    })),

  // useState의 setForm처럼 값 또는 updater 함수를 받음
  setForm: (updater) =>
    set((state) => ({
      form: typeof updater === "function" ? updater(state.form) : updater,
    })),

  // 요청 완료 / 작성 취소 시 비우기
  resetForm: () => set({ entryId: null, form: INITIAL_FORM }),
}));
