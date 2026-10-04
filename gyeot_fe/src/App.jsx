import styles from "@/App.module.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import ErrorFallback from "@/shared/components/ErrorFallback";
import Test from "@/features/test/components/Test";

function App() {
  return (
    // 모바일 프레임
    <div className={styles.frame}>
      {/* 모바일 프레임 내부 app (실제 content) */}
      <div className={styles.app}>
        <ErrorBoundary
          fallback={(error, reset) => (
            <ErrorFallback error={error} reset={reset} />
          )}
        >
          <BrowserRouter>
            <Routes>
              {/* CSS 변수 테스트용 페이지 */}
              <Route path="/" element={<Test />} />
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
