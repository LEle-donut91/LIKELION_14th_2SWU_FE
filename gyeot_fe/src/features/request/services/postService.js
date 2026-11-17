import { normalizeResponseDeadline, toMinutes } from "@/features/request/utils/requestUtils";
import { formatLocalDateTime, toDateFromInput } from "@/features/request/utils/dateFormat";

// 도움 요청 생성 API 관련
export const postCareRequestService = (requestForm, now = new Date()) => {
  const { form } = normalizeResponseDeadline(requestForm, now);
  const start = toDateFromInput(form.startDateTime);
  const end = toDateFromInput(form.endDateTime);
  return {
    situationId: Number(form.situationId),
    helpType: form.helpType,
    startsAt: start ? formatLocalDateTime(start) : null,
    endsAt: end ? formatLocalDateTime(end) : null,
    place: form.location,
    description: form.content ?? "",
    targetUserId: Number(form.userId),
    responseDeadlineHours: form.dueDate === null ? null : toMinutes(form.dueDate) / 60,
    informationIds: [...new Set((form.informationIds ?? []).map(Number))],
  };
};

// 도움 요청 생성 응답에서 생성된 요청 정보를 추출한다.
export const postCareRequestResultService = (raw) => raw.data;

export const postEditFormService = (requestId, requestForm) => ({
  requestId,
  startAt: requestForm.startDateTime,
  endAt: requestForm.endDateTime,
  location: requestForm.location,
  informationIds: requestForm.informationIds,
});

export const postAskAgainService = (requestId, requestForm, now = new Date()) => {
  const { form } = normalizeResponseDeadline(requestForm, now);
  return {
    requestId,
    payload: {
      targetUserId: Number(form.userId),
      ...(form.dueDate !== null && {
        responseDeadlineHours: toMinutes(form.dueDate) / 60,
      }),
      informationIds: [...new Set((form.informationIds ?? []).map(Number))],
    },
  };
};

