import { useQuery } from "@tanstack/react-query";
import { getInformationOptionsApi } from "@/features/request/api/getApi";
import { REQUEST_QUERY_KEYS } from "@/features/request/constants/requestQueryKeys";

/**
 * 공개 항목 선택지 조회 (도움 종류 / 기존 요청 ID 기준)
 *  - select: 화면별 가공 함수 (생략하면 원본 응답)
 *  - enabled: 화면별 조회 조건 (예: helpType이 정해진 뒤에만)
 */
export const useInformationOptionsQuery = (
  { helpType, requestId } = {},
  { select, enabled = true } = {},
) =>
  useQuery({
    queryKey: REQUEST_QUERY_KEYS.informationOptions(helpType, requestId),
    queryFn: () => getInformationOptionsApi({ helpType, requestId }),
    select,
    enabled,
  });
