import {
  FC,
  useReducer,
  useMemo,
  useCallback,
  Reducer,
  useEffect,
} from 'react';
import { initialState, IReducer, IState, reducer } from './reducer';
import { Context } from './context';
import { intervalToDuration } from 'date-fns';
import { useAppState } from '../AppProvider/provider';

const getFilter = (currentDate: any) => {
  const date = {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth(),
    day: currentDate.getDate(),
  };

  const startDay = new Date(date.year, date.month, 1, 0, 0, 0);
  const endDay = new Date(date.year, date.month + 1, 0, 0, 0, 0);

  const parse = (date: any, dateToParse: any) => {
    const result = `${date.year}-${
      dateToParse.getMonth() < 10
        ? '0' + (dateToParse.getMonth() + 1)
        : dateToParse.getMonth()
    }-${
      dateToParse.getDate() < 10
        ? '0' + dateToParse.getDate()
        : dateToParse.getDate()
    }`;

    return result;
  };

  const filter = encodeURI(
    `?timeMin=${parse(date, startDay)}T00:01:00Z&timeMax=${parse(
      date,
      endDay
    )}T23:59:00Z`
  );

  return filter;
};

const EventListProvider: FC = ({ children }) => {
  const appState = useAppState();
  const [state, dispatch] = useReducer<Reducer<IState, IReducer>>(
    reducer,
    initialState
  );

  const init = useCallback(() => {
    const currentDate = new Date();
    dispatch({
      type: 'INIT',
      payload: {
        currentDate: new Date(),
        month: currentDate.getMonth(),
      },
    });
  }, []);

  const list = useCallback(async () => {
    dispatch({ type: 'LOADING' });
    try {
      console.log(state.calendarId);

      const filter = getFilter(state.currentDate);
      const orderBy = '&orderBy=startTime';
      const singleEvents = '&singleEvents=true';
      const query = `${filter}${singleEvents}${orderBy}`;
      const url = `https://www.googleapis.com/calendar/v3/calendars/${state.calendarId}/events${query}`;
      const res: Response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${appState.token}`,
        },
      });
      if (res.status === 200) {
        const { items } = await res.json();
        dispatch({ type: 'RESPONSE', payload: items });
      } else {
        dispatch({ type: 'ERROR', payload: 'Error!' });
      }
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [state.currentDate, state.calendarId, appState.token]);

  const calendarList = useCallback(async () => {
    dispatch({ type: 'LOADING_CALENDAR_LIST' });
    try {
      const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList`;
      const res: Response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${appState.token}`,
        },
      });
      if (res.status === 200) {
        const { items } = await res.json();
        const filtered = items.filter((item: any) => {
          return item.summary.includes('__HOURS__');
        });
        dispatch({ type: 'RESPONSE_CALENDAR', payload: filtered });
      } else {
        dispatch({ type: 'ERROR', payload: 'Error!' });
      }
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [appState.token]);

  const remove = useCallback(
    async (id: string) => {
      dispatch({ type: 'REMOVE' });
      try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${state.calendarId}/events/${id}`;
        const res: Response = await fetch(url, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${appState.token}`,
          },
        });

        if (res.status === 204) {
          dispatch({ type: 'RESPONSE_REMOVE' });
          await list();
        } else {
          dispatch({ type: 'ERROR', payload: 'Error!' });
        }
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e });
      }
    },
    [appState.token, state.calendarId, list]
  );

  const insert = useCallback(
    async (command) => {
      dispatch({ type: 'INSERT' });
      try {
        const [d, s, e] = command.split(' ');
        const start = new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth(),
          d,
          s.substring(0, 2),
          s.substring(2)
        );
        const end = new Date(
          state.currentDate.getFullYear(),
          state.currentDate.getMonth(),
          d,
          e.substring(0, 2),
          e.substring(2)
        );

        const hour =
          intervalToDuration({ start, end }).hours +
          ':' +
          intervalToDuration({ start, end }).minutes;

        await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${state.calendarId}/events`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${appState.token}`,
            },
            body: JSON.stringify({
              summary: hour,
              start: {
                dateTime: start.toISOString(),
                timeZone: 'Europe/Warsaw',
              },
              end: {
                dateTime: end.toISOString(),
                timeZone: 'Europe/Warsaw',
              },
            }),
          }
        );
        await list();
      } catch (e) {
        dispatch({ type: 'ERROR', payload: e });
      }
    },
    [appState.token, state.currentDate, state.calendarId, list]
  );

  const insertCalendar = useCallback(async () => {
    dispatch({ type: 'INSERT_CALENDAR' });
    try {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${appState.token}`,
        },
        body: JSON.stringify({
          summary: `__HOURS__${Date.now()}`,
        }),
      });
      await calendarList();
      dispatch({ type: 'RESPONSE_INSERT_CALENDAR' });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: e });
    }
  }, [appState.token, calendarList]);

  const setCalendarId = (id: string) => {
    localStorage.setItem('calendarId', id);
    dispatch({ type: 'SET_CALENDAR_ID', payload: id });
  };

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
  }, [state.month, state.currentDate]);

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
  }, [state.month, state.currentDate]);

  useEffect(() => {
    init();
  }, [init]);

  const value = useMemo(
    () => ({
      state,
      actions: {
        list,
        calendarList,
        remove,
        insert,
        insertCalendar,
        nextMonth,
        prevMonth,
        setCalendarId,
      },
    }),
    [
      state,
      list,
      calendarList,
      remove,
      insert,
      insertCalendar,
      nextMonth,
      prevMonth,
    ]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default EventListProvider;
