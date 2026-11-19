import { create } from "zustand";

/**
 * 요청 화면 사이에 전달하는 에러 처리 정보. 처리한 화면에서 setError(null)로 비운다.
 *
 * @typedef {Object} CreationError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.REQUEST} targetPage 요청 작성 화면에서 처리
 * @property {string} message 토스트 메시지
 * @property {"situation"|"user"|"start"|"end"|"dueDate"} [sheet] 다시 열 시트
 * @property {"location"|"content"} [field] 포커스할 입력 필드
 *
 * @typedef {Object} ReassignError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.ASK_AGAIN} targetPage 다시 부탁하기 화면에서 처리
 * @property {string} message 토스트 메시지
 * @property {string} requestId 에러가 발생한 요청 ID
 * @property {"user"|"dueDate"} [sheet] 다시 열 시트
 * @property {boolean} [refreshTargets] 대상 후보 재조회 여부
 *
 * @typedef {Object} RequestDetailError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.REQUEST_DETAIL} targetPage 요청 상세 화면에서 처리
 * @property {string} message 토스트 메시지
 * @property {string} requestId 에러가 발생한 요청 ID
 *
 * @typedef {Object} HomeError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.HOME} targetPage 홈 화면에서 처리
 * @property {string} message 토스트 메시지
 *
 * @typedef {Object} EditError
 * @property {typeof import("../constants/requestErrorConstants").REQUEST_ERROR_TARGET_PAGE.EDIT_FORM} targetPage 요청 수정 화면에서 처리
 * @property {string} requestId 에러가 발생한 요청 ID
 * @property {string} message 토스트 메시지
 * @property {"start"} sheet 다시 열 시작 시간 시트
 */
export const useRequestErrorStore = create((set) => ({
  error: /** @type {CreationError|ReassignError|RequestDetailError|HomeError|EditError|null} */ (null),
  /** @param {CreationError|ReassignError|RequestDetailError|HomeError|EditError|null} error */
  setError: (error) => set({ error }),
}));
