import { useReducer, Reducer } from 'react';
import {
  initialState,
  IState,
  LOGIN_FAILURE,
  LOGIN_RESPONSE,
  LOGOUT_RESPONSE,
  reducer,
} from './reducer';
import { createContainer } from 'react-tracked';

type IAction = { type: string; payload: any | boolean | string };

const useValue: any = () =>
  useReducer<Reducer<IState, IAction>>(reducer, initialState);

export const {
  Provider: AppProvider,
  useTrackedState: useAppState,
  useUpdate: useAppDispatch,
} = createContainer<IState, any, any>(useValue);

export const useActions = () => {
  const dispatch = useAppDispatch();

  const login = async (tokenObj: any) => {
    dispatch({ type: LOGIN_RESPONSE, payload: tokenObj.access_token });
  };

  const logout = () => {
    dispatch({ type: LOGOUT_RESPONSE });
  };

  const loginFailure = () => {
    dispatch({ type: LOGIN_FAILURE });
  };

  return {
    login,
    logout,
    loginFailure,
  };
};
