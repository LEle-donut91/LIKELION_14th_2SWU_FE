import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getSharings,
  reallowSharing,
  revokeSharing,
} from "@/features/card/api/sharingApi";
import {
  SHARE_TOAST_MESSAGE,
  SHARING_STATUS,
} from "@/features/card/constants/cardConstants";
import {
  SHARING_MOCK_FAIL_QUERY_KEY,
  SHARING_MOCK_QUERY_KEY,
} from "@/features/card/mocks/cardMockData";

// 실패 응답에서 보여줄 문구: 서버 message 우선, 없으면 기본 문구
const getErrorMessage = (error) =>
  error?.response?.data?.message ?? SHARE_TOAST_MESSAGE.ERROR;

/**
 * [C-06] 공유 중 목록 조회 · 직접 철회 · 다시 허용 Hook
 * - 철회 / 다시 허용 성공: 응답으로 해당 카드만 갱신하고 onActionSuccess 실행 (토스트)
 * - 철회 / 다시 허용 실패(404·409 등): onActionError 실행 후 목록을 다시 조회
 *   (화면을 열어 둔 사이 요청이 끝나 서버에서 사라진 카드도 이때 정리됨)
 * - 처리 중(pendingId)에는 다른 카드의 버튼도 받지 않음
 *
 * @param {number}   userId           받는 사람 ID (R-02-01처럼 한 사람 기준으로 볼 때만 전달)
 * @param {Function} onActionSuccess  성공 시 실행할 동작 (message 전달)
 * @param {Function} onActionError    실패 시 실행할 동작 (message 전달)
 */
export const useSharingList = ({ userId, onActionSuccess, onActionError } = {}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  // 값이 바뀌면 목록을 다시 조회
  const [reloadKey, setReloadKey] = useState(0);

  // 테스트용 쿼리 (?mock=empty, ?mockFail=true) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(SHARING_MOCK_QUERY_KEY) ?? undefined;
  const shouldMockFail = searchParams.get(SHARING_MOCK_FAIL_QUERY_KEY) === "true";

  // 처리 중 여부 (state 반영 전에 들어오는 연속 클릭까지 막기 위해 ref로도 관리)
  const pendingIdRef = useRef(null);
  // 응답이 오기 전에 화면을 떠났는지
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // 조회 (진입 시 + 실패 후 다시 조회)
  // - 다시 조회하는 동안에는 기존 목록을 그대로 보여줌 (isLoading은 첫 조회에만 사용)
  useEffect(() => {
    let isIgnored = false; // 언마운트·재조회 이후 도착한 이전 응답 무시

    getSharings({ userId, mockScenario })
      .then((data) => {
        if (isIgnored) return;
        setItems(data?.items ?? []);
        setHasError(false);
      })
      .catch(() => {
        if (!isIgnored) setHasError(true);
      })
      .finally(() => {
        if (!isIgnored) setIsLoading(false);
      });

    return () => {
      isIgnored = true;
    };
  }, [userId, mockScenario, reloadKey]);

  // 카드 하나만 바꾸기
  const updateItem = useCallback((assignmentId, changes) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.assignmentId === assignmentId ? { ...item, ...changes } : item,
      ),
    );
  }, []);

  // 철회 / 다시 허용 공통 처리
  const runAction = useCallback(
    async (assignmentId, request, getChanges, defaultSuccessMessage) => {
      if (pendingIdRef.current !== null) return;

      pendingIdRef.current = assignmentId;
      setPendingId(assignmentId);

      try {
        const response = await request(assignmentId, { shouldMockFail });
        if (isUnmountedRef.current) return;
        updateItem(assignmentId, getChanges(response.data));
        onActionSuccess?.(response.message ?? defaultSuccessMessage);
      } catch (error) {
        if (isUnmountedRef.current) return;
        onActionError?.(getErrorMessage(error));
        // 명세: 404 / 409 시 '공유 중 목록 조회'를 다시 불러와 카드 상태를 새로고침
        setReloadKey((key) => key + 1);
      } finally {
        pendingIdRef.current = null;
        if (!isUnmountedRef.current) setPendingId(null);
      }
    },
    [onActionError, onActionSuccess, shouldMockFail, updateItem],
  );

  // [직접 철회] → 철회됨 카드로 변경, canReallow에 따라 [다시 허용] 표시
  const handleRevoke = useCallback(
    (assignmentId) =>
      runAction(
        assignmentId,
        revokeSharing,
        (data) => ({
          status: data?.status ?? SHARING_STATUS.REVOKED,
          canReallow: Boolean(data?.canReallow),
        }),
        SHARE_TOAST_MESSAGE.REVOKE_SUCCESS,
      ),
    [runAction],
  );

  // [다시 허용] → 공유 중 카드로 변경, 다시 공개된 항목으로 태그 교체
  const handleReallow = useCallback(
    (assignmentId) =>
      runAction(
        assignmentId,
        reallowSharing,
        (data) => ({
          status: data?.status ?? SHARING_STATUS.SHARING,
          canReallow: false,
          ...(data?.sharedItems && { sharedItems: data.sharedItems }),
        }),
        SHARE_TOAST_MESSAGE.REALLOW_SUCCESS,
      ),
    [runAction],
  );

  return {
    items,
    isLoading,
    hasError,
    pendingId,
    handleRevoke,
    handleReallow,
  };
};
