import { normalizeResponseDeadline, toLocalDateTime, toMinutes } from "@/features/request/utils/requestUtils";

// 도움 요청 생성 API 관련
export const postCareRequestService = (requestForm, now = new Date()) => {
  const { form } = normalizeResponseDeadline(requestForm, now);
  return {
    situationId: Number(form.situationId),
    helpType: form.helpType,
    startsAt: toLocalDateTime(form.startDateTime),
    endsAt: toLocalDateTime(form.endDateTime),
    place: form.location,
    description: form.content ?? "",
    targetUserId: Number(form.userId),
    responseDeadlineHours: form.dueDate === null ? null : toMinutes(form.dueDate) / 60,
    informationIds: [...new Set((form.informationIds ?? []).map(Number))],
  };
};

// 도움 요청 생성 응답에서 생성된 요청 정보를 추출한다.
export const postCareRequestResultService = (raw) => raw.data;

