import { create } from "zustand";
import { INITIAL_FORM } from "@/features/request/constants/initialFormConstants";

export const useRequestFormStore = create((set) => ({
  // 상태 변수
  entryId: null, // 이 폼이 어떤 상황 ID(URL :id)로 열렸는지
  form: INITIAL_FORM, // 사용자 입력값과 공개할 항목 ID 목록
  informationSelectionKey: null, // 기본 공개 항목을 적용한 도움 종류 / 기존 요청 ID

  // 진입 시 초기화
  initForm: (entryId, initialValues = {}) =>
    set({
      entryId,
      form: { ...INITIAL_FORM, ...initialValues },
      informationSelectionKey: null,
    }),

  // 상황 변경 (URL :id 교체와 짝). 이전 요청 대상은 해제
  changeSituation: ({ id, startDate, endDate }) =>
    set((state) => ({
      entryId: id,
      informationSelectionKey: null,
      form: {
        ...state.form,
        situationId: id,
        situationStartDate: startDate,
        situationEndDate: endDate,
        userId: null,
        userName: null,
        isGuardian: null,
      },
    })),

  // 요청 대상 변경
  changeUser: ({ id, userName = null, isGuardian = null }) =>
    set((state) => ({
      form: {
        ...state.form,
        userId: id,
        userName,
        isGuardian,
      },
    })),

  // 같은 조회 조건에서는 재진입·재조회해도 사용자가 바꾼 선택(빈 배열 포함)을 유지
  initInformationSelection: ({ helpType, requestId, informationIds }) =>
    set((state) => {
      // 선택한 도움 종류와 요청 ID가 기준
      const key = JSON.stringify([helpType, requestId ?? null]);

      // 도움 종류 + 요청 ID가 같으면 저장된 값 활용
      if (state.informationSelectionKey === key) return state;

      // 처음 적용하거나 도움 종류 + 요청 ID가 달라지면,
      // 전달받은 서버 기본 선택 ID를 폼에 저장
      return {
        informationSelectionKey: key,
        form: { ...state.form, informationIds },
      };
    }),

  // useState의 setForm처럼 값 또는 updater 함수를 받음
  setForm: (updater) =>
    set((state) => ({
      form: typeof updater === "function" ? updater(state.form) : updater,
    })),

  // 요청 완료 / 작성 취소 시 비우기
  resetForm: () => set({
    entryId: null,
    form: INITIAL_FORM,
    informationSelectionKey: null,
  }),
}));
