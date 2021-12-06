import React from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    crashlytics().setCrashlyticsCollectionEnabled(true);
    crashlytics().recordError(error);
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    crashlytics().log('componentDidCatch');
    crashlytics().recordError(error,errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
  
    return this.props.children; 
  }
}

export default ErrorBoundary;