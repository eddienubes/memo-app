import React, {Component} from "react";
import ErrorIndicator from '../error-indicator';

interface Props {

}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state = {
    hasError: false
  };

  constructor(props: any) {
    super(props);
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) {
    this.setState(({hasError}) => {
      return {hasError: !hasError};
    });
    console.log(error, errorInfo)
  };

  render() {
    if (this.state.hasError)
      return <ErrorIndicator/>;
    return this.props.children;
  };
};
