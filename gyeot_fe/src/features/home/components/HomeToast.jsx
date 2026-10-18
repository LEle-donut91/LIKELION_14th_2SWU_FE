import { useEffect } from "react";
import styles from "@/features/home/components/HomeToast.module.css";
import { TOAST_DURATION } from "@/features/home/constants/homeConstants";

// 하단 토스트 (예: "상황을 종료했어요.")
// 일정 시간 뒤 onHide 호출
function HomeToast({ message, onHide }) {
  useEffect(() => {
    const timerId = setTimeout(onHide, TOAST_DURATION);
    return () => clearTimeout(timerId);
  }, [onHide]);

  return (
    <div className={`${styles.homeToast} typoBodyMedium`} role="status">
      {message}
    </div>
  );
}

export default HomeToast;
