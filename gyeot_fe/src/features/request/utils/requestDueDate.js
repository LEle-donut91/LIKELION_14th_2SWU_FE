import {
  DUE_DATE_DEFAULT_MINUTES,
  MS_PER_MINUTE,
} from "@/features/request/constants/timeConstants";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";

// 진입 또는 시작 일시 변경 시, 시작까지 24시간 미만이면 기한을 null로 맞춘다.
export const getRequestDueDate = (startDateTime, dueDate, now = new Date()) => {
  const start = toDateFromInput(startDateTime);
  return start && start - now < DUE_DATE_DEFAULT_MINUTES * MS_PER_MINUTE
    ? null
    : dueDate;
};
