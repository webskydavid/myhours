import { FC, useReducer, useMemo, useCallback, Reducer } from 'react';
import { initialState, IReducer, IState, reducer } from './reducer';
import { AppContext } from './context';

const AppProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<IState, IReducer>>(
    reducer,
    initialState
  );

  const login = useCallback(async (tokenObj: any) => {
    dispatch({ type: 'IS_LOGGED_IN', payload: true });
    dispatch({ type: 'TOKEN', payload: tokenObj.access_token });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'IS_LOGGED_IN', payload: false });
    dispatch({ type: 'TOKEN', payload: '' });
  }, [dispatch]);

  const value = useMemo(
    () => ({
      state,
      actions: {
        login,
        logout
      }
    }),
    [state, login, logout]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
