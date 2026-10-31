import styles from "@/features/request/components/Toast/DefaultToast.module.css";
import { TOAST_DURATION } from "@/features/request/constants/requestConstants";
import { useEffect } from "react";

// 일정 시간 뒤 onHide 호출
function DefaultToast({ message, onHide }) {
  useEffect(() => {
    const timerId = setTimeout(onHide, TOAST_DURATION);
    return () => clearTimeout(timerId);
  }, [onHide]);

  return (
    <div className={`${styles.defaultToast} typoBodyMedium`} role="status">
      {message}
    </div>
  );
}

export default DefaultToast;
