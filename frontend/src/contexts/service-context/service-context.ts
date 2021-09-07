import { createContext } from 'react';
import UserService from '../../services/user-service';
import AuthService from '../../services/auth-service';
import PhrasesService from '../../services/phrases-service';
import TestService from '../../services/test-service';

interface IServices {
  authService: AuthService;
  phrasesService: PhrasesService;
  usersService: UserService;
  testService: TestService;
}



const ServicesContext = createContext<IServices>({} as IServices);

export default ServicesContext;