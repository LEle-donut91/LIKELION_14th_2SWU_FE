import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getEmergencyContacts,
  updateContactOrder,
} from "@/features/card/api/contactApi";
import { CONTACT_RELATIONSHIP_TYPE } from "@/features/card/constants/cardConstants";
import {
  CONTACT_MOCK_FAIL_QUERY_KEY,
  CONTACT_MOCK_QUERY_KEY,
} from "@/features/card/mocks/cardMockData";

const { GUARDIAN, MY_PERSON } = CONTACT_RELATIONSHIP_TYPE;

// 관계 유형별로 나누고 priority 순으로 정렬
const getContactsByType = (items, relationshipType) =>
  items
    .filter((item) => item.relationshipType === relationshipType)
    .sort((a, b) => a.priority - b.priority);

// 순서 비교용 문자열: [{ userId: 3 }, { userId: 4 }] → "3,4"
const getOrderKey = (contacts) =>
  contacts.map((contact) => contact.userId).join(",");

/**
 * [C-03] 연락 순서 조회 · 순서 변경 Hook
 * - 드래그 중에는 화면 순서만 바꾸고, 놓는 순간 저장 요청
 * - 저장 성공: onSaveSuccess 실행 (토스트)
 * - 저장 실패: 마지막으로 저장된 순서로 되돌림
 * - 저장 중(isSaving)에는 다음 드래그를 받지 않음
 *
 * @param {Function} onSaveSuccess  저장 성공 시 실행할 동작
 */
export const useContactOrder = ({ onSaveSuccess } = {}) => {
  const [guardians, setGuardians] = useState([]);
  const [myPeople, setMyPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 테스트용 쿼리 (?mock=empty, ?mockFail=true) - 실제 API 연동 시에는 무시됨
  const [searchParams] = useSearchParams();
  const mockScenario = searchParams.get(CONTACT_MOCK_QUERY_KEY) ?? undefined;
  const shouldMockFail = searchParams.get(CONTACT_MOCK_FAIL_QUERY_KEY) === "true";

  // 드래그 중 바뀐 최신 순서 (놓는 시점에 state보다 확실한 값을 읽기 위함)
  const latestOrderRef = useRef({ [GUARDIAN]: [], [MY_PERSON]: [] });
  // 마지막으로 저장된 순서 (실패 시 되돌릴 기준)
  const savedOrderRef = useRef({ [GUARDIAN]: [], [MY_PERSON]: [] });
  // 저장 중 여부 (state 반영 전에 들어오는 이벤트까지 막기 위해 ref로도 관리)
  const isSavingRef = useRef(false);
  // 저장 응답이 오기 전에 화면을 떠났는지
  const isUnmountedRef = useRef(false);

  const setContacts = useCallback((relationshipType, contacts) => {
    latestOrderRef.current[relationshipType] = contacts;
    if (relationshipType === GUARDIAN) {
      setGuardians(contacts);
    } else {
      setMyPeople(contacts);
    }
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // 조회
  useEffect(() => {
    let isIgnored = false; // 언마운트·재조회 이후 도착한 이전 응답 무시

    getEmergencyContacts({ mockScenario })
      .then((data) => {
        if (isIgnored) return;
        const items = data?.items ?? [];
        [GUARDIAN, MY_PERSON].forEach((relationshipType) => {
          const contacts = getContactsByType(items, relationshipType);
          savedOrderRef.current[relationshipType] = contacts;
          setContacts(relationshipType, contacts);
        });
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
  }, [mockScenario, setContacts]);

  // 드래그 중 순서 변경 (화면에만 반영)
  const handleReorder = useCallback(
    (relationshipType, nextContacts) => {
      if (isSavingRef.current) return;
      setContacts(relationshipType, nextContacts);
    },
    [setContacts],
  );

  // 드래그를 놓았을 때 저장
  const handleReorderEnd = useCallback(
    async (relationshipType) => {
      if (isSavingRef.current) return;

      const contacts = latestOrderRef.current[relationshipType];
      const savedContacts = savedOrderRef.current[relationshipType];

      // 순서가 그대로면 저장하지 않음
      if (getOrderKey(contacts) === getOrderKey(savedContacts)) return;

      isSavingRef.current = true;
      setIsSaving(true);

      try {
        await updateContactOrder({
          relationshipType,
          contactUserIds: contacts.map((contact) => contact.userId),
          shouldMockFail,
        });
        if (isUnmountedRef.current) return;
        savedOrderRef.current[relationshipType] = contacts;
        onSaveSuccess?.();
      } catch {
        if (isUnmountedRef.current) return;
        // 저장 실패: 원래 순서 유지
        setContacts(relationshipType, savedContacts);
      } finally {
        isSavingRef.current = false;
        if (!isUnmountedRef.current) setIsSaving(false);
      }
    },
    [onSaveSuccess, setContacts, shouldMockFail],
  );

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
