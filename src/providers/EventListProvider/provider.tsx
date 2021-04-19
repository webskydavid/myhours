import { useReducer, useCallback, Reducer, useEffect } from 'react';
import { initialState, IState, reducer } from './reducer';
import { IState as IAppState } from './../AppProvider/reducer';
import { format, getTime, intervalToDuration } from 'date-fns';
import { createContainer } from 'react-tracked';
import * as Service from './service';
import { ICalendar } from '../../models/calendar';
import { IEvent } from '../../models/event';

type IAction = { type: string; payload: any | boolean | string };

const eventListManipulator = (items: IEvent[]) => {
  let day = 0;
  const clone = [...items];
  clone.map((i: IEvent, index: number) => {
    let currentDay = Number.parseInt(format(new Date(i.start.dateTime), 'dd'));
    if (currentDay > day) {
      i.divider = day !== 0 ? true : false;
      day = currentDay;
    } else {
      i.divider = false;
    }
    i.selected = false;
    return i;
  });

  clone.sort((a, b) => {
    return (
      getTime(new Date(a.start.dateTime)) - getTime(new Date(b.start.dateTime))
    );
  });
  return clone;
};

const useValue: any = () =>
  useReducer<Reducer<IState, IAction>>(reducer, initialState);

export const {
  Provider: EventListProvider,
  useTrackedState: useEventListState,
  useUpdate: useEventListDispatch,
} = createContainer<IState, any, any>(useValue);

export const useEventListActions = (appState: IAppState) => {
  const state = useEventListState();
  const dispatch = useEventListDispatch();

  const list = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      const res = await Service.list(
        appState.token,
        state.calendarId,
        state.currentDate
      );

      dispatch({
        type: 'RESPONSE',
        payload: eventListManipulator(res!),
      });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [state.currentDate, state.calendarId, appState.token, dispatch]);

  const calendarList = useCallback(async () => {
    dispatch({ type: 'LOADING_CALENDAR_LIST' });
    try {
      const res = await Service.calendarList(appState.token);
      dispatch({ type: 'RESPONSE_CALENDAR', payload: res });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [dispatch, appState.token]);

  const remove = useCallback(
    async (id: string) => {
      dispatch({ type: 'REMOVE' });
      try {
        const res = await Service.remove(id, appState.token, state.calendarId);
        if (res) {
          dispatch({
            type: 'RESPONSE_REMOVE',
            payload: eventListManipulator(
              [...state.items].filter((e) => e.id !== id)
            ),
          });
        }
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e });
      }
    },
    [dispatch, appState.token, state.items, state.calendarId]
  );

  const insert = useCallback(
    async (command) => {
      dispatch({ type: 'INSERT' });
      try {
        const res = await Service.insert(
          command,
          appState.token,
          state.currentDate,
          state.calendarId
        );
        const items = [...state.items, res!];
        dispatch({
          type: 'RESPONSE_INSERT',
          payload: eventListManipulator(items),
        });
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e });
      }
    },
    [dispatch, appState.token, state.items, state.currentDate, state.calendarId]
  );

  const insertCalendar = useCallback(async () => {
    dispatch({ type: 'INSERT_CALENDAR' });
    try {
      const res = await Service.insertCalendar(appState.token);
      dispatch({ type: 'RESPONSE_INSERT_CALENDAR' });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [dispatch, appState.token]);

  const setCalendarId = (id: string) => {
    localStorage.setItem('calendarId', id);
    dispatch({ type: 'SET_CALENDAR_ID', payload: id });
  };

  const hasCalendar = useCallback(async () => {
    dispatch({ type: 'HAS_CALENDAR' });
    try {
      const res: ICalendar[] = (await Service.calendarList(
        appState.token
      )) as ICalendar[];
      if (res && res.length) {
        dispatch({ type: 'RESPONSE_HAS_CALENDAR', payload: [] });
      } else {
        dispatch({ type: 'ERROR', payload: 'Error!' });
      }
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [dispatch, appState.token]);

  const nextMonth = useCallback(() => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(state.month + 1);
    dispatch({
      type: 'CHANGE_DATE',
      payload: {
        month: state.month === 11 ? 0 : state.month + 1,
        currentDate: newDate,
      },
    });
  }, [dispatch, state.month, state.currentDate]);

  const prevMonth = useCallback(() => {
    const newDate = new Date(state.currentDate);
    newDate.setMonth(state.month - 1);
    dispatch({
      type: 'CHANGE_DATE',
      payload: {
        month: state.month === 0 ? 11 : state.month - 1,
        currentDate: newDate,
      },
    });
  }, [dispatch, state.month, state.currentDate]);

  return {
    list,
    calendarList,
    insert,
    insertCalendar,
    remove,
    setCalendarId,
    nextMonth,
    prevMonth,
  };
};
