import { formatLocalDateTime, toDateFromInput } from "@/features/request/utils/dateFormat";

// 기존 수정안 또는 요청과 비교해 변경된 필드만 전송
export const patchEditService = (requestId, requestForm, response, informationOptions) => {
  const raw = response?.data ?? {};
  const before = raw.latestProposal?.after ?? raw;
  const payload = {};
  for (const [formKey, apiKey] of [["startDateTime", "startsAt"], ["endDateTime", "endsAt"]]) {
    const date = toDateFromInput(requestForm[formKey]);
    if (date && date.getTime() !== new Date(before[apiKey]).getTime()) {
      payload[apiKey] = formatLocalDateTime(date);
    }
  }
  if (requestForm.location !== before.place) payload.place = requestForm.location;
  const beforeIds = new Set((informationOptions?.data?.categories ?? [])
    .flatMap((category) => category.items ?? [])
    .filter((item) => item.selected)
    .map((item) => Number(item.informationId)));
  const informationIds = [...new Set((requestForm.informationIds ?? []).map(Number))];
  if (informationIds.length !== beforeIds.size || informationIds.some((id) => !beforeIds.has(id))) {
    payload.informationIds = informationIds;
  }
  return { requestId: Number(requestId), payload };
};
