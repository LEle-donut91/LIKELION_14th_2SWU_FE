import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  getEmergencyContactsApi,
  patchEmergencyContactsOrderApi,
} from "@/features/card/api/contactApi";
import { getEmergencyContactsService } from "@/features/card/services/contactService";
import { CARD_QUERY_KEYS } from "@/features/card/constants/cardQueryKeys";
import {
  CONTACT_ORDER_TOAST_MESSAGE,
  CONTACT_RELATIONSHIP_TYPE,
} from "@/features/card/constants/cardConstants";
import {
  CONTACT_MOCK_FAIL_QUERY_KEY,
  CONTACT_MOCK_QUERY_KEY,
} from "@/features/card/mocks/cardMockData";
import { AUTH_ERROR_CODE } from "@/shared/constants/errorCodeConstants";
import { getErrorCode } from "@/shared/utils/apiError";

// 관계 유형 → 화면 데이터 key
const ORDER_KEY_BY_TYPE = {
  [CONTACT_RELATIONSHIP_TYPE.GUARDIAN]: "guardians",
  [CONTACT_RELATIONSHIP_TYPE.MY_PERSON]: "myPeople",
};

// 조회 전·실패 시 빈 목록
const EMPTY_ORDER = { guardians: [], myPeople: [] };

// 순서 비교용 문자열: [{ userId: 3 }, { userId: 4 }] → "3,4"
const getOrderKey = (contacts) => contacts.map((contact) => contact.userId).join(",");

// 두 순서가 같은지 (보호자·나의 사람 모두)
const isSameOrder = (order, otherOrder) =>
  getOrderKey(order.guardians) === getOrderKey(otherOrder.guardians) &&
  getOrderKey(order.myPeople) === getOrderKey(otherOrder.myPeople);

/**
 * [C-03] 연락 순서 조회 · 순서 변경 Hook
 * - 조회: 비상연락망 조회 → { guardians, myPeople } (서버 순서 = 마지막으로 저장된 순서)
 * - 드래그 중에는 화면에서만 순서를 바꾸고(임시 순서), 놓는 순간 두 목록을 모두 보내 저장
 * - 저장 결과 (API_CONVENTIONS 9-3)
 *   - 성공: SAVE_SUCCESS 안내 + 다시 불러오기, 끝나면 임시 순서를 버림 (바뀐 순서 유지)
 *   - 409 CONTACT_ORDER_CHANGED: ORDER_CHANGED 안내 + 임시 순서를 버리고 최신 목록으로 갱신
 *   - 그 외 실패(400 등): SAVE_FAILED 안내 + 임시 순서를 버림 (마지막 저장 순서로 되돌림)
 * - 저장 중(isSaving)에는 다음 드래그를 받지 않음
 * - 테스트: ?mock=empty 등(시나리오), ?mockFail=true(400) / changed(409) - USE_MOCK일 때만
 *
 * @param {Function} onMessage 저장 결과 안내 문구를 전달받는 함수 (토스트)
 */
export const useContactOrder = ({ onMessage } = {}) => {
  const queryClient = useQueryClient();

  // 테스트용 쿼리 - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(CONTACT_MOCK_QUERY_KEY) ?? undefined;
  const mockFail = searchParams.get(CONTACT_MOCK_FAIL_QUERY_KEY) ?? undefined;

  const {
    data: savedOrder = EMPTY_ORDER,
    isPending: isLoading,
    isError: hasError,
  } = useQuery({
    queryKey: CARD_QUERY_KEYS.contacts(),
    queryFn: () => getEmergencyContactsApi({ mockScenario }),
    select: getEmergencyContactsService,
  });

  // 드래그 중·저장 중인 임시 순서 (null이면 서버 순서를 그대로 표시)
  const [draftOrder, setDraftOrder] = useState(null);
  // 드래그 중 바뀐 최신 순서 (놓는 시점에 state보다 확실한 값을 읽기 위함)
  const latestOrderRef = useRef(null);
  // 저장 중 여부 (state 반영 전에 들어오는 이벤트까지 막기 위해 ref로도 관리)
  const isSavingRef = useRef(false);

  // 임시 순서를 버리고 서버 순서로 돌아감
  const clearDraftOrder = () => {
    latestOrderRef.current = null;
    setDraftOrder(null);
  };

  const { mutate: saveOrder, isPending: isSaving } = useMutation({
    mutationFn: patchEmergencyContactsOrderApi,
    // 성공: 다시 불러오기가 끝날 때까지 기다린 뒤 임시 순서를 버림 (onSettled)
    onSuccess: () => {
      onMessage?.(CONTACT_ORDER_TOAST_MESSAGE.SAVE_SUCCESS);
      return queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.contacts() });
    },
    onError: (error) => {
      if (getErrorCode(error) === AUTH_ERROR_CODE.CONTACT_ORDER_CHANGED) {
        onMessage?.(CONTACT_ORDER_TOAST_MESSAGE.ORDER_CHANGED);
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.contacts() });
        return;
      }
      onMessage?.(CONTACT_ORDER_TOAST_MESSAGE.SAVE_FAILED);
    },
    onSettled: () => {
      isSavingRef.current = false;
      clearDraftOrder();
    },
  });

  // 화면에 그릴 순서
  const { guardians, myPeople } = draftOrder ?? savedOrder;

  // 드래그 중 순서 변경 (화면에만 반영)
  const handleReorder = (relationshipType, nextContacts) => {
    if (isSavingRef.current) return;
    const nextOrder = {
      ...(latestOrderRef.current ?? savedOrder),
      [ORDER_KEY_BY_TYPE[relationshipType]]: nextContacts,
    };
    latestOrderRef.current = nextOrder;
    setDraftOrder(nextOrder);
  };

  // 드래그를 놓았을 때 저장 (두 목록을 모두 보냄)
  // - relationshipType은 목록 컴포넌트에서 넘겨주지만, 바꾸지 않은 그룹도 함께 보내므로 사용하지 않음
  const handleReorderEnd = () => {
    if (isSavingRef.current) return;

    const order = latestOrderRef.current;
    if (!order) return;

    // 순서가 그대로면 저장하지 않음
    if (isSameOrder(order, savedOrder)) {
      clearDraftOrder();
      return;
    }

    isSavingRef.current = true;
    saveOrder({
      guardianUserIds: order.guardians.map((contact) => contact.userId),
      emergencyContactUserIds: order.myPeople.map((contact) => contact.userId),
      mockScenario,
      mockFail,
    });
  };

  return {
    guardians,
    myPeople,
    isLoading,
    hasError,
    isSaving,
    handleReorder,
    handleReorderEnd,
  };
};