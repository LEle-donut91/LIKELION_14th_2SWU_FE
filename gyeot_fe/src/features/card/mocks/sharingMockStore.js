import {
  CARD_SHARING_MOCK,
  DEFAULT_SHARING_MOCK_SCENARIO,
} from "@/features/card/mocks/cardMockData";
import { SHARING_STATUS } from "@/features/card/constants/cardConstants";

// 공유 목업 저장소 (sharingApi.js·safetyInfoApi.js의 USE_MOCK 분기에서만 사용)
// - 시나리오(?mock=)별로 처음 데이터를 복사해 두고, 철회·다시 허용 결과를 반영
//   → 다시 조회하면 바뀐 상태가 보이고, C-00 메인 조회의 공유 중 건수도 함께 바뀜
// - 새로고침하면 처음 데이터로 돌아감

const storeByScenario = {};

// 시나리오의 공유 카드 목록 (없는 시나리오면 기본 시나리오)
export const getSharingMockStore = (scenario = DEFAULT_SHARING_MOCK_SCENARIO) => {
  const key = CARD_SHARING_MOCK[scenario] ? scenario : DEFAULT_SHARING_MOCK_SCENARIO;
  if (!storeByScenario[key]) {
    storeByScenario[key] = structuredClone(CARD_SHARING_MOCK[key].items);
  }
  return storeByScenario[key];
};

// 공유 중(SHARING) 카드 건수 (C-00 메인 조회 sharingCount용, 기본 시나리오 기준)
export const countSharingMockItems = () =>
  getSharingMockStore().filter((item) => item.status === SHARING_STATUS.SHARING).length;
