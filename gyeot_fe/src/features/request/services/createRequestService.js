import { toUniqueNumberIds } from "@/features/request/utils/getSafetyCardInfo";
import {
  formatLocalDateTime,
  toDateFromInput,
} from "@/features/request/utils/dateTimeFormat";
import { toMinutes } from "@/features/request/utils/dueDateFormat";

// [H-03-02] 요청 작성 - 도움 요청 생성 API 요청 body 가공
export const postCareRequestService = (form) => {
  const start = toDateFromInput(form.startDateTime);
  const end = toDateFromInput(form.endDateTime);
  return {
    payload: {
      situationId: Number(form.situationId),
      helpType: form.helpType,
      startsAt: start ? formatLocalDateTime(start) : null,
      endsAt: end ? formatLocalDateTime(end) : null,
      place: form.location,
      description: form.content ?? "",
      targetUserId: Number(form.userId),
      responseDeadlineHours:
        form.dueDate === null ? null : toMinutes(form.dueDate) / 60,
      informationIds: toUniqueNumberIds(form.informationIds),
    },
  };
};

// 도움 요청 생성 응답에서 생성된 요청 정보를 추출한다.
export const postCareRequestResultService = (raw) => raw.data;

