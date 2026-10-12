import { NavLink } from "react-router-dom"; // 페이지 이동 버튼 도구
import styles from "./BottomNav.module.css"; // 디자인 파일 연결

// 아이콘 파일 가져오기
import IconHome from "../../assets/icons/IconHome.svg";
import IconSituation from "../../assets/icons/IconSituation.svg";
import IconPeople from "../../assets/icons/IconPeople.svg";
import IconHealthy from "../../assets/icons/IconHealthy.svg";

// 탭 목록 (이름, 이동할 주소, 아이콘)
const tabs = [
  { path: "/", label: "홈", icon: IconHome },
  { path: "/situation", label: "상황", icon: IconSituation },
  { path: "/relation", label: "관계", icon: IconPeople },
  { path: "/safecard", label: "안심카드", icon: IconHealthy },
];

export default function BottomNav() {
  return (
    <nav className={styles.bottomNav}> {/* 아래 바 전체 */}
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end
          // 선택된 탭이면 active 스타일 추가
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
        >
          {/* 아이콘 (SVG 모양에 글씨 색을 칠함) */}
          <span
            className={styles.navIcon}
            style={{
              maskImage: `url("${tab.icon}")`, // 따옴표로 감싸야 아이콘 모양이 제대로 잘림
              WebkitMaskImage: `url("${tab.icon}")`, // 크롬·사파리용
            }}
          />
          <span>{tab.label}</span> {/* 탭 글씨 */}
        </NavLink>
      ))}
    </nav>
  );
}