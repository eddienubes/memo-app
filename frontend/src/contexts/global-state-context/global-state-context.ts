import { createContext } from 'react';
import { User } from '../../common/types/user';

export interface IGlobalStateContext {
  user: User | null;
  loggedIn: boolean;
}


const GlobalStateContext = createContext<IGlobalStateContext>({} as IGlobalStateContext);

export default GlobalStateContext;
