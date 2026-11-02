import { getInfoPreviewService } from "@/features/request/services/createService";
import { toDate } from "@/features/request/hooks/useRequestForm";
import {
  MS_PER_MINUTE,
  START_MIN_LEAD_MINUTES,
} from "@/features/request/constants/requestConstants";
import iconDate from "@/shared/assets/icons/iconDate.svg";
import iconLocation from "@/shared/assets/icons/iconLocation.svg";
import iconHealthy from "@/shared/assets/icons/iconHealthy.svg";

/**
 * =====================================================================
 * [H-03-01-02] 요청 수정 · 취소
 * - 조회 후 데이터 가공
 * - 제출 전 데이터 가공
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 - 폼 데이터 조회 후 가공
// - sections: draft.sharedInfo로 구성 (공개 정보 미리보기와 응답 구조가 같으므로 getInfoPreviewService 재사용)
//             각 항목의 isDefault가 useCheckForm의 초기 체크 상태가 됨 (isEditing과 관계없이 동일)
// - initialRequestForm: isEditing이 true일 때만 기존 수정안(시작/종료/장소)을 useRequestForm의 initialValues로 전달
//                       false면 draft에는 sharedInfo만 있으므로 빈 객체 → 훅 기본값(null)
// 반환: { situationId, requestId, isEditing, userName, dueDate, sections, initialRequestForm }
export const getEditFormService = (raw) => {
  const isEditing = raw?.isEditing ?? false;
  const draft = raw?.draft;

  return {
    situationId: raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    isEditing,
    userName: raw?.userName ?? "",
    dueDate: raw?.dueDate ?? "",
    sections: getInfoPreviewService(draft?.sharedInfo).sections,
    initialRequestForm:
      isEditing && draft
        ? {
            startDateTime: draft.startAt,
            endDateTime: draft.endAt,
            location: draft.location,
          }
        : {},
  };
};

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 - 수정안 저장 전 데이터 가공
// requestForm: useRequestForm의 form / checkForm: useCheckForm의 form
export const postEditFormService = (requestId, requestForm, checkForm) => ({
  requestId,
  startAt: requestForm.startDateTime,
  endAt: requestForm.endDateTime,
  location: requestForm.location,
  sharedInfo: {
    basicInfo: checkForm.basicInfo,
    healthInfo: checkForm.healthInfo,
    lifeInfo: checkForm.lifeInfo,
    messageInfo: checkForm.messageInfo,
  },
});

// TODO: API 연동 로직 수정 필요
// [H-03-01-02] 요청 수정 내용 확인 - 데이터 조회 후 가공
// 반환: { situationId, requestId, isConfirmRequired, userName, userPart, beforeInfoList, afterInfoList }
export const getEditCheckService = (raw) => ({
  situationId: raw?.situationId ?? "",
  requestId: raw?.requestId ?? "",
  isConfirmRequired: raw?.isAccepted ?? false,
  userName: raw?.userName ?? "",
  userPart: raw?.userPart ?? "",
  beforeInfoList: [
    { icon: iconDate, label: "일정", value: raw?.beforeInfo?.time ?? "" },
    {
      icon: iconLocation,
      label: "장소",
      value: raw?.beforeInfo?.location ?? "",
    },
    { icon: iconHealthy, label: "정보", value: raw?.beforeInfo?.message ?? "" },
  ],
  afterInfoList: [
    { icon: iconDate, label: "일정", value: raw?.afterInfo?.time ?? "" },
    {
      icon: iconLocation,
      label: "장소",
      value: raw?.afterInfo?.location ?? "",
    },
    { icon: iconHealthy, label: "정보", value: raw?.afterInfo?.message ?? "" },
  ],
});

/**
 * =====================================================================
 * [N-06] 다시 부탁하기
 * - 데이터 조회 후 가공
 *
 * =====================================================================
 */

// [N-06] 다시 부탁하기 - 데이터 조회 후 가공
export const getAskAgainService = (raw, now = new Date()) => {
  const summary = raw?.lastReqSummary;
  const startAt = summary?.startAt ?? null;

  // 시작까지 1시간 미만이면 응답 기한 고정 (startAt이 불완전하면 toDate가 null → false)
  const start = toDate(startAt);
  const isDueDateFixed =
    !!start && (start - now) / MS_PER_MINUTE < START_MIN_LEAD_MINUTES;

  return {
    situationId: raw?.situationId ?? "",
    requestId: raw?.requestId ?? "",
    reqType: summary?.type ?? "",
    reqMsg: summary?.message ?? "",

    // [이전 요청 내용]의 시간/장소/정보
    infoList: [
      { icon: iconDate, label: "일정", value: summary?.time ?? "" },
      { icon: iconLocation, label: "장소", value: summary?.location ?? "" },
      { icon: iconHealthy, label: "정보", value: summary?.info ?? "" },
    ],

    // [대상 이력] 목록 매핑
    userRecord:
      raw?.userRecord?.map((user) => ({
        name: user.name,
        part: user.part,
        state: user.state,
      })) || [],

    // [새 요청 대상] 목록 매핑
    userLst:
      raw?.userLst?.map((user) => ({
        id: user.id,
        userName: user.userName,
        isGuardian: user.isGuardian,
      })) || [],

    isDueDateFixed,
    initialRequestForm: {
      startDateTime: startAt,
      ...(isDueDateFixed && { dueDate: null }),
    },
  };
};

// [N-06] 다시 부탁하기 - 폼 제출 전 데이터 가공
// form: useRequestForm의 form / 응답 기한 고정 시 dueDate가 null → responseDue: null (서버에서 처리)
export const postAskAgainService = (requestId, form) => ({
  requestId,
  targetUserId: form.userId,
  responseDue: form.dueDate ?? null,
});

// TODO: API 연동 로직 수정 필요
// [N-06] 다시 부탁하기 - 폼 제출 후 데이터 가공
export const postAskAgainIdService = (raw) => ({
  tempId: raw.tempId,
  msg: raw.message,
});
