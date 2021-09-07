import { createContext, Dispatch } from 'react';
import { User } from '../../common/types/user';
import { AxiosError } from "axios";


export interface IGlobalState {
  user: User | null;
  loggedIn: boolean;
  error: AxiosError | null;
  backgroundLoading: boolean;
  notification: string | null;
}


export type Actions =
  { type: 'setError'; payload: AxiosError | null } |
  { type: 'setGlobalState'; payload: User } |
  { type: 'setBackGroundLoading'; payload: boolean } |
  { type: 'setNotification'; payload: string | null };


export interface IGlobalStateContext {
  state: IGlobalState
  dispatch: Dispatch<Actions>
}

const GlobalStateContext = createContext<IGlobalStateContext>({} as IGlobalStateContext);

export default GlobalStateContext;
