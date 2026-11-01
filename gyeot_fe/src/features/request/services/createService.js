import { CHECK_ITEM_ID } from "@/features/request/constants/requestConstants";

/**
 * =====================================================================
 * [H-03-02] 요청 작성
 * - post/get/patch/delete + 요청 내용 + Api
 * - 조회 후 데이터 가공
 * - 폼 제출 전 데이터 가공
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 데이터 조회 후 가공
export const getReqFormService = (raw) => {
  if (!raw) return { situation: [], user: [] };

  return {
    // 상황 목록 매핑
    situation:
      raw.situation?.map((item) => ({
        id: item.id,
        title: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        joinCount: Number(item.joinCount),
      })) || [],

    // 사용자 목록 매핑
    user:
      raw.user?.map((user) => ({
        id: user.id,
        userName: user.userName,
        isGuardian: user.isGuardian,
      })) || [],
  };
};

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 폼 제출 전 데이터 가공
export const postReqFormService = (raw) => ({
  situationId: raw.situationId,
  targetUserId: raw.userId,
  helpType: raw.helpType,
  startAt: raw.startDateTime,
  endAt: raw.endDateTime,
  location: raw.location,
  content: raw.content,
  responseDue: raw.dueDate,
});

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 폼 제출 후 데이터 가공
export const postReqFormIdService = (raw) => ({
  reqId: raw.requestId,
  msg: raw.message,
});

/**
 * =====================================================================
 * [H-03-02-01] 공개 정보 미리보기
 * - post/get/patch/delete + 요청 내용 + Api
 * - 조회 후 데이터 가공
 * - 폼 제출 전 데이터 가공
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-02-01] 공개 정보 미리보기 - 데이터 조회 후 가공
// 반환: { userName, userPart, dueDate, sections: { basicInfo: [...], healthInfo: [...], lifeInfo: [...], messageInfo: [...] } }
// 각 항목: { id, label, title, description, isDefault, isSensitive } (CheckOption / getSelectedTitles 에서 바로 사용)
// description 끝에는 갱신일(updatedAt)이 있을 때만 ", 갱신 9/20"을 붙임
export const getInfoPreviewService = (raw) => {
  if (!raw) {
    return {
      userName: "",
      userPart: "",
      dueDate: "",
      sections: {
        basicInfo: [],
        healthInfo: [],
        lifeInfo: [],
        messageInfo: [],
      },
    };
  }

  // 섹션별 항목 꺼내기
  const { birthDate, bloodType } = raw.basicInfo;
  const { disease, medicine, allergy, caution } = raw.healthInfo;
  const { address, entranceMethod, pet } = raw.lifeInfo;
  const { preference, document } = raw.messageInfo;

  return {
    userName: raw.userName,
    userPart: raw.userPart,
    dueDate: raw.dueDate,

    sections: {
      // 1. 기본 정보
      basicInfo: [
        {
          id: CHECK_ITEM_ID.BIRTH_DATE,
          label: "생년월일",
          title: "생년월일",
          description: `${birthDate.value} 출생${birthDate.updatedAt ? `, 갱신 ${birthDate.updatedAt}` : ""}`,
          isDefault: birthDate.isDefault,
          isSensitive: birthDate.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.BLOOD_TYPE,
          label: "혈액형",
          title: "혈액형",
          description: `${bloodType.value}${bloodType.updatedAt ? `, 갱신 ${bloodType.updatedAt}` : ""}`,
          isDefault: bloodType.isDefault,
          isSensitive: bloodType.isSensitive,
        },
      ],

      // 2. 건강 정보
      healthInfo: [
        {
          id: CHECK_ITEM_ID.DISEASE,
          label: "질환",
          title: disease.name,
          description: `${disease.diagnosedYear} 진단${disease.updatedAt ? `, 갱신 ${disease.updatedAt}` : ""}`,
          isDefault: disease.isDefault,
          isSensitive: disease.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.MEDICINE,
          label: "복용약",
          title: medicine.name,
          description: `${medicine.dosage}${medicine.updatedAt ? `, 갱신 ${medicine.updatedAt}` : ""}`,
          isDefault: medicine.isDefault,
          isSensitive: medicine.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.ALLERGY,
          label: "알러지",
          title: `${allergy.name} 알러지`,
          description: `${allergy.reaction}${allergy.updatedAt ? `, 갱신 ${allergy.updatedAt}` : ""}`,
          isDefault: allergy.isDefault,
          isSensitive: allergy.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.CAUTION,
          label: "주의사항",
          title: `${caution.name} 주의사항`,
          description: `${caution.instruction}${caution.updatedAt ? `, 갱신 ${caution.updatedAt}` : ""}`,
          isDefault: caution.isDefault,
          isSensitive: caution.isSensitive,
        },
      ],

      // 3. 생활 정보
      lifeInfo: [
        {
          id: CHECK_ITEM_ID.ADDRESS,
          label: "주소",
          title: "주소",
          description: `${address.value}${address.updatedAt ? `, 갱신 ${address.updatedAt}` : ""}`,
          isDefault: address.isDefault,
          isSensitive: address.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.ENTRANCE_METHOD,
          label: "출입 방법",
          title: "출입 방법",
          description: `${entranceMethod.value}${entranceMethod.updatedAt ? `, 갱신 ${entranceMethod.updatedAt}` : ""}`,
          isDefault: entranceMethod.isDefault,
          isSensitive: entranceMethod.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.PET,
          label: "반려동물 정보",
          title: `반려동물 (${pet.name})`,
          description: `${pet.care}${pet.updatedAt ? `, 갱신 ${pet.updatedAt}` : ""}`,
          isDefault: pet.isDefault,
          isSensitive: pet.isSensitive,
        },
      ],

      // 4. 미리 남기는 말
      messageInfo: [
        {
          id: CHECK_ITEM_ID.PREFERENCE,
          label: "선호",
          title: "선호",
          description: `${preference.value}${preference.updatedAt ? `, 갱신 ${preference.updatedAt}` : ""}`,
          isDefault: preference.isDefault,
          isSensitive: preference.isSensitive,
        },
        {
          id: CHECK_ITEM_ID.DOCUMENT,
          label: "문서",
          title: "문서",
          description: `${document.value}${document.updatedAt ? `, 갱신 ${document.updatedAt}` : ""}`,
          isDefault: document.isDefault,
          isSensitive: document.isSensitive,
        },
      ],
    },
  };
};

// TODO: API 연동 로직 수정 필요
// [H-03-02-01] 공개 정보 미리보기 - 제출 전 데이터 가공
// form: { basicInfo: [...ids], healthInfo: [...], lifeInfo: [...], messageInfo: [...] }
export const postInfoPreviewService = (tempId, form) => ({
  tempId,
  sharedInfo: {
    basicInfo: form.basicInfo,
    healthInfo: form.healthInfo,
    lifeInfo: form.lifeInfo,
    messageInfo: form.messageInfo,
  },
});
