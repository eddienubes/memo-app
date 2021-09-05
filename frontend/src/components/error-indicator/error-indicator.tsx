import React, { FC } from 'react';
import { Wrapper } from "./error-indicator.styles";
import error from '../../assets/images/error.png';

const ErrorIndicator: FC = () => {
  return (
    <Wrapper>
      <img src={error} alt="error"/>
    </Wrapper>
  );
}

export default ErrorIndicator;