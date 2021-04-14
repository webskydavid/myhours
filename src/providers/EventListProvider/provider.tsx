import { FC, useReducer, useMemo, useCallback, Reducer } from 'react';
import { initialState, IReducer, IState, reducer } from './reducer';
import { Context } from './context';

const EventListProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer<Reducer<IState, IReducer>>(
    reducer,
    initialState
  );

  const list = useCallback(async () => {}, []);

  const insert = useCallback(async () => {}, []);

  const value = useMemo(
    () => ({
      state,
      actions: {
        list,
        insert,
      },
    }),
    [state, list, insert]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default EventListProvider;
