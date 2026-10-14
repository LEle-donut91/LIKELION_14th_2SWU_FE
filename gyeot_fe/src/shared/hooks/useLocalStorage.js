// 브라우저의 로컬 스토리지에 값을 저장 및 업데이트하거나, 값을 읽어올 수 있는 커스텀 훅
import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) { // localStorage 5MB 용량 초과 에러
      console.error("Local Storage Exceed Error", error);

      // 전체 스토리지를 초기화한다면 아래 주석을 해제하여 사용
      // localStorage.clear();
    }
  };

  return [storedValue, setValue];
}
