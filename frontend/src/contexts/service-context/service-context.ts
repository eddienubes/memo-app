import { createContext } from 'react';
import UserService from '../../services/user-service';
import AuthService from '../../services/auth-service';
import PhrasesService from '../../services/phrases-service';

interface IServices {
  authService: AuthService;
  phrasesService: PhrasesService;
  usersService: UserService;
}



const ServicesContext = createContext<IServices>({} as IServices);

export default ServicesContext;