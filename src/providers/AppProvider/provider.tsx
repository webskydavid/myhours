import { useReducer, Reducer } from 'react';
import { initialState, IState, reducer } from './reducer';
import { createContainer } from 'react-tracked';

type IAction =
  | { type: 'IS_LOGGED_IN'; payload: boolean }
  | { type: 'TOKEN'; payload: string };

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
    dispatch({ type: 'IS_LOGGED_IN', payload: true });
    dispatch({ type: 'TOKEN', payload: tokenObj.access_token });
  };

  const logout = () => {
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
    dispatch({ type: 'TOKEN', payload: '' });
  };

  return {
    login,
    logout,
  };
};
