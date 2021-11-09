import React from "react";
import crashlytics from '@react-native-firebase/crashlytics';
// import io.invertase.firebase.crashlytics.ReactNativeFirebaseCrashlyticsNativeHelper;


class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      console.log("Error boundary");
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      console.log("getDerivedStateFromError crash Error",error);
			crashlytics().setCrashlyticsCollectionEnabled(true);
			crashlytics().recordError(error);
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log("crash Error",error);
      console.log("crash info",errorInfo);
      crashlytics().log("componentDidCatch");
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