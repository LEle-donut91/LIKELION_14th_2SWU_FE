import { useCallback } from "react";
import { useRequestFormStore } from "@/features/request/stores/useRequestFormStore";
import { flattenInformationItems } from "@/features/request/utils/getSafetyCardInfo";

export const useRefreshInformationSelection = (refetchInformation) => {
  return useCallback(async () => {
    const { entryId, informationSelectionKey } = useRequestFormStore.getState();
    const result = await refetchInformation();
    // 재조회 실패 시 기존 선택을 보존한다.
    if (!result.isSuccess || !Array.isArray(result.data?.data?.categories)) return;

    const current = useRequestFormStore.getState();
    // 재조회 도중 다른 요청 폼으로 이동했다면 그 폼은 변경하지 않는다.
    if (current.entryId !== entryId || current.informationSelectionKey !== informationSelectionKey) return;

    const validIds = new Set(
      flattenInformationItems(result.data).map((item) => Number(item.informationId)),
    );
    current.setForm((form) => ({
      ...form,
      informationIds: form.informationIds.filter((id) => validIds.has(Number(id))),
    }));
  }, [refetchInformation]);
};
