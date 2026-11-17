import { axiosInstance } from "@/shared/api/axiosInstance";
import { INFO_SHARE_API_URLS } from "@/shared/constants/apiUrlConstants";
import {
  SAFETY_INFO_CATEGORY_MOCK,
  SAFETY_INFO_TYPE_MOCK,
  SAFETY_INFO_ITEM_MOCK,
  SAFETY_INFO_SHARING_COUNT_MOCK,
  SAFETY_INFO_MOCK_MESSAGE,
  SAFETY_INFO_MOCK_ERROR,
} from "@/features/card/mocks/safetyInfoMockData";

// 안심카드 항목 API (API 명세서 F-02: 메인 조회, 분류별 항목 조회, 항목 작성, 항목 수정, 항목 삭제)
// - 모든 함수는 공통 응답 전체 { status, code, message, data }를 반환
// - 에러는 잡지 않고 그대로 던짐 (처리는 useQuery / useMutation 쪽에서)

// 서버 연결·인증 처리 전까지 명세 응답 형태의 테스트 데이터를 사용한다.
// TODO: 서버에 API가 올라간 것을 확인한 뒤 USE_MOCK을 false로 변경
const USE_MOCK = true;

/**
 * =====================================================================
 * 목업 (USE_MOCK일 때만 사용)
 * - 작성·수정·삭제 결과를 아래 저장소에 반영해, 다시 조회하면 바뀐 목록과 lastUpdatedAt이 보이도록 함
 * - 새로고침하면 처음 데이터로 돌아감
 * =====================================================================
 */

// 목업 응답 지연 시간(ms): 로딩·저장 중 버튼 잠금을 확인할 수 있도록 약간 늦게 응답
const MOCK_DELAY = 500;

// 항목 이름 / 내용 최대 글자 수 (명세 기준)
const MOCK_TITLE_MAX_LENGTH = 150;
const MOCK_VALUE_MAX_LENGTH = 1000;

// 혈액형 허용 값 (명세 기준)
const MOCK_BLOOD_TYPE_LIST = ["A", "B", "O", "AB"];

let mockItems = structuredClone(SAFETY_INFO_ITEM_MOCK);
let mockNextInformationId =
  Math.max(...SAFETY_INFO_ITEM_MOCK.map((item) => item.informationId)) + 1;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const padTwo = (number) => String(number).padStart(2, "0");

// 로컬(KST) 날짜 "YYYY-MM-DD" (toISOString은 UTC로 바뀌므로 사용하지 않음)
const toMockDate = (date) =>
  `${date.getFullYear()}-${padTwo(date.getMonth() + 1)}-${padTwo(date.getDate())}`;

// 로컬(KST) 날짜·시간 "YYYY-MM-DDTHH:mm:ss"
const toMockDateTime = (date) =>
  `${toMockDate(date)}T${padTwo(date.getHours())}:${padTwo(date.getMinutes())}:${padTwo(date.getSeconds())}`;

// 목업 성공 응답: 공통 응답 형태
const createMockResponse = (data, message = null) => ({
  status: "success",
  code: null,
  message,
  data,
});

// 목업 실패 응답: axios 에러와 같은 형태 (error.response.status, error.response.data)
const createMockError = ({ status, code, message }) => {
  const error = new Error(code);
  error.response = { status, data: { status: "error", code, message, data: null } };
  return error;
};

const findMockType = (informationType) =>
  SAFETY_INFO_TYPE_MOCK.find((type) => type.informationType === informationType);

// 작성·수정 응답의 data 형태
const toMockItemResponse = (item) => {
  const type = findMockType(item.informationType);
  return {
    informationId: item.informationId,
    informationType: item.informationType,
    typeName: type.typeName,
    title: item.title,
    informationValue: item.informationValue,
    sensitive: type.sensitive,
    updatedAt: item.updatedAt,
  };
};

