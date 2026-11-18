import { normalizeResponseDeadline } from "@/features/request/utils/dueDateUtils";
import { toUniqueNumberIds } from "@/features/request/utils/getSafetyCardInfo";
import {
  formatLocalDateTime,
  toDateFromInput,
} from "@/features/request/utils/dateTimeFormat";
import { toMinutes } from "@/features/request/utils/dueDateUtils";

// [H-03-02] 요청 작성 - 도움 요청 생성 API 요청 body 가공
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
    responseDeadlineHours:
      form.dueDate === null ? null : toMinutes(form.dueDate) / 60,
    informationIds: toUniqueNumberIds(form.informationIds),
  };
};

// 도움 요청 생성 응답에서 생성된 요청 정보를 추출한다.
export const postCareRequestResultService = (raw) => raw.data;

// TODO: 상황 목록 조회 API 연동 시 교체 (현재는 mock 데이터 가공)
export const getReqFormService = (raw) => {
  if (!raw) return { situation: [], user: [] };

  return {
    situation:
      raw.situation?.map((item) => ({
        id: item.id,
        title: item.title,
        startDate: item.startDate,
        endDate: item.endDate,
        joinCount: Number(item.joinCount),
      })) || [],
    user:
      raw.user?.map((user) => ({
        id: user.id,
        userName: user.userName,
        isGuardian: user.isGuardian,
      })) || [],
  };
};
