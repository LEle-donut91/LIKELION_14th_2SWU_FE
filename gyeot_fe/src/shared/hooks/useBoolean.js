// boolean 상태 관리를 위한 커스텀 훅
// 테마 (라이트, 다크모드) 전환, 사이드바/모달/드롭다운 상태 관리 시 사용
import { useState, useCallback } from "react";

export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  // 1. 켜기 (True)
  const setTrue = useCallback(() => setValue(true), []);

  // 2. 끄기 (False)
  const setFalse = useCallback(() => setValue(false), []);

  // 3. 반전 (Toggle)
  const toggle = useCallback(() => setValue((v) => !v), []);

  // 객체를 반환하여 필요한 것만 꺼내서 사용
  return { value, setValue, setTrue, setFalse, toggle };
}
