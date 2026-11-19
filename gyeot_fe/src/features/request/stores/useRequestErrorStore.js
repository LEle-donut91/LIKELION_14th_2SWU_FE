import { create } from "zustand";

/**
 * 요청 화면 사이에 전달하는 에러 처리 정보. 처리한 화면에서 setError(null)로 비운다.
 *
 * @typedef {Object} CreationError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.REQUEST} targetPage 요청 작성 화면에서 처리
 * @property {"situation"|"user"|"start"|"end"|"dueDate"} [sheet] 다시 열 시트
 * @property {"location"|"content"} [field] 포커스할 입력 필드
 *
 * @typedef {Object} ReassignError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.ASK_AGAIN | typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.REQUEST_DETAIL} targetPage 다시 부탁하기 화면에서 처리
 * @property {string} requestId 에러가 발생한 요청 ID
 * @property {"user"|"dueDate"} [sheet] 다시 열 시트
 * @property {boolean} [clearSelectedUser] 기존 요청 대상 선택 해제 여부
 *
 * @typedef {Object} EditError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.EDIT_FORM} targetPage 요청 수정 화면에서 처리
 * @property {string} requestId 에러가 발생한 요청 ID
 * @property {"start"} sheet 다시 열 시작 시간 시트
 */
export const useRequestErrorStore = create((set) => ({
  error: /** @type {CreationError|ReassignError|EditError|null} */ (null),
  /** @param {CreationError|ReassignError|EditError|null} error */
  setError: (error) => set({ error }),
}));
