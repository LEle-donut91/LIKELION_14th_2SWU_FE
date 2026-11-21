import { useEffect, useState } from "react";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { isDueDateFixed } from "@/features/request/utils/dueDateFormat";
import { toDateFromInput } from "@/features/request/utils/dateTimeFormat";
import { MS_PER_MINUTE, START_MIN_LEAD_MINUTES } from "@/features/request/constants/timeConstants";

// 1시간 미만 경계에서 갱신하고, 탭 복귀·시스템 시각 변경도 다시 확인한다.
export function useLiveDueDateFixed(expectedEntryId) {
  const { entryId, form, setForm } = useRequestFormStore();
  const [now, setNow] = useState(() => new Date());
  const startKey = JSON.stringify(form.startDateTime);

  useEffect(() => {
    if (entryId !== expectedEntryId) return;
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      const currentTime = new Date();
      setNow(currentTime);
      const current = useRequestFormStore.getState().form;
      if (isDueDateFixed(current.startDateTime, currentTime)) {
        if (current.dueDate !== null) setForm({ ...current, dueDate: null });
        return;
      }
      const start = toDateFromInput(current.startDateTime);
      if (start) {
        const remaining = start - currentTime - START_MIN_LEAD_MINUTES * MS_PER_MINUTE;
        timer = setTimeout(refresh, Math.min(Math.max(remaining + 1, 1), 60_000));
      }
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [entryId, expectedEntryId, startKey, setForm]);

  return isDueDateFixed(form.startDateTime, now);
}
