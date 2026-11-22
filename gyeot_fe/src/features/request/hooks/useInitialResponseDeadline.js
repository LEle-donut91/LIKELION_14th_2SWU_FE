import { useEffect, useRef } from "react";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { getInitialDueDateForStart } from "@/features/request/utils/dueDateFormat";

// 마운트(화면 재진입 포함)와 시작 일시 변경에만 초기값을 적용한다.
export function useInitialResponseDeadline(expectedEntryId, showToast, { preserveInitial = false } = {}) {
  const { entryId, form, setForm } = useRequestFormStore();
  const startKey = JSON.stringify(form.startDateTime);
  const initializedKey = useRef(null);

  useEffect(() => {
    if (String(entryId) !== String(expectedEntryId)) return;
    const key = JSON.stringify([entryId, startKey]);
    if (initializedKey.current === key) return;
    const isInitial = initializedKey.current === null;
    initializedKey.current = key;
    if (preserveInitial && (isInitial || !form.startDateTime)) return;
    const current = useRequestFormStore.getState().form;
    const result = getInitialDueDateForStart(current.startDateTime);
    setForm({ ...current, dueDate: result.dueDate });
    if (result.message) showToast(result.message);
  }, [entryId, expectedEntryId, startKey, setForm, showToast, preserveInitial, form.startDateTime]);
}
