import "@/App.module.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorBoundary from "@/shared/components/ErrorBoundary";
import ErrorFallback from "@/shared/components/ErrorFallback";
import Test from "@/features/test/components/Test";

function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
