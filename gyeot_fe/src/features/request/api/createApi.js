import getReqFormMock from "@/features/request/mock/Request/getReqFormMock";
import postReqFormMock from "@/features/request/mock/Request/postReqFormMock";
import getInfoPreviewMock from "@/features/request/mock/InfoPreview/getInfoPreviewMock";
import postInfoPreviewMock from "@/features/request/mock/InfoPreview/postInfoPreviewMock";

/**
 * =====================================================================
 * [H-03-02] 요청 작성
 * - post/get/patch/delete + 요청 내용 + Api
 * - 데이터 조회 & 폼 제출
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 데이터 조회
export const getReqFormApi = () => {
  return getReqFormMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-02] 요청 작성 - 폼 제출
export const postReqFormApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postReqFormMock;
};

/**
 * =====================================================================
 * [H-03-02-01] 공개 정보 미리보기
 * - 데이터 조회 & 공개 정보 제출
 *
 * =====================================================================
 */

// TODO: API 연동 로직 수정 필요
// [H-03-02-01] 공개 정보 미리보기 - 데이터 조회
export const getInfoPreviewApi = (tempId) => {
  console.log(tempId);
  return getInfoPreviewMock;
};

// TODO: API 연동 로직 수정 필요
// [H-03-02-01] 공개 정보 미리보기 - 공개 정보 제출
export const postInfoPreviewApi = (payload) => {
  console.log("전송한 Payload:", payload);
  return postInfoPreviewMock;
};

/*
export const postReqFormApi = async (payload) => {
  try {
    const response = await axios.post("/request", payload);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "에러가 발생했습니다.";
    alert(message);
  }
};
*/
