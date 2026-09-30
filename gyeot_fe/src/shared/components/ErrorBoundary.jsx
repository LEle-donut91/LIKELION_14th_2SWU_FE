import { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    error: null,
  };

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  reset = () => {
    this.setState({
      error: null,
    });
  };

  render() {
    const { error } = this.state;

    if (error) {
      const { fallback } = this.props;

      return typeof fallback === "function"
        ? fallback(error, this.reset)
        : fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
