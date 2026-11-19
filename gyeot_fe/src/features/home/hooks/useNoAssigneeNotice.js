import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getNoAssigneeNoticesApi,
  postNoAssigneeNoticeDismissApi,
} from "@/features/home/api/noAssigneeNoticeApi";
import { getNoAssigneeNoticesService } from "@/features/home/services/noAssigneeNoticeService";
import { HOME_QUERY_KEYS } from "@/features/home/constants/homeQueryKeys";
import { HOME_NAVIGATION_PATH } from "@/features/home/constants/homeConstants";
import {
  NOTICE_MOCK_FAIL_QUERY_KEY,
  NOTICE_MOCK_QUERY_KEY,
} from "@/features/home/mocks/noAssigneeNoticeMockData";
import { getErrorMessage } from "@/shared/utils/apiError";

// 이번 홈 진입에서 처리한 안내를 구분하는 key
// - 요청 ID + 사유: 같은 요청이라도 사유가 바뀌면 새 안내로 봄 (명세: 사유가 바뀌면 다시 띄움)
const toNoticeKey = (item) => `${item.id}:${item.state}`;

/**
 * [M-01] 담당자 없음 안내 목록 조회 · 닫기 Hook (홈 진입 시)
 * - 조회: 담당자 없음 안내 목록 → 모달 대기열 (서버 순서 그대로, 하나씩 표시)
 *   조회 실패는 모달만 띄우지 않음 (토스트 없음, 명세상 공통 에러 외 없음)
 * - [닫기]: 닫기 API 호출 후 결과를 기다리지 않고 다음 모달로 넘어감 (와이어프레임: 닫으면 다음 모달)
 * - [다른 사람]: 닫기 API 호출 후 N-06 다시 부탁하기로 이동 (명세: '다른 사람 고르기'로 벗어날 때도 기록)
 * - 닫기 성공: 안내 목록 key 무효화 → 홈에 다시 들어오면 남은 안내만 조회됨
 * - 닫기 실패: 에러 문구 안내(onDismissError). 다음 모달로는 그대로 넘어가고,
 *   서버에 기록되지 않았으므로 다음 홈 진입 때 다시 뜸
 * - '1/3' 표시: 처리한 안내를 목록에서 빼고 계산 → 무효화로 다시 조회해 목록이 줄어도 번호가 밀리지 않음
 * - 테스트: ?noticeMock=none·single·multi·all, ?noticeMockFail=true(닫기 404) - USE_MOCK일 때만
 *
 * @param {Function} onDismissError 닫기 실패 시 실행할 동작 (에러 문구 전달)
 * @returns {{
 *   currentItem: ReturnType<typeof getNoAssigneeNoticesService>[number] | null, // 지금 띄울 안내 (없으면 null)
 *   currentNumber: number, // 현재 순번 (1부터)
 *   totalCount: number,    // 이번 진입의 전체 안내 개수
 *   handleClose: Function,    // [닫기]
 *   handleAskAgain: Function, // [다른 사람]
 * }}
 */
export const useNoAssigneeNotice = ({ onDismissError } = {}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 테스트용 쿼리 (?noticeMock=..., ?noticeMockFail=true) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(NOTICE_MOCK_QUERY_KEY) ?? undefined;
  const shouldMockFail = searchParams.get(NOTICE_MOCK_FAIL_QUERY_KEY) === "true";

  // 이번 홈 진입에서 닫은 안내 key 목록 (홈을 벗어났다 오면 초기화)
  const [handledKeyList, setHandledKeyList] = useState([]);

  const { data: notices = [] } = useQuery({
    // 시나리오를 바꾸면 다시 조회되도록 key 뒤에 붙임 (앞부분으로 무효화 가능)
    queryKey: [...HOME_QUERY_KEYS.noAssigneeNotices(), { mockScenario }],
    queryFn: () => getNoAssigneeNoticesApi({ mockScenario }),
    select: getNoAssigneeNoticesService,
  });

  // useMutation에 둔 콜백은 홈을 벗어난 뒤([다른 사람] → N-06)에도 실행되어 무효화가 반영됨
  const { mutate: dismissNotice } = useMutation({
    mutationFn: postNoAssigneeNoticeDismissApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: HOME_QUERY_KEYS.noAssigneeNotices(),
      }),
    onError: (error) => onDismissError?.(getErrorMessage(error)),
  });

  const remainingNotices = notices.filter(
    (item) => !handledKeyList.includes(toNoticeKey(item)),
  );
  const currentItem = remainingNotices[0] ?? null;

  // 닫기 API 호출 (모달에 표시한 사유를 그대로 보냄)
  const dismiss = (item) =>
    dismissNotice({
      requestId: item.id,
      reason: item.state,
      mockScenario,
      shouldMockFail,
    });

  // [닫기] → 다음 모달 (마지막이면 모달 닫힘)
  const handleClose = () => {
    if (!currentItem) return;
    const noticeKey = toNoticeKey(currentItem);
    dismiss(currentItem);
    setHandledKeyList((prevKeyList) =>
      prevKeyList.includes(noticeKey) ? prevKeyList : [...prevKeyList, noticeKey],
    );
  };

  // [다른 사람] → N-06 다시 부탁하기 (요청 ID)
  const handleAskAgain = () => {
    if (!currentItem) return;
    dismiss(currentItem);
    navigate(HOME_NAVIGATION_PATH.ASK_AGAIN(currentItem.id));
  };

  return {
    currentItem,
    currentNumber: handledKeyList.length + 1,
    totalCount: handledKeyList.length + remainingNotices.length,
    handleClose,
    handleAskAgain,
  };
};
