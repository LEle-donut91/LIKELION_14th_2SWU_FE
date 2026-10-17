import { Component, Fragment } from "react";

class ErrorBoundary extends Component {
  state = {
    error: null,
    errorCount: 0, // 에러 발생 횟수(key 값) 관리
  };

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  // 에러가 잡힐 때마다 errorCount를 1씩 증가 -> key 변경
  componentDidCatch() {
    this.setState((state) => ({ errorCount: state.errorCount + 1 }))
  }

  reset = () => {
    this.setState({
      error: null,
    });
  };

  render() {
    const { error, errorCount } = this.state;

    if (error) {
      const { fallback } = this.props;

      return typeof fallback === "function"
        ? fallback(error, this.reset)
        : fallback;
    }

    // errorCount가 바뀔 때마다 Fragment의 key가 변경 -> 내부의 모든 자식 컴포넌트 트리를 완전히 새로 마운트
    return (
      <Fragment key={errorCount}>
        {this.props.children}
      </Fragment>
    );
  }
}

export default ErrorBoundary;
