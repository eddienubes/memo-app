import React from 'react';
import ServicesContext from './service-context';
import UserService from '../../services/user-service';
import AuthService from '../../services/auth-service';
import PhrasesService from '../../services/phrases-service';
import TestService from '../../services/test-service';

const ServicesContextProvider: React.FC = ({ children }) => {
  return (
    <ServicesContext.Provider value={{
      usersService: new UserService(),
      authService: new AuthService(),
      phrasesService: new PhrasesService(),
      testService: new TestService()
    }}>
      {children}
    </ServicesContext.Provider>
  )
}

export default ServicesContextProvider;