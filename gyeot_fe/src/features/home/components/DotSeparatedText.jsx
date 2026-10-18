import { Fragment } from "react";
import styles from "@/features/home/components/DotSeparatedText.module.css";
import MaskIcon from "@/features/home/components/MaskIcon";
import iconPoint from "@/shared/assets/icons/IconPoint.svg";

// 텍스트 목록을 점(•) 아이콘으로 구분해 한 줄로 표시
// 예: ["10/1(목) 22:00", "슈슈 병원"] → 10/1(목) 22:00 • 슈슈 병원
function DotSeparatedText({ items, className = "" }) {
  const visibleItems = items.filter(Boolean);

  return (
    <p className={`${styles.dotSeparatedText} ${className}`}>
      {visibleItems.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          {index > 0 && <MaskIcon src={iconPoint} size={12} />}
          <span>{item}</span>
        </Fragment>
      ))}
    </p>
  );
}

export default DotSeparatedText;
