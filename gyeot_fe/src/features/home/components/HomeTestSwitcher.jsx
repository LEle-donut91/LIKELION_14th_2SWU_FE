import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "@/features/home/components/HomeTestSwitcher.module.css";
import {
  DEFAULT_MOCK_SCENARIO,
  HOME_MOCK_SCENARIO_LIST,
  MOCK_QUERY_KEY,
} from "@/features/home/mocks/homeMockData";

/**
 * [테스트용] 홈 상황별 화면 전환 버튼
 * - 신규 / 상황 0개 / 상황 1개 / 상황 여러 개 테스트 데이터 전환 + 종료 토스트 확인
 * - URL 쿼리(?mock=...)만 바꾸므로 Home과 직접 연결되어 있지 않음
 * - 개발 서버(npm run dev)에서만 보이고, 빌드 결과물에는 표시되지 않음
 * - 제거: Home.jsx에서 import 1줄 + <HomeTestSwitcher /> 1줄 삭제
 */
function HomeTestSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  if (!import.meta.env.DEV) return null;

  const currentScenario =
    searchParams.get(MOCK_QUERY_KEY) ?? DEFAULT_MOCK_SCENARIO;

  const moveToScenario = (scenarioKey, state) => {
    navigate(
      {
        pathname: location.pathname,
        search: `?${MOCK_QUERY_KEY}=${scenarioKey}`,
      },
      { replace: true, state },
    );
  };

  const handleScenarioClick = (scenarioKey) => moveToScenario(scenarioKey);

  // 상황 종료 직후 진입 재현 (진행 중 상황 없음 + 토스트)
  const handleToastClick = () =>
    moveToScenario("empty", { isSituationEnded: true });

  return (
    <div className={styles.homeTestSwitcher}>
      {isOpen && (
        <div className={styles.panel}>
          {HOME_MOCK_SCENARIO_LIST.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`${styles.chip} ${
                key === currentScenario ? styles.selected : ""
              } typoCaptionMedium`}
              onClick={() => handleScenarioClick(key)}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`${styles.chip} typoCaptionMedium`}
            onClick={handleToastClick}
          >
            종료 토스트
          </button>
        </div>
      )}

      <button
        type="button"
        className={`${styles.toggleBtn} typoCaptionMedium`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      >
        {isOpen ? "닫기" : "TEST"}
      </button>
    </div>
  );
}

export default HomeTestSwitcher;
