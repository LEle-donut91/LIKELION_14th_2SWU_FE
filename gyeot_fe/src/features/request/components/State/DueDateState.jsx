import styles from "@/features/request/components/State/DueDateState.module.css";
import { useEffect, useRef, useState } from "react";

// number -> string으로 시간 값을 형변환
// padStart 함수를 이용 -> 숫자가 10보다 작으면 앞에 0을 추가로 붙임 (예: 01, 02, 03)
const intToString = (num) => {
  return String(num).padStart(2, "0");
};

function DueDateState({ isResponse, title, dueDate }) {
  // : 기준으로 시간/분/초로 분리해 변수에 저장
  const [hh, mm, ss] = dueDate.split(":");

  // 시간/분/초 string -> int 형변환
  const HH = hh ? parseInt(hh) : 0;
  const MM = mm ? parseInt(mm) : 0;
  const SS = ss ? parseInt(ss) : 0;

  // 시간, 분, 초 -> second(초) 단위로 계산
  const count = useRef(HH * 60 * 60 + MM * 60 + SS);

  const interval = useRef(null);
  const [hour, setHour] = useState(intToString(HH));
  const [minute, setMinute] = useState(intToString(MM));
  const [second, setSecond] = useState(intToString(SS));

  useEffect(() => {
    interval.current = setInterval(() => {
      // 0초보다 큰 경우에만, 1초씩 줄어드는 타이머 실행 
      if (count.current > 0) {
        count.current -= 1;
        setHour(intToString(parseInt(count.current / 3600)));
        setMinute(intToString(parseInt((count.current % 3600) / 60)));
        setSecond(intToString(count.current % 60));
      } else {
        // 0초 이하가 되면 타이머 삭제
        clearInterval(interval.current);
      }
    }, 1000);

    // 컴포넌트 언마운트/리렌더링 시 기존 타이머 삭제
    return () => clearInterval(interval.current);
  }, []);

  return (
    <div
      className={`${styles.component} ${isResponse ? styles.responseComponent : ""}`}
    >
      <span className={`${styles.title} typoBodySmall`}>{title}</span>
      <span
        className={`${styles.dueDate} ${isResponse ? `${styles.responseDueDate} typoBodyStrong` : "typoBodySmall"}`}
      >
        {isResponse ? `${hour}:${minute}:${second}` : dueDate}
      </span>
    </div>
  );
}

export default DueDateState;