// "YYYY-MM-DD" 형식이고 실제 있는 날짜이며 오늘 이후가 아닌지 (new Date("YYYY-MM-DD")는 UTC로 해석되므로 직접 나눔)
const isValidMockBirthDate = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  return isRealDate && value <= toMockDate(new Date());
};

// 명세 입력 규칙 검사 (어기면 400 INVALID_INPUT)
// - title: titleRequired면 필수(공백만 불가, 150자 이하), 아니면 null 또는 생략. 빈 문자열은 항상 오류
// - informationValue: 필수, 공백만 불가, 1000자 이하. 생년월일·혈액형은 형식 검사
const isValidMockInput = (type, { title, informationValue }) => {
  if (title === "") return false;

  if (type.titleRequired) {
    if (typeof title !== "string" || !title.trim() || title.length > MOCK_TITLE_MAX_LENGTH) {
      return false;
    }
  } else if (title != null) {
    return false;
  }

  if (
    typeof informationValue !== "string" ||
    !informationValue.trim() ||
    informationValue.length > MOCK_VALUE_MAX_LENGTH
  ) {
    return false;
  }

  if (type.informationType === "BIRTH_DATE") return isValidMockBirthDate(informationValue);
  if (type.informationType === "BLOOD_TYPE") return MOCK_BLOOD_TYPE_LIST.includes(informationValue);
  return true;
};

/**
 * =====================================================================
 * API 함수
 * =====================================================================
 */

// 1. 안심카드 메인 조회 (GET /api/safety-information/summary)
// → data: { categories: [{ category, categoryName, lastUpdatedAt }], sharingCount }
export const getSafetyInfoSummaryApi = async () => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    const categories = SAFETY_INFO_CATEGORY_MOCK.map(({ category, categoryName }) => {
      // 분류 안 남아 있는 항목 중 가장 최근 수정 시각 (항목이 없으면 null)
      // 같은 형식의 문자열이라 문자열 비교로 최신값을 고름
      const updatedAtList = mockItems
        .filter((item) => findMockType(item.informationType).category === category)
        .map((item) => item.updatedAt)
        .sort();
      return { category, categoryName, lastUpdatedAt: updatedAtList.at(-1) ?? null };
    });
    return createMockResponse({ categories, sharingCount: SAFETY_INFO_SHARING_COUNT_MOCK });
  }

  const response = await axiosInstance.get(INFO_SHARE_API_URLS.summary);
  return response.data;
};

// 2. 분류별 항목 조회 (GET /api/safety-information?category={category})
// - category: BASIC / HEALTH / LIFE / ADVANCE_MESSAGE
// → data: { category, categoryName, types: [{ informationType, typeName, sensitive, multiple, titleRequired, items }] }
export const getSafetyInfoItemsApi = async ({ category }) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    const categoryInfo = SAFETY_INFO_CATEGORY_MOCK.find((item) => item.category === category);
    if (!categoryInfo) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.INVALID_INPUT);
    }

    const types = SAFETY_INFO_TYPE_MOCK.filter((type) => type.category === category).map(
      ({ informationType, typeName, sensitive, multiple, titleRequired }) => ({
        informationType,
        typeName,
        sensitive,
        multiple,
        titleRequired,
        items: mockItems
          .filter((item) => item.informationType === informationType)
          .map(({ informationId, title, informationValue, updatedAt }) => ({
            informationId,
            title,
            informationValue,
            updatedAt,
          })),
      }),
    );
    return createMockResponse({ ...categoryInfo, types });
  }

  const response = await axiosInstance.get(INFO_SHARE_API_URLS.items, {
    params: { category },
  });
  return response.data;
};

