// 공유 중 목록 응답 한 건 → R-02-01 공유 정보 카드(SharedInfoCard) 모양으로 변환
// - 조회·철회·다시 허용은 안심카드(C-06)의 useSharingList를 같이 씀 (같은 API: GET /api/sharings?userId)

import { SHARE_STATUS } from "@/features/relation/constants/sharedInfo";
import {
  formatHelpType,
  formatShareDateTime,
  getUniqueSharedItems,
} from "@/features/card/utils/cardFormat";

/**
 * 공유 카드 한 장
 * → { id, title, startAt, endAt, items, status, canReallow }
 */
export const toSharedInfo = (item) => ({
  id: item.assignmentId, // 철회·다시 허용에 쓰는 ID
  title: formatHelpType(item.helpType), // 도움 종류 ("병원 동행")
  startAt: formatShareDateTime(item.startsAt), // "10/2 14:00"
  endAt: formatShareDateTime(item.accessUntil), // 자동 회수 시각
  items: getUniqueSharedItems(item.sharedItems).map((shared) => shared.typeName), // 같은 유형은 한 번만
  status: item.status === "REVOKED" ? SHARE_STATUS.WITHDRAWN : SHARE_STATUS.SHARING, // 서버 REVOKED → 화면 WITHDRAWN
  canReallow: item.canReallow, // 다시 허용 가능 여부
});

/**
 * 받은 정보 조회 응답 → 받은 정보 카드 목록
 * → [{ id, requestId, title, startAt, endAt, items }]
 *   - 서버가 접근 종료 시각 빠른 순으로 내려주므로 순서는 그대로 사용
 */
export const getReceivedSharingsService = (response) =>
  (response.data?.items ?? []).map((item) => ({
    id: item.requestId, // 카드 key + 선택 시 H-03-01 이동에 사용
    requestId: item.requestId,
    title: formatHelpType(item.helpType),
    startAt: formatShareDateTime(item.startsAt),
    endAt: formatShareDateTime(item.accessUntil),
    items: getUniqueSharedItems(item.sharedItems).map((shared) => shared.typeName),
  }));
