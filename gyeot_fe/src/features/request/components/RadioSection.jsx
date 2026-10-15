import { useState } from "react";
import styles from "@/features/request/components/RadioSection.module.css";

function RadioSection() {
  // 선택된 항목의 값을 관리
  const [selected, setSelected] = useState(null);

  // 도움 종류 option 배열
  const options = [
    "병원 동행",
    "식사",
    "장보기",
    "반려동물",
    "연락/안부",
    "기타",
  ];

  return (
    <section>
      {/* section 타이틀 */}
      <span className={`${styles.sectionTitle} typoBodyStrong`}>도움 종류</span>

      {/* 라디오 버튼 container */}
      <div className={styles.radioContainer}>
        {/* 도움 종류 라디오 버튼 */}
        {options.map((item) => {
          // 사용자가 선택한 항목과 현재 그리는 항목 (item)이 같으면 true, 다르면 false
          const isSelected = selected === item;

          return (
            <button
              key={item}
              className={`${styles.radioBtn} ${isSelected ? styles.radioSelected : ""}`} // 선택된 항목과 선택되지 않은 항목 -> 다른 스타일 적용
              onClick={() => setSelected(item)} // 클릭 시, 선택된 항목 State로 추가
              role="radio"
              aria-checked={isSelected}
            >
              <span className={`${styles.radioTxt} typoBodySmall`}>{item}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default RadioSection;