// 3. 항목 작성 (POST /api/safety-information) - 201 Created
// - title: titleRequired가 아닌 유형(생년월일·혈액형·주소·출입 방법)은 null
// - shouldMockFail: true면 목업에서 409 SAFETY_INFO_ALREADY_EXISTS를 흉내 냄 (USE_MOCK일 때만 사용)
// → data: { informationId, informationType, typeName, title, informationValue, sensitive, updatedAt }
export const postSafetyInfoApi = async ({
  informationType,
  title,
  informationValue,
  shouldMockFail = false,
}) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    if (shouldMockFail) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.SAFETY_INFO_ALREADY_EXISTS);
    }

    const type = findMockType(informationType);
    if (!type || !isValidMockInput(type, { title, informationValue })) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.INVALID_INPUT);
    }

    // 1개만 등록하는 유형을 이미 등록한 경우
    const hasItem = mockItems.some((item) => item.informationType === informationType);
    if (!type.multiple && hasItem) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.SAFETY_INFO_ALREADY_EXISTS);
    }

    const newItem = {
      informationId: mockNextInformationId,
      informationType,
      title: title ?? null,
      informationValue,
      updatedAt: toMockDateTime(new Date()),
    };
    mockNextInformationId += 1;
    mockItems = [...mockItems, newItem];
    return createMockResponse(toMockItemResponse(newItem), SAFETY_INFO_MOCK_MESSAGE.CREATE);
  }

  const response = await axiosInstance.post(INFO_SHARE_API_URLS.items, {
    informationType,
    title,
    informationValue,
  });
  return response.data;
};

// 4. 항목 수정 (PATCH /api/safety-information/{informationId})
// - informationId: useParams 값이면 호출 전에 Number()로 변환
// - 항목 유형은 바꿀 수 없음 (body에 informationType을 보내지 않음)
// - shouldMockFail: true면 목업에서 404 SAFETY_INFO_NOT_FOUND를 흉내 냄 (USE_MOCK일 때만 사용)
// → data: { informationId, informationType, typeName, title, informationValue, sensitive, updatedAt }
export const patchSafetyInfoApi = async ({
  informationId,
  title,
  informationValue,
  shouldMockFail = false,
}) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    const targetItem = mockItems.find((item) => item.informationId === informationId);
    if (shouldMockFail || !targetItem) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.SAFETY_INFO_NOT_FOUND);
    }

    const type = findMockType(targetItem.informationType);
    if (!isValidMockInput(type, { title, informationValue })) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.INVALID_INPUT);
    }

    // 이름이나 내용이 실제로 바뀐 경우에만 updatedAt 갱신 (명세 기준)
    const nextTitle = title ?? null;
    const isChanged =
      targetItem.title !== nextTitle || targetItem.informationValue !== informationValue;
    const updatedItem = {
      ...targetItem,
      title: nextTitle,
      informationValue,
      updatedAt: isChanged ? toMockDateTime(new Date()) : targetItem.updatedAt,
    };
    mockItems = mockItems.map((item) =>
      item.informationId === informationId ? updatedItem : item,
    );
    return createMockResponse(toMockItemResponse(updatedItem), SAFETY_INFO_MOCK_MESSAGE.UPDATE);
  }

  const response = await axiosInstance.patch(INFO_SHARE_API_URLS.item(informationId), {
    title,
    informationValue,
  });
  return response.data;
};

// 5. 항목 삭제 (DELETE /api/safety-information/{informationId})
// - informationId: useParams 값이면 호출 전에 Number()로 변환
// - shouldMockFail: true면 목업에서 404 SAFETY_INFO_NOT_FOUND를 흉내 냄 (USE_MOCK일 때만 사용)
// → data: { informationId }
export const deleteSafetyInfoApi = async ({ informationId, shouldMockFail = false }) => {
  if (USE_MOCK) {
    await wait(MOCK_DELAY);
    const hasItem = mockItems.some((item) => item.informationId === informationId);
    if (shouldMockFail || !hasItem) {
      throw createMockError(SAFETY_INFO_MOCK_ERROR.SAFETY_INFO_NOT_FOUND);
    }

    mockItems = mockItems.filter((item) => item.informationId !== informationId);
    return createMockResponse({ informationId }, SAFETY_INFO_MOCK_MESSAGE.DELETE);
  }

  const response = await axiosInstance.delete(INFO_SHARE_API_URLS.item(informationId));
  return response.data;
};
