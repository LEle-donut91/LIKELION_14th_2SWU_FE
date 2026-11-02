import { useState } from "react";

/**
 * =============================================================================================
 * [H-03-02-01] 공개 정보 미리보기
 * [H-03-01-02] 요청 수정 · 취소
 * - 사용자가 체크한 공개 정보(State)를 통합 관리
 * - "기본값 or 사용자의 수정안"을 초기값으로 설정
 * - 민감정보 포함 여부 반환
 * - 기본값(isDefault) 그대로인지 여부 반환 (기본값이 체크된 상태인지 vs 기본값이 체크되지 않은 상태인지)
 *
 * =============================================================================================
 */

/**
 * 공개 정보 체크 Form 전체 (각 값은 체크된 항목의 id 배열)
 * 예) { basicInfo: ["birthDate"], healthInfo: ["disease", "allergy"], lifeInfo: [], messageInfo: [] }
 * @typedef {Object} CheckForm
 * @property {string[]} basicInfo
 * @property {string[]} healthInfo
 * @property {string[]} lifeInfo
 * @property {string[]} messageInfo
 */

// sections({ basicInfo: [item...], ... })에서 isDefault가 true인 항목의 id만 모아 기본값 생성
const getDefaultForm = (sections) =>
  Object.fromEntries(
    Object.entries(sections).map(([key, items]) => [
      key,
      items.filter((item) => item.isDefault).map((item) => item.id),
    ]),
  );

/**
 * @param {Object} sections  getInfoPreviewService 가 반환한 sections
 * @param {Partial<CheckForm>} [initialValues]  초기값 오버라이드
 */
export function useCheckForm(sections = {}, initialValues = {}) {
  // TODO: API 연동 시 sections가 비동기로 들어온다면, 데이터 로딩 완료 후에 이 훅을 쓰는 컴포넌트를 렌더링하거나 key로 리마운트할 것 (초기값은 첫 렌더에만 계산됨)

  // 서버가 내려준 기본값 (비교 기준, 변하지 않음)
  const [defaultForm] = useState(() => getDefaultForm(sections));

  const [form, setForm] = useState(() => ({
    ...defaultForm,
    ...initialValues,
  }));

  // 개별 그룹의 체크 목록 업데이트
  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // 체크된 항목 중 서버가 민감정보(isSensitive)로 내려준 항목이 있는지 (모든 그룹 대상)
  const isSensitiveIncluded = Object.keys(sections).some((key) =>
    sections[key].some(
      (item) => item.isSensitive && form[key]?.includes(item.id),
    ),
  );

  // 모든 그룹이 기본값과 동일한지 (하나라도 다르면 false)
  const isDefaultChecked = Object.keys(defaultForm).every((key) => {
    const checked = form[key];
    const defaults = defaultForm[key];

    // 개수가 같고, 기본값의 모든 항목이 체크되어 있으면 동일 (순서는 무시)
    return (
      checked.length === defaults.length &&
      defaults.every((id) => checked.includes(id))
    );
  });

  return { form, setForm, setField, isSensitiveIncluded, isDefaultChecked };
}
